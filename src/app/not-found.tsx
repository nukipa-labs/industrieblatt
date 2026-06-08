import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div className="accent-bar" style={{ position: 'fixed', top: 0, left: 0, right: 0 }} />
      <p style={{ fontSize: '0.875rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem' }}>
        404
      </p>
      <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2.5rem', fontWeight: '400', marginBottom: '1rem' }}>
        Seite nicht gefunden
      </h1>
      <p style={{ color: 'var(--fg-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
        Diese Seite existiert nicht oder wurde verschoben.
      </p>
      <Link
        href="/"
        style={{
          background: 'var(--accent)',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.9375rem',
          display: 'inline-block',
        }}
      >
        Zur Startseite
      </Link>
    </div>
  );
}
