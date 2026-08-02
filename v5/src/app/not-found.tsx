import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0, color: '#818cf8' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', margin: '1rem 0', color: '#e5e7eb' }}>
        Page Not Found / 页面未找到
      </h2>
      <p style={{ color: '#6b7089', maxWidth: '400px', margin: '0.5rem 0 2rem' }}>
        The page you are looking for does not exist or has been moved.
        <br />
        您访问的页面不存在或已被移除。
      </p>
      <Link
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          background: '#818cf8',
          color: '#fff',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        Go Home / 返回首页
      </Link>
    </div>
  );
}
