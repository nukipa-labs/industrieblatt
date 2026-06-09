import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PostBody, renderSourcesList } from '@nukipa/post-renderer-react';
import { getNukipaClient } from '@/lib/nukipa';
import { GateForm } from '@/components/GateForm';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const client   = await getNukipaClient();
  const post     = await client.getPostBySlug(slug);
  if (!post) return {};
  const seo = (post.seo as Record<string, string | undefined>) || {};
  return {
    title:       seo.title       || post.title,
    description: seo.description || post.excerpt || undefined,
    openGraph: {
      title:       seo.title       || post.title,
      description: seo.description || post.excerpt || undefined,
      images:      seo.og_image ? [{ url: seo.og_image }]
                 : (post.cover?.url ? [{ url: post.cover.url }] : undefined),
      type: 'article',
    },
  };
}

function formatAbsoluteDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function readingTime(body?: string | null): number {
  if (!body) return 0;
  return Math.max(1, Math.ceil(body.replace(/<[^>]+>/g, '').split(/\s+/).length / 200));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const client   = await getNukipaClient();
  const post     = await client.getPostBySlug(slug);
  if (!post) notFound();

  const related     = await client.listRelatedPosts(slug, { limit: 3 });
  const sourcesHtml = renderSourcesList(post.sources ?? []);
  const minutes     = readingTime(post.body);
  const author      = (post as any).author;
  const attr        = (post as any).submitted_by_company;
  const isRecent    = post.published_at
    ? (Date.now() - new Date(post.published_at).getTime()) < 4 * 3600 * 1000
    : false;

  return (
    <div className="na-root">
      {/* Accent bar */}
      <div className="accent-bar" />

      {/* Header */}
      <header className="na-header">
        <div className="na-header-inner">
          <Link href="/" className="na-back">
            <span className="material-icons na-back-icon">arrow_back</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Industrieblatt" className="na-header-logo" />
          </Link>
          <time className="na-header-date">
            {new Date().toLocaleDateString('de-DE', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })}
          </time>
        </div>
      </header>

      {/* Breadcrumb */}
      {post.folder?.slug && post.folder.slug !== 'general' && (
        <nav className="na-breadcrumb">
          <div className="na-breadcrumb-inner">
            <Link href="/" className="na-bc-link">Startseite</Link>
            <span className="na-bc-sep">/</span>
            <span className="na-bc-cur">{post.folder?.name}</span>
          </div>
        </nav>
      )}

      {/* Article hero */}
      <div className="na-hero">
        <div className="na-hero-inner">
          {post.folder?.slug && post.folder.slug !== 'general' && (
            <div className="na-overline">
              <span className="na-overline-line" />
              <span className="na-overline-text">{post.folder?.name}</span>
            </div>
          )}

          <h1 className="na-title">{post.title}</h1>

          {post.excerpt && <p className="na-lead">{post.excerpt}</p>}

          {/* Meta row: author + date + reading time */}
          <div className="na-meta">
            <div className="na-meta-row">
              {author && (
                <div className="na-author">
                  {author.profile_picture_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={author.profile_picture_url} alt={author.name} className="na-author-avatar" />
                  ) : (
                    <span className="na-author-initials">{getInitials(author.name)}</span>
                  )}
                  <div className="na-author-info">
                    <span className="na-author-name">{author.name}</span>
                    {author.job_title && <span className="na-author-role">{author.job_title}</span>}
                  </div>
                </div>
              )}
              <div className="na-dateline">
                <time>{formatAbsoluteDate(post.published_at)}</time>
                <span className="na-reading-time">
                  <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: '-2px' }}>schedule</span>
                  {minutes} Min. Lesezeit
                </span>
                {isRecent && <span className="badge badge-live" style={{ fontSize: '0.65rem' }}>Aktuell</span>}
              </div>
            </div>

            {/* Submitted-by attribution */}
            {attr?.company_name && (
              <div className="na-attr">
                {attr.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={attr.logo_url} alt={attr.company_name} className="na-attr-logo" />
                ) : (
                  <span className="na-attr-initials">{getInitials(attr.company_name)}</span>
                )}
                <span className="na-attr-text">
                  Bereitgestellt von <strong>{attr.company_name}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero image */}
      {post.cover?.url && (() => {
        const attr = post.cover!.attribution as {
          author?: string; source?: string; photo_url?: string; source_url?: string;
        } | null | undefined;
        return (
          <figure className="na-hero-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover!.url} alt={post.cover!.alt || post.title} />
            {attr?.author && (
              <figcaption className="na-cover-credit">
                Foto von{' '}
                <a href={attr.source_url ?? attr.photo_url} target="_blank" rel="noopener noreferrer">
                  {attr.author}
                </a>
                {attr.source && (
                  <>{' '}auf{' '}
                    <a href="https://unsplash.com/?utm_source=industrieblatt&utm_medium=referral" target="_blank" rel="noopener noreferrer">
                      {attr.source}
                    </a>
                  </>
                )}
              </figcaption>
            )}
          </figure>
        );
      })()}

      {/* Article body + share sidebar */}
      <div className="na-body-wrap">
        <main className="na-body">
          <div className="prose-body">
            <PostBody
              body={post.body ?? ''}
              components={post.components ?? []}
              sources={post.sources ?? []}
              postId={post.id}
              lang={post.language ?? undefined}
            />
            {sourcesHtml && <div dangerouslySetInnerHTML={{ __html: sourcesHtml }} />}
          </div>

          {(post as any).is_gated && (post as any).gated_form_slug && (
            <GateForm
              formSlug={(post as any).gated_form_slug}
              formName={(post as any).gated_form_name ?? null}
              fields={(post as any).gated_form_fields ?? []}
              heading="Den vollstandigen Artikel lesen"
              subheading="Geben Sie Ihre E-Mail-Adresse ein, um den Artikel freizuschalten."
            />
          )}
        </main>
      </div>

      {/* Author bio */}
      {author && (
        <section className="na-author-bio">
          <div className="na-author-bio-inner">
            <div className="na-author-bio-avatar">
              {author.profile_picture_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={author.profile_picture_url} alt={author.name} />
              ) : (
                <span className="na-author-bio-initials">{getInitials(author.name)}</span>
              )}
            </div>
            <div className="na-author-bio-content">
              <h3 className="na-author-bio-name">{author.name}</h3>
              {author.job_title && <p className="na-author-bio-role">{author.job_title}</p>}
              {author.description && <p className="na-author-bio-desc">{author.description}</p>}
              {author.email && (
                <a href={`mailto:${author.email}`} className="na-author-bio-email">
                  <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: '-2px' }}>email</span>
                  {author.email}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <section className="na-related">
          <div className="na-related-inner">
            <h2 className="na-related-title">Weitere Artikel</h2>
            <div className="na-related-grid">
              {related.map((r) => (
                <Link key={r.id} href={`/${r.slug}`} className="na-related-card">
                  {r.cover?.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.cover.url} alt={r.cover.alt || r.title} className="na-related-img" />
                  )}
                  <div className="na-related-body">
                    {r.folder?.slug && r.folder.slug !== 'general' && <span className="badge" style={{ fontSize: '0.6rem' }}>{r.folder?.name}</span>}
                    <h3 className="na-related-card-title">{r.title}</h3>
                    {r.published_at && (
                      <time className="na-related-time">
                        {new Date(r.published_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </time>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="na-footer">
        <div className="na-footer-inner">
          <nav className="na-footer-nav">
            <Link href="/">Startseite</Link>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </nav>
          <p className="na-footer-copy">&copy; {new Date().getFullYear()} Industrieblatt</p>
        </div>
      </footer>

      <style>{`
        .na-root {
          min-height: 100vh;
          background: var(--bg-white);
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .na-header {
          background: var(--header-bg);
          color: var(--header-fg);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid var(--header-border);
        }
        .na-header-inner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .na-back {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: inherit;
        }
        .na-back:hover { opacity: 0.8; }
        .na-back-icon { font-size: 1.25rem; color: var(--fg-muted); }
        .na-header-logo {
          height: 28px;
          width: auto;
          object-fit: contain;
        }
        .na-header-date {
          font-size: 0.8125rem;
          color: var(--fg-muted);
        }
        @media (max-width: 600px) { .na-header-date { display: none; } }

        /* Breadcrumb */
        .na-breadcrumb {
          background: var(--bg);
          border-bottom: 1px solid var(--border);
        }
        .na-breadcrumb-inner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0.5rem 1.5rem;
          font-size: 0.8125rem;
          color: var(--fg-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .na-bc-link { color: var(--fg-muted); text-decoration: none; }
        .na-bc-link:hover { color: var(--accent); }
        .na-bc-sep { color: var(--border); }
        .na-bc-cur { color: var(--accent); font-weight: 500; }

        /* Hero */
        .na-hero {
          background: var(--bg-white);
          border-bottom: 1px solid var(--border);
          padding: 2.5rem 0 2rem;
        }
        .na-hero-inner {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .na-overline {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .na-overline-line {
          width: 32px;
          height: 2px;
          background: var(--accent);
          flex-shrink: 0;
        }
        .na-overline-text {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .na-title {
          font-family: var(--font-headline);
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 400;
          line-height: 1.2;
          color: var(--fg);
          margin: 0 0 1rem;
        }
        .na-lead {
          font-size: 1.125rem;
          color: var(--fg-muted);
          line-height: 1.6;
          margin: 0 0 1.5rem;
          font-style: italic;
        }
        .na-meta { display: flex; flex-direction: column; gap: 0.75rem; }
        .na-meta-row {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.25rem;
        }
        .na-author {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }
        .na-author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .na-author-initials {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          flex-shrink: 0;
        }
        .na-author-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }
        .na-author-name { font-size: 0.9375rem; font-weight: 600; color: var(--fg); }
        .na-author-role { font-size: 0.8125rem; color: var(--fg-muted); }
        .na-dateline {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          flex-wrap: wrap;
          font-size: 0.8125rem;
          color: var(--fg-muted);
        }
        .na-reading-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .na-attr {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: var(--fg-muted);
          padding: 0.5rem 0.75rem;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          width: fit-content;
        }
        .na-attr-logo {
          width: 20px;
          height: 20px;
          object-fit: contain;
          border-radius: 2px;
        }
        .na-attr-initials {
          width: 20px;
          height: 20px;
          background: #ccc;
          border-radius: 2px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: 700;
        }

        /* Hero image */
        .na-hero-image {
          margin: 0;
          background: #000;
          max-height: 560px;
          overflow: hidden;
          position: relative;
        }
        .na-hero-image img {
          width: 100%;
          height: 100%;
          max-height: 560px;
          object-fit: cover;
          display: block;
        }
        .na-cover-credit {
          position: absolute;
          bottom: 0;
          right: 0;
          padding: 0.25rem 0.625rem;
          background: rgba(0,0,0,0.45);
          color: rgba(255,255,255,0.8);
          font-size: 0.6875rem;
          line-height: 1.5;
          backdrop-filter: blur(4px);
          border-top-left-radius: var(--radius-sm);
        }
        .na-cover-credit a {
          color: rgba(255,255,255,0.9);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .na-cover-credit a:hover { color: #fff; }

        /* Article body */
        .na-body-wrap {
          max-width: 800px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
          width: 100%;
        }
        .na-body { width: 100%; }

        /* Author bio */
        .na-author-bio {
          background: var(--bg);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 2rem 0;
        }
        .na-author-bio-inner {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }
        .na-author-bio-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        .na-author-bio-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .na-author-bio-initials {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .na-author-bio-content { flex: 1; }
        .na-author-bio-name { font-size: 1rem; font-weight: 700; margin: 0 0 0.25rem; color: var(--fg); }
        .na-author-bio-role { font-size: 0.875rem; color: var(--accent); margin: 0 0 0.5rem; }
        .na-author-bio-desc { font-size: 0.875rem; color: var(--fg-muted); margin: 0 0 0.5rem; line-height: 1.6; }
        .na-author-bio-email {
          font-size: 0.8125rem;
          color: var(--accent);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .na-author-bio-email:hover { text-decoration: underline; }

        /* Related articles */
        .na-related {
          padding: 3rem 0;
          background: var(--bg);
          border-top: 1px solid var(--border);
        }
        .na-related-inner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .na-related-title {
          font-family: var(--font-headline);
          font-size: 1.5rem;
          font-weight: 400;
          margin: 0 0 1.5rem;
          color: var(--fg);
          border-left: 3px solid var(--accent);
          padding-left: 0.75rem;
        }
        .na-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 768px) {
          .na-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .na-related-grid { grid-template-columns: 1fr; }
        }
        .na-related-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          text-decoration: none;
          transition: box-shadow 0.2s, transform 0.2s;
          display: block;
        }
        .na-related-card:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
        }
        .na-related-img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
        }
        .na-related-body { padding: 0.875rem 1rem; display: flex; flex-direction: column; gap: 0.375rem; }
        .na-related-card-title {
          font-family: var(--font-headline);
          font-size: 0.9375rem;
          font-weight: 400;
          color: var(--fg);
          margin: 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .na-related-time { font-size: 0.75rem; color: var(--fg-muted); }

        /* Footer */
        .na-footer {
          background: var(--bg-white);
          border-top: 1px solid var(--border);
          padding: 1.5rem;
          margin-top: auto;
        }
        .na-footer-inner {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
        }
        .na-footer-nav {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .na-footer-nav a {
          font-size: 0.8125rem;
          color: var(--fg-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .na-footer-nav a:hover { color: var(--fg); }
        .na-footer-copy { font-size: 0.75rem; color: var(--fg-muted); margin: 0; }

        @media (max-width: 640px) {
          .na-hero-inner { padding: 0 1rem; }
          .na-body-wrap { padding: 1.5rem 1rem; }
          .na-author-bio-inner { padding: 0 1rem; }
          .na-related-inner { padding: 0 1rem; }
          .na-title { font-size: 1.625rem; }
          .na-lead { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}
