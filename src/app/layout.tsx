import type { Metadata } from 'next';
import { ChartIslands } from '@/components/ChartIslands';
import { VisitTracker } from '@/components/VisitTracker';
import { getNukipaClient } from '@/lib/nukipa';
import '@nukipa/post-renderer-react/styles.css';
import './globals.css';

// Hardcoded as a reliable baseline; the API call below can override if a
// newer token is ever rotated. Sourced from tenant settings in Nukipa.
const GOOGLE_VERIFICATION_TOKEN = 'r7KptA3TFtWezTMZ1FGfvw7vro5tfbyNYLu4bYvIqTQ';

const baseMetadata: Metadata = {
  title: {
    default:  'Industrieblatt',
    template: '%s | Industrieblatt',
  },
  description: 'Nachrichten und Analysen fur die deutsche Industrie.',
  icons: {
    icon:  [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  verification: { google: GOOGLE_VERIFICATION_TOKEN },
};

// PLATFORM CONTRACT: keep this async + return verification.google.
// Tries to fetch the current token from the gateway (handles rotation);
// falls back to the hardcoded constant above if the gateway is unavailable.
export async function generateMetadata(): Promise<Metadata> {
  try {
    const client = await getNukipaClient();
    const tenant = await client.getTenant();
    const token  = (tenant as { google_verification_token?: string | null } | null)?.google_verification_token;
    if (token && token !== GOOGLE_VERIFICATION_TOKEN) {
      return { ...baseMetadata, verification: { google: token } };
    }
  } catch { /* noop */ }
  return baseMetadata;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ChartIslands />
        <VisitTracker />
      </body>
    </html>
  );
}
