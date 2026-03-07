import { createPool, Pool, PoolOptions, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

let promisePool: Pool | null = null;

// Cache debug flag to avoid repeated parsing
const IS_DEBUG = Number(process.env.IS_DEBUGGER ?? '0') === 1;

// Default pool configuration
const DEFAULT_POOL_OPTIONS: Partial<PoolOptions> = {
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000,
};

/**
 * Log debug information if debug mode is enabled
 */
function debugLog(operation: string, detail: string): void {
  if (IS_DEBUG) {
    console.info(`${new Date().toISOString()}: ${operation}: ${detail}`);
  }
}

/**
 * Get or create the database connection pool (singleton pattern)
 */
async function getPool(): Promise<Pool> {
  if (promisePool) return promisePool;

  promisePool = createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
    ...DEFAULT_POOL_OPTIONS,
  });

  return promisePool;
}

/**
 * Query data from database
 * @param sql - SQL query string
 * @param sqlParams - Query parameters
 * @param single - Return single row if true, array otherwise
 * @returns Single row object or array of rows
 */
export async function getData<T = any>(
  sql: string,
  sqlParams: any[] = [],
  single = false
): Promise<T | T[]> {
  debugLog('getData', `${sql} --> ${sqlParams.join()}`);

  try {
    const pool = await getPool();
    const [rows] = await pool.query<RowDataPacket[]>(sql, sqlParams);
    return single ? (rows[0] ?? {}) as T : rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    return single ? {} as T : [] as T[];
  }
}

/**
 * Execute SQL statement (INSERT, UPDATE, DELETE)
 * Includes retry logic for deadlock detection
 * @param sql - SQL statement
 * @param sqlParams - Statement parameters
 * @returns Number of affected rows, 0 on error
 */
export async function execute(
  sql: string,
  sqlParams: any[] = []
): Promise<number> {
  debugLog('execute', `${sql} --> ${sqlParams.join()}`);

  const pool = await getPool();
  const maxRetries = 3;
  const baseDelay = 200;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const [result] = await pool.execute<ResultSetHeader>(sql, sqlParams);
      
      // For stored procedures, return 1 to indicate success
      if (sql.trim().toUpperCase().startsWith('CALL')) {
        return 1;
      }
      
      return result.affectedRows;
    } catch (err: unknown) {
      const dbError = err as { code?: string };
      
      if (dbError.code === 'ER_LOCK_DEADLOCK' && attempt < maxRetries - 1) {
        const delay = baseDelay * (attempt + 1);
        console.warn(`⚠️ Deadlock detected, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error(`Execute error: ${sql} --> ${sqlParams.join()}`, err);
        return 0;
      }
    }
  }

  return 0;
}

/**
 * Execute SQL INSERT and return the auto-increment ID
 * @param sql - SQL INSERT statement
 * @param sqlParams - Statement parameters
 * @returns The insert ID, or 0 on error
 */
export async function executeID(
  sql: string,
  sqlParams: any[] = []
): Promise<number> {
  debugLog('executeID', `${sql} --> ${sqlParams.join()}`);

  try {
    const pool = await getPool();
    const [result] = await pool.execute<ResultSetHeader>(sql, sqlParams);
    return result.insertId ?? 0;
  } catch (error) {
    console.error('Database executeID error:', error);
    return 0;
  }
}

/**
 * Execute a stored SQL query from aux_tree table
 * @param cid - The SQL query identifier in aux_tree
 * @param sqlParams - Query parameters
 * @param single - Return single row if true, array otherwise
 * @returns Query results
 */
export async function getJsonArray<T = any>(
  cid: string,
  sqlParams: any[] = [],
  single = false
): Promise<T | T[]> {
  const pool = await getPool();
  
  // Get the SQL query string from aux_tree
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT sqls FROM aux_tree WHERE id = ?',
    [cid]
  );
  
  const sql = rows[0]?.sqls as string | undefined;
  
  if (!sql) {
    console.error(`getJsonArray: No SQL found for cid=${cid}`);
    return single ? {} as T : [] as T[];
  }
  
  debugLog('getJsonArray', `${cid} --> ${sql} --> ${sqlParams.join()}`);

  try {
    const [resultRows] = await pool.query<RowDataPacket[]>(sql, sqlParams);
    return single ? (resultRows[0] ?? {}) as T : resultRows as T[];
  } catch (error) {
    console.error(`getJsonArray error for cid=${cid}:`, error);
    return single ? {} as T : [] as T[];
  }
}

/**
 * Paginated query using stored procedure
 * @param tid - Table/view identifier
 * @param ps - Page size
 * @param pi - Page index
 * @param s - Sort column
 * @param a - Sort order (asc/desc)
 * @param w - WHERE clause condition
 * @returns Paginated result with rows, total count, and page count
 */
export async function getPageData(
  tid: string,
  ps: number,
  pi: number,
  s: string,
  a: 'asc' | 'desc',
  w: string
): Promise<{ rows: any[]; total: number; pages: number }> {
  debugLog('getPageData', `${[tid, ps, pi, s, a, w].join()}`);

  const pool = await getPool();
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL get_page(?,?,?,?,?,?)',
    [tid, ps, pi, s, a, w]
  );

  // Stored procedure returns [data rows, count row]
  const rows = result[0] ?? [];
  const total = (result[1] as any)?.[0]?.mcount ?? 0;
  const pages = ps > 0 ? Math.ceil(total / ps) : 0;

  return { rows, total, pages };
}

/**
 * Close the connection pool gracefully
 */
export async function closePool(): Promise<void> {
  if (promisePool) {
    await promisePool.end();
    promisePool = null;
    console.info('Database connection pool closed.');
  }
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(): Promise<void> {
  console.info('Shutting down gracefully...');
  await closePool();
  process.exit(0);
}

// Register shutdown handlers
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Export pool getter for advanced use cases
export { getPool };
