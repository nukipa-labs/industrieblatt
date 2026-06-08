import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und Anbieterkennzeichnung gemas § 5 TMG.',
  robots: 'noindex',
};

export default function Impressum() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-white)', display: 'flex', flexDirection: 'column' }}>
      <div className="accent-bar" />
      <header style={{ background: 'var(--bg-white)', borderBottom: '1px solid var(--border)', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', height: '52px', display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg)', textDecoration: 'none' }}>
            <span className="material-icons" style={{ fontSize: '1.25rem', color: 'var(--fg-muted)' }}>arrow_back</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Industrieblatt" style={{ height: '28px',  }} />
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: '800px', margin: '3rem auto', padding: '0 1.5rem', width: '100%' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: '400', marginBottom: '2rem', borderLeft: '3px solid var(--accent)', paddingLeft: '0.75rem' }}>
          Impressum
        </h1>

        <div className="prose-body">
          <h2>Angaben gemas § 5 TMG</h2>
          <p>
            Nukipa Labs GmbH<br />
            Gunta-Stolzl-Strasse 7<br />
            80807 Munchen<br />
            Deutschland
          </p>

          <h2>Geschaftsfuhrer</h2>
          <p>Fabien Nestmann, Steffen Iwan</p>

          <h2>Registereintrag</h2>
          <p>
            Eingetragen im Handelsregister.<br />
            Registergericht: Amtsgericht Munchen<br />
            Handelsregisternummer: HRB 301802
          </p>

          <h2>Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemas § 27a Umsatzsteuergesetz:<br />
            DE456506273
          </p>

          <h2>Kontakt</h2>
          <p>
            E-Mail: <a href="mailto:legal@nukipa.com">legal@nukipa.com</a>
          </p>

          <h2>Verantwortlich fur den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>Fabien Nestmann, Steffen Iwan</p>

          <h2>Cookies</h2>
          <p>
            Wir verwenden Cookies zur Analyse und Verbesserung unserer Website. Sie konnen der Verwendung
            von Cookies zustimmen oder diese ablehnen.
          </p>
        </div>
      </main>

      <footer style={{ background: 'var(--bg-white)', padding: '1.5rem', textAlign: 'center' }}>
        <nav style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--fg-muted)', textDecoration: 'none' }}>Startseite</Link>
          <Link href="/datenschutz" style={{ fontSize: '0.8125rem', color: 'var(--fg-muted)', textDecoration: 'none' }}>Datenschutz</Link>
        </nav>
      </footer>
    </div>
  );
}
