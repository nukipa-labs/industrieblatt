'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { SlimPost } from '@nukipa/site-sdk';

function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now   = new Date();
  const diff  = now.getTime() - date.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)   return 'Gerade eben';
  if (mins < 60)  return `vor ${mins} Min.`;
  if (hours < 24) return `vor ${hours} ${hours === 1 ? 'Std.' : 'Std.'}`;
  if (days < 7)   return `vor ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
  return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: days > 365 ? 'numeric' : undefined });
}

function isRecent(dateStr?: string | null): boolean {
  if (!dateStr) return false;
  return (Date.now() - new Date(dateStr).getTime()) < 6 * 3600 * 1000;
}

export function NewsIndex({ posts }: { posts: SlimPost[] }) {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // Derive unique folders from post.folder — preserves insertion order (= publish order diversity)
  const folders = useMemo(() => {
    const seen = new Map<string, string>(); // slug -> name
    for (const p of posts) {
      if (p.folder?.slug && !seen.has(p.folder.slug)) {
        seen.set(p.folder.slug, p.folder.name);
      }
    }
    return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!activeFolder) return posts;
    return posts.filter(p => p.folder?.slug === activeFolder);
  }, [posts, activeFolder]);

  const [featured, ...rest] = filteredPosts;

  return (
    <div className="ib-root">
      {/* Accent bar */}
      <div className="accent-bar" />

      {/* Header */}
      <header className="ib-header">
        <div className="ib-header-inner">
          <Link href="/" className="ib-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Industrieblatt" className="ib-logo" />
          </Link>
          <div className="ib-header-right">
            <span className="ib-date">{today}</span>
          </div>
        </div>
      </header>

      {/* Folder / category filter — only shown when there are 2+ distinct folders */}
      {folders.length > 1 && (
        <nav className="ib-categories">
          <div className="ib-container">
            <div className="ib-cat-inner">
              <button
                className={`ib-cat-pill${!activeFolder ? ' active' : ''}`}
                onClick={() => setActiveFolder(null)}
              >
                Alle
              </button>
              {folders.map(f => (
                <button
                  key={f.slug}
                  className={`ib-cat-pill${activeFolder === f.slug ? ' active' : ''}`}
                  onClick={() => setActiveFolder(activeFolder === f.slug ? null : f.slug)}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      <main className="ib-main">
        {filteredPosts.length === 0 ? (
          <div className="ib-empty">
            <p>Keine Artikel in dieser Kategorie.</p>
          </div>
        ) : (
          <>
            {featured && (
              <section className="ib-featured-section">
                <div className="ib-container">
                  <FeaturedArticle post={featured} />
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section className="ib-grid-section">
                <div className="ib-container">
                  <div className="ib-grid">
                    {rest.map(post => (
                      <ArticleCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <footer className="ib-footer">
        <div className="ib-container">
          <div className="ib-footer-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Industrieblatt" className="ib-footer-logo" />
            <p className="ib-footer-tagline">Nachrichten und Analysen fur die deutsche Industrie</p>
            <nav className="ib-footer-nav">
              <Link href="/impressum">Impressum</Link>
              <Link href="/datenschutz">Datenschutz</Link>
            </nav>
            <p className="ib-footer-copy">&copy; {new Date().getFullYear()} Industrieblatt. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .ib-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          color: var(--fg);
        }

        /* Header */
        .ib-header {
          background: var(--header-bg);
          color: var(--header-fg);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid var(--header-border);
        }
        .ib-header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ib-brand { display: flex; align-items: center; }
        .ib-logo {
          height: 36px;
          width: auto;
          object-fit: contain;
        }
        .ib-header-right { display: flex; align-items: center; gap: 1.5rem; }
        .ib-date {
          font-size: 0.8125rem;
          color: var(--fg-muted);
          white-space: nowrap;
        }
        @media (max-width: 600px) { .ib-date { display: none; } }

        /* Container */
        .ib-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        @media (max-width: 640px) { .ib-container { padding: 0 1rem; } }

        /* Main */
        .ib-main { flex: 1; }

        .ib-empty {
          max-width: 800px;
          margin: 4rem auto;
          padding: 0 1.5rem;
          text-align: center;
          color: var(--fg-muted);
        }

        /* Featured article */
        .ib-featured-section { padding: 2rem 0 1.5rem; }
        .ib-featured {
          display: block;
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
          background: #111;
          text-decoration: none;
          aspect-ratio: 16/7;
          min-height: 300px;
        }
        .ib-featured:hover .ib-featured-img { transform: scale(1.02); }
        .ib-featured-img-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .ib-featured-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .ib-featured-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.10) 100%);
        }
        .ib-featured-placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        }
        .ib-featured-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
        }
        .ib-featured-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }
        .ib-featured-title {
          font-family: var(--font-headline);
          font-size: clamp(1.5rem, 3.5vw, 2.4rem);
          font-weight: 400;
          color: #fff;
          line-height: 1.2;
          margin: 0 0 0.5rem;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .ib-featured-desc {
          font-size: 1rem;
          color: rgba(255,255,255,0.82);
          margin: 0 0 0.75rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ib-featured-time { font-size: 0.8125rem; color: rgba(255,255,255,0.65); }

        @media (max-width: 640px) {
          .ib-featured { aspect-ratio: 4/3; min-height: 280px; }
          .ib-featured-content { padding: 1.25rem; }
          .ib-featured-title { font-size: 1.375rem; }
          .ib-featured-desc { display: none; }
        }

        /* Article grid */
        .ib-grid-section { padding: 0 0 3rem; }
        .ib-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 900px) { .ib-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .ib-grid { grid-template-columns: 1fr; gap: 1rem; } }

        /* Article card */
        .ib-card {
          display: block;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          text-decoration: none;
          transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
          box-shadow: var(--shadow-card);
        }
        .ib-card:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
          border-color: var(--accent);
        }
        .ib-card-img-wrap {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: var(--bg);
        }
        .ib-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .ib-card:hover .ib-card-img { transform: scale(1.04); }
        .ib-card-placeholder {
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, var(--bg) 0%, var(--border) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .ib-card-placeholder .material-icons { font-size: 2.5rem; color: var(--fg-muted); opacity: 0.35; }
        .ib-card-badges {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          display: flex;
          gap: 0.375rem;
          flex-wrap: wrap;
        }
        .ib-card-body { padding: 1rem 1.25rem 1.25rem; }
        .ib-card-title {
          font-family: var(--font-headline);
          font-size: 1.0625rem;
          font-weight: 400;
          line-height: 1.35;
          color: var(--fg);
          margin: 0 0 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ib-card-desc {
          font-size: 0.875rem;
          color: var(--fg-muted);
          line-height: 1.5;
          margin: 0 0 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ib-card-footer { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .ib-card-time { font-size: 0.75rem; color: var(--fg-muted); }
        .ib-card-attr { display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; color: var(--fg-muted); }
        .ib-card-attr-logo { width: 16px; height: 16px; object-fit: contain; border-radius: 2px; }

        /* Photo attribution overlay (featured + cards) */
        .ib-cover-credit {
          position: absolute;
          bottom: 0;
          right: 0;
          padding: 0.2rem 0.5rem;
          background: rgba(0,0,0,0.45);
          color: rgba(255,255,255,0.75);
          font-size: 0.625rem;
          line-height: 1.5;
          backdrop-filter: blur(4px);
          border-top-left-radius: var(--radius-sm);
          z-index: 2;
          pointer-events: auto;
        }
        .ib-cover-credit a {
          color: rgba(255,255,255,0.85);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .ib-cover-credit a:hover { color: #fff; }

        /* Footer */
        .ib-footer {
          background: var(--bg-white);
          color: var(--fg);
          padding: 2.5rem 0;
          margin-top: auto;
          border-top: 1px solid var(--border);
        }
        .ib-footer-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.875rem; }
        .ib-footer-logo { height: 32px; width: auto; }
        .ib-footer-tagline { font-size: 0.875rem; color: var(--fg-muted); margin: 0; }
        .ib-footer-nav { display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
        .ib-footer-nav a { font-size: 0.8125rem; color: var(--fg-muted); text-decoration: none; transition: color 0.2s; }
        .ib-footer-nav a:hover { color: var(--fg); }
        .ib-footer-copy { font-size: 0.75rem; color: var(--fg-muted); margin: 0.5rem 0 0; }
      `}</style>
    </div>
  );
}

function CoverCredit({ cover }: { cover: SlimPost['cover'] }) {
  const attr = (cover as any)?.attribution as {
    author?: string; source?: string; photo_url?: string; source_url?: string;
  } | null | undefined;
  if (!attr?.author) return null;
  return (
    <span className="ib-cover-credit" onClick={e => e.preventDefault()}>
      <a href={attr.source_url ?? attr.photo_url} target="_blank" rel="noopener noreferrer"
         onClick={e => e.stopPropagation()}>
        {attr.author}
      </a>
      {attr.source && (
        <>{' '}·{' '}
          <a href="https://unsplash.com/?utm_source=industrieblatt&utm_medium=referral"
             target="_blank" rel="noopener noreferrer"
             onClick={e => e.stopPropagation()}>
            {attr.source}
          </a>
        </>
      )}
    </span>
  );
}

function FeaturedArticle({ post }: { post: SlimPost }) {
  const recent = isRecent(post.published_at);
  return (
    <Link href={`/${post.slug}`} className="ib-featured">
      {post.cover?.url ? (
        <div className="ib-featured-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover.url} alt={post.cover.alt || post.title} className="ib-featured-img" />
          <CoverCredit cover={post.cover} />
        </div>
      ) : (
        <div className="ib-featured-placeholder" />
      )}
      <div className="ib-featured-gradient" />
      <div className="ib-featured-content">
        <div className="ib-featured-meta">
          {post.folder?.slug && post.folder.slug !== 'general' && <span className="badge">{post.folder.name}</span>}
          {recent && <span className="badge badge-live">Aktuell</span>}
        </div>
        <h2 className="ib-featured-title">{post.title}</h2>
        {post.excerpt && <p className="ib-featured-desc">{post.excerpt}</p>}
        <time className="ib-featured-time">{formatRelativeTime(post.published_at)}</time>
      </div>
    </Link>
  );
}

function ArticleCard({ post }: { post: SlimPost }) {
  const recent = isRecent(post.published_at);
  const attr   = (post as any).submitted_by_company;
  return (
    <Link href={`/${post.slug}`} className="ib-card">
      {post.cover?.url ? (
        <div className="ib-card-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover.url} alt={post.cover.alt || post.title} className="ib-card-img" />
          <div className="ib-card-badges">
            {post.folder?.slug && post.folder.slug !== 'general' && <span className="badge">{post.folder.name}</span>}
            {recent && <span className="badge badge-live">Aktuell</span>}
          </div>
          <CoverCredit cover={post.cover} />
        </div>
      ) : (
        <div className="ib-card-placeholder">
          <span className="material-icons">article</span>
          <div className="ib-card-badges">
            {post.folder?.slug && post.folder.slug !== 'general' && <span className="badge">{post.folder.name}</span>}
            {recent && <span className="badge badge-live">Aktuell</span>}
          </div>
        </div>
      )}
      <div className="ib-card-body">
        <h3 className="ib-card-title">{post.title}</h3>
        {post.excerpt && <p className="ib-card-desc">{post.excerpt}</p>}
        <div className="ib-card-footer">
          <time className="ib-card-time">{formatRelativeTime(post.published_at)}</time>
          {attr?.company_name && (
            <span className="ib-card-attr">
              {attr.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={attr.logo_url} alt={attr.company_name} className="ib-card-attr-logo" />
              )}
              <span>{attr.company_name}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
