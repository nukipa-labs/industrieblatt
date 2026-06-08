import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzerklarung der Nukipa Labs GmbH.',
  robots: 'noindex',
};

export default function Datenschutz() {
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
          Datenschutzerklarung
        </h1>

        <div className="prose-body">
          <h2>1. Allgemeines</h2>
          <p>
            Nukipa Labs GmbH verpflichtet sich zum Schutz personenbezogener Daten beim Besuch der Website
            und der Nutzung unserer Dienste.
          </p>

          <h2>2. Verantwortlicher</h2>
          <p>
            Nukipa Labs GmbH<br />
            Gunta-Stolzl-Strasse 7<br />
            80807 Munchen<br />
            E-Mail: <a href="mailto:legal@nukipa.com">legal@nukipa.com</a>
          </p>

          <h2>3. Erhobene Daten</h2>
          <p>
            Wir erheben: IP-Adressen, Browsertyp und -version, Betriebssystem, Referrer-URL,
            Zugriffszeitstempel sowie anonymisierte technische Daten. Kontaktanfragen beinhalten
            Name, E-Mail-Adresse und Nachrichteninhalt.
          </p>

          <h2>4. Zweck und Rechtsgrundlage</h2>
          <p>
            Die Datenverarbeitung basiert auf: Vertragsfullung (Art. 6 Abs. 1 lit. b DSGVO),
            berechtigten Interessen (Art. 6 Abs. 1 lit. f DSGVO) sowie ggf. Einwilligung
            (Art. 6 Abs. 1 lit. a DSGVO).
          </p>

          <h2>5. Cookies</h2>
          <p>
            Notwendige Cookies gewahrleisten die Funktionsfahigkeit der Website. Nicht notwendige
            Cookies (Analyse, Marketing) erfordern eine vorherige Einwilligung uber das Cookie-Banner,
            die jederzeit widerrufen werden kann.
          </p>

          <h2>6. Drittanbieter-Dienste</h2>
          <p>
            Wir nutzen externe Anbieter: AWS und Supabase (Cloud-Infrastruktur), OpenAI und Anthropic
            (KI-APIs) sowie Unsplash (Bilder).
          </p>

          <h2>7. Datenspeicherung</h2>
          <p>
            Daten werden nur so lange gespeichert, wie es fur die genannten Zwecke erforderlich ist
            oder gesetzliche Aufbewahrungspflichten bestehen.
          </p>

          <h2>8. Ihre Rechte</h2>
          <p>
            Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Loschung, Einschrankung der
            Verarbeitung, Datentragbarkeit, Widerspruch sowie Widerruf einer erteilten Einwilligung.
            Wenden Sie sich hierzu an: <a href="mailto:legal@nukipa.com">legal@nukipa.com</a>
          </p>

          <h2>9. Datenuber­mittlung</h2>
          <p>
            Internationale Datentransfers erfolgen im Einklang mit den Schutzstandards der DSGVO.
          </p>

          <h2>10. Sicherheitsmassnahmen</h2>
          <p>
            Wir setzen angemessene technische und organisatorische Massnahmen zum Schutz Ihrer
            personenbezogenen Daten ein.
          </p>

          <h2>11. Beschwerden</h2>
          <p>
            Beschwerden konnen bei der zustandigen Aufsichtsbehorde eingereicht werden:<br />
            Bayerisches Landesamt fur Datenschutzaufsicht (BayLDA)
          </p>
        </div>
      </main>

      <footer style={{ background: 'var(--bg-white)', padding: '1.5rem', textAlign: 'center' }}>
        <nav style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--fg-muted)', textDecoration: 'none' }}>Startseite</Link>
          <Link href="/impressum" style={{ fontSize: '0.8125rem', color: 'var(--fg-muted)', textDecoration: 'none' }}>Impressum</Link>
        </nav>
      </footer>
    </div>
  );
}
