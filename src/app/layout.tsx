import type { Metadata } from 'next';
import { NukipaFeedback } from '@/components/NukipaFeedback';
import { getNukipaClient } from '@/lib/nukipa';
import '@nukipa/post-renderer-react/styles.css';
import './globals.css';

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
};

// PLATFORM CONTRACT: keep this async + return verification.google when the
// gateway provides a token. Without it the GSC meta-tag check stays pending.
export async function generateMetadata(): Promise<Metadata> {
  let googleVerification: string | undefined;
  try {
    const client = await getNukipaClient();
    const tenant = await client.getTenant();
    const token  = (tenant as { google_verification_token?: string | null } | null)?.google_verification_token;
    if (token) googleVerification = token;
  } catch {
    /* gateway unavailable — render without verification rather than 500ing */
  }
  return googleVerification
    ? { ...baseMetadata, verification: { google: googleVerification } }
    : baseMetadata;
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
        <NukipaFeedback />
      </body>
    </html>
  );
}
