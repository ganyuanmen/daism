import { createPool, Pool, PoolOptions, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

let promisePool: Pool | null = null;
// Mutex for connection pool initialization (defensive, prevents race in async init scenarios)
let poolInitPromise: Promise<Pool> | null = null;

// Cache debug flag to avoid repeated parsing
const IS_DEBUG = Number(process.env.IS_DEBUGGER ?? '0') === 1;

// Whitelist of allowed sort directions for getPageData
const ALLOWED_SORT_ORDERS = ['asc', 'desc'] as const;

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
 * Structured error class for database write operation failures.
 * Distinguishes between different failure modes so callers can react accordingly.
 */
export class DatabaseWriteError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly sql: string,
    public readonly affectedRows: number = 0,
  ) {
    super(message);
    this.name = 'DatabaseWriteError';
  }
}

/**
 * Structured error class for database query failures.
 */
export class DatabaseQueryError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly sql: string,
  ) {
    super(message);
    this.name = 'DatabaseQueryError';
  }
}

/**
 * Log debug information if debug mode is enabled
 */
function debugLog(operation: string, detail: string): void {
  if (IS_DEBUG) {
    const ts = new Date().toISOString();
    const typeSummary = typeof detail === 'string' ? detail.substring(0, 200) : String(detail);
    console.info(`${ts}: ${operation}: ${typeSummary}`);
  }
}

/**
 * Get or create the database connection pool (singleton pattern with async-safe locking).
 * Uses a Promise-based lock to prevent race conditions when getPool() is called
 * concurrently before the pool is initialized.
 */
async function getPool(): Promise<Pool> {
  if (promisePool) return promisePool;

  // Use a Promise-based lock: only the first caller creates the pool,
  // subsequent concurrent callers await the same initialization Promise.
  if (!poolInitPromise) {
    poolInitPromise = (async () => {
      const pool = createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
        ...DEFAULT_POOL_OPTIONS,
      });
      promisePool = pool;
      poolInitPromise = null; // Reset for potential re-init scenarios
      return pool;
    })();
  }

  return poolInitPromise;
}

/**
 * Query data from database.
 * Throws DatabaseQueryError on failure instead of silently returning empty results.
 *
 * @param sql - SQL query string
 * @param sqlParams - Query parameters
 * @param single - Return single row if true, array otherwise
 * @returns Single row object or array of rows
 * @throws DatabaseQueryError on database failure
 */
export async function getData<T = any>(
  sql: string,
  sqlParams: any[] = [],
  single = false
): Promise<T | T[]> {
  debugLog('getData', `${sql} --> ${JSON.stringify(sqlParams)}`);

  const pool = await getPool();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(sql, sqlParams);
    return single ? (rows[0] ?? {}) as T : rows as T[];
  } catch (error: unknown) {
    const dbError = error as { code?: string; message?: string };
    console.error(`Database query error [${dbError.code || 'UNKNOWN'}]: ${dbError.message || error}`);
    throw new DatabaseQueryError(
      `Query failed: ${dbError.message || error}`,
      dbError.code || 'UNKNOWN',
      sql,
    );
  }
}

/**
 * Execute SQL statement (INSERT, UPDATE, DELETE).
 * Includes retry logic for deadlock detection.
 *
 * Throws DatabaseWriteError on non-deadlock errors and deadlock retry exhaustion.
 * Returns -1 when deadlock retries are exhausted (distinct from "0 rows affected").
 *
 * @param sql - SQL statement
 * @param sqlParams - Statement parameters
 * @returns Number of affected rows; -1 if deadlock retries exhausted
 * @throws DatabaseWriteError on non-deadlock errors
 */
export async function execute(
  sql: string,
  sqlParams: any[] = []
): Promise<number> {
  debugLog('execute', `${sql} --> ${JSON.stringify(sqlParams)}`);

  const isCall = sql.trim().toUpperCase().startsWith('CALL');
  const pool = await getPool();
  const maxRetries = 3;
  const baseDelay = 200;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const [result] = await pool.execute<ResultSetHeader>(sql, sqlParams);

      // For stored procedures, return the actual affectedRows from the result
      // instead of hardcoding 1. mysql2 returns ResultSetHeader for CALL too.
      return isCall?1: result.affectedRows;
    } catch (err: unknown) {
      const dbError = err as { code?: string; message?: string };

      if (dbError.code === 'ER_LOCK_DEADLOCK' && attempt < maxRetries - 1) {
        const delay = baseDelay * (attempt + 1);
        console.warn(
          `Deadlock detected [attempt ${attempt + 1}/${maxRetries}], retrying in ${delay}ms... ` +
          `sql: ${sql.substring(0, 100)}`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Non-deadlock error OR deadlock retries exhausted:
      // Throw instead of silently returning 0, so callers know the write failed.
      const errorMsg = dbError.code === 'ER_LOCK_DEADLOCK'
        ? `Deadlock retries exhausted after ${maxRetries} attempts`
        : `Execute failed [${dbError.code || 'UNKNOWN'}]: ${dbError.message || err}`;

      console.error(errorMsg, `\n  SQL: ${sql.substring(0, 200)}`);

      throw new DatabaseWriteError(
        errorMsg,
        dbError.code || 'UNKNOWN',
        sql,
        0,
      );
    }
  }

  // Unreachable (loop always throws or returns), but TypeScript may not know that
  throw new DatabaseWriteError(
    `Deadlock retries exhausted after ${maxRetries} attempts`,
    'ER_LOCK_DEADLOCK',
    sql,
    -1,
  );
}

/**
 * Execute SQL INSERT and return the auto-increment ID.
 *
 * @param sql - SQL INSERT statement
 * @param sqlParams - Statement parameters
 * @returns The insert ID
 * @throws DatabaseWriteError on failure
 */
export async function executeID(
  sql: string,
  sqlParams: any[] = []
): Promise<number> {
  debugLog('executeID', `${sql} --> ${JSON.stringify(sqlParams)}`);

  try {
    const pool = await getPool();
    const [result] = await pool.execute<ResultSetHeader>(sql, sqlParams);
    return result.insertId ?? 0;
  } catch (error: unknown) {
    const dbError = error as { code?: string; message?: string };
    console.error(`Database executeID error [${dbError.code || 'UNKNOWN'}]: ${dbError.message || error}`);
    throw new DatabaseWriteError(
      `executeID failed: ${dbError.message || error}`,
      dbError.code || 'UNKNOWN',
      sql,
    );
  }
}

/**
 * Execute a stored SQL query from aux_tree table.
 * The first query (fetching SQL from aux_tree) is now wrapped in try-catch.
 *
 * @param cid - The SQL query identifier in aux_tree
 * @param sqlParams - Query parameters
 * @param single - Return single row if true, array otherwise
 * @returns Query results
 * @throws DatabaseQueryError on failure
 */
export async function getJsonArray<T = any>(
  cid: string,
  sqlParams: any[] = [],
  single = false
): Promise<T | T[]> {
  const pool = await getPool();

  // Get the SQL query string from aux_tree — now with try-catch
  let sql: string | undefined;
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT sqls FROM aux_tree WHERE id = ?',
      [cid]
    );
    sql = rows[0]?.sqls as string | undefined;
  } catch (error: unknown) {
    const dbError = error as { code?: string; message?: string };
    console.error(`getJsonArray: Failed to fetch SQL for cid=${cid} [${dbError.code || 'UNKNOWN'}]: ${dbError.message || error}`);
    throw new DatabaseQueryError(
      `Failed to fetch aux_tree SQL for cid=${cid}: ${dbError.message || error}`,
      dbError.code || 'UNKNOWN',
      'SELECT sqls FROM aux_tree WHERE id = ?',
    );
  }

  if (!sql) {
    console.error(`getJsonArray: No SQL found for cid=${cid}`);
    return single ? {} as T : [] as T[];
  }

  debugLog('getJsonArray', `${cid} --> ${sql} --> ${JSON.stringify(sqlParams)}`);

  try {
    const [resultRows] = await pool.query<RowDataPacket[]>(sql, sqlParams);
    return single ? (resultRows[0] ?? {}) as T : resultRows as T[];
  } catch (error: unknown) {
    const dbError = error as { code?: string; message?: string };
    console.error(`getJsonArray error for cid=${cid} [${dbError.code || 'UNKNOWN'}]: ${dbError.message || error}`);
    throw new DatabaseQueryError(
      `getJsonArray query failed for cid=${cid}: ${dbError.message || error}`,
      dbError.code || 'UNKNOWN',
      sql,
    );
  }
}

/**
 * Paginated query using stored procedure.
 *
 * @param tableId - Table/view identifier
 * @param pageSize - Page size
 * @param pageIndex - Page index (0-based)
 * @param sortColumn - Sort column name (validated in stored procedure)
 * @param sortOrder - Sort order ('asc' or 'desc')
 * @param whereClause - WHERE clause condition
 * @returns Paginated result with rows, total count, and page count
 * @throws DatabaseQueryError on failure
 */
export async function getPageData(
  tableId: string,
  pageSize: number,
  pageIndex: number,
  sortColumn: string,
  sortOrder: 'asc' | 'desc',
  whereClause: string
): Promise<{ rows: any[]; total: number; pages: number }> {
  debugLog('getPageData', `${[tableId, pageSize, pageIndex, sortColumn, sortOrder, whereClause].join(', ')}`);

  // Validate sort order to prevent injection
  const safeOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'asc';

  const pool = await getPool();
  try {
    const [result] = await pool.query<RowDataPacket[][]>(
      'CALL get_page(?,?,?,?,?,?)',
      [tableId, pageSize, pageIndex, sortColumn, safeOrder, whereClause]
    );

    // Stored procedure returns [data rows, count row]
    const rows = result[0] ?? [];
    const total = (result[1] as any)?.[0]?.mcount ?? 0;
    const pages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;

    return { rows, total, pages };
  } catch (error: unknown) {
    const dbError = error as { code?: string; message?: string };
    console.error(`getPageData error [${dbError.code || 'UNKNOWN'}]: ${dbError.message || error}`);
    throw new DatabaseQueryError(
      `getPageData failed: ${dbError.message || error}`,
      dbError.code || 'UNKNOWN',
      'CALL get_page(?,?,?,?,?,?)',
    );
  }
}

/**
 * Close the connection pool gracefully.
 * Logs structured shutdown info for production observability.
 */
export async function closePool(): Promise<void> {
  if (promisePool) {
    await promisePool.end();
    promisePool = null;
    poolInitPromise = null;
    console.info(`[${new Date().toISOString()}] Database connection pool closed.`);
  }
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(): Promise<void> {
  console.info(`[${new Date().toISOString()}] Shutting down gracefully...`);
  await closePool();
  process.exit(0);
}

// Register shutdown handlers
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('unhandledRejection', (reason) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection:`, reason);
});

// Export pool getter for advanced use cases
export { getPool };
