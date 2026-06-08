'use client';

import { useState, useEffect, useRef } from 'react';

const FEEDBACK_INTERESTS = [
  'Produktion & Fertigung',
  'Automatisierung & Robotik',
  'Energie & Nachhaltigkeit',
  'Logistik & Supply Chain',
  'Wirtschaft & Politik',
  'Forschung & Innovation',
];

export function FoundersBanner() {
  const [visible,      setVisible]      = useState(false);
  const [expanded,     setExpanded]     = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [email,        setEmail]        = useState('');
  const [interest,     setInterest]     = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [sent,         setSent]         = useState(false);
  const textareaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem('founder_banner_dismissed')) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem('founder_banner_dismissed', '1');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: feedbackText,
          email: email || null,
          interest: interest === '_custom' ? customInterest : interest || null,
        }),
      });
      setSent(true);
    } catch {
      setError('Senden fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <aside className="fb-banner">
      {!expanded ? (
        /* Collapsed strip */
        <div className="fb-collapsed" onClick={() => setExpanded(true)}>
          <div className="fb-collapsed-inner">
            <span className="fb-label fb-hide-mobile">Von den Machern</span>
            <span className="fb-teaser fb-hide-mobile">
              Wir bauen ein neues Industriemedium. Ihre Meinung entscheidet, ob es das Richtige wird.
            </span>
            <span className="fb-teaser fb-show-mobile">Wir brauchen Ihr Feedback</span>
            <span className="fb-more">Mehr &#8595;</span>
            <button
              className="fb-close"
              onClick={e => { e.stopPropagation(); dismiss(); }}
              aria-label="Schliessen"
            >
              &times;
            </button>
          </div>
        </div>
      ) : (
        /* Expanded panel */
        <div className="fb-expanded">
          <div className="fb-topbar">
            <span className="fb-label">Von den Machern</span>
            <button className="fb-collapse" onClick={() => setExpanded(false)}>
              Einklappen &#8593;
            </button>
          </div>

          <div className={`fb-layout${showForm ? ' mobile-form-active' : ''}`}>
            {/* Left: description */}
            <div className="fb-desc">
              <h2 className="fb-title">
                Wir bauen ein neues Industriemedium. Ihre Meinung entscheidet, ob es das Richtige wird.
              </h2>
              <div className="fb-body">
                <p>
                  <strong>Industrieblatt</strong> entsteht als unabhangiges Fachmedium fur Entscheider in der
                  produzierenden Industrie. Unsere KI-gestutzte Redaktion wertet taglich hunderte Quellen aus
                  und bereitet die relevantesten Entwicklungen auf.
                </p>
                <p><strong>Was wir heute bieten:</strong></p>
                <ul>
                  <li>
                    <strong>Breite Quellenauswertung:</strong> Wir aggregieren Nachrichten aus Fachmedien,
                    Verbanden und Unternehmensmeldungen - automatisiert und taglich aktualisiert.
                  </li>
                  <li>
                    <strong>Redaktionelle Einordnung:</strong> Unsere Fachautoren liefern Analysen und
                    Hintergrundartikel zu den wichtigsten Branchenthemen.
                  </li>
                  <li>
                    <strong>Marktdaten:</strong> Arbeitsmarkttrends und Stellenangebote der wichtigsten
                    deutschen Arbeitgeber - wochentlich aktualisiert.
                  </li>
                  <li>
                    <strong>Quelltransparenz:</strong> Direkte Verlinkung und Nachvollziehbarkeit jeder Behauptung.
                  </li>
                </ul>
                <p><strong>Woran wir arbeiten:</strong></p>
                <ul>
                  <li>
                    <strong>Personalisierung:</strong> Inhalte nach Branche und Region - damit Sie nur sehen,
                    was fur Sie relevant ist.
                  </li>
                  <li>
                    <strong>Indikatoren:</strong> Aggregierte, aktuelle Daten zu Regulatorik, Zollen,
                    Lieferketten und anderen relevanten Themen.
                  </li>
                  <li>
                    <strong>Internationale Quellen:</strong> Uberwachung der Berichterstattung aus
                    internationalen Fachmedien, die Implikationen fur die deutsche Industrie haben.
                  </li>
                </ul>
                <p>Schauen Sie sich um und sagen Sie uns, was funktioniert - und was nicht.</p>
                {!showForm && (
                  <button className="fb-btn fb-btn-mobile" onClick={() => setShowForm(true)}>
                    Feedback geben &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* Right: feedback form */}
            <div className={`fb-form-wrap${showForm ? ' mobile-visible' : ''}`}>
              {sent ? (
                <div className="fb-success">
                  <span className="material-icons" style={{ fontSize: '2rem', color: '#1a6b3c' }}>check_circle</span>
                  <p><strong>Vielen Dank!</strong></p>
                  <p>Ihre Ruckmeldung hilft uns, Industrieblatt besser zu machen.</p>
                </div>
              ) : (
                <form className="fb-form" onSubmit={submit}>
                  <button
                    type="button"
                    className="fb-back-mobile"
                    onClick={() => setShowForm(false)}
                  >
                    &larr; Zuruck
                  </button>

                  <div
                    ref={textareaRef}
                    className="fb-textarea"
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Was fallt Ihnen auf? Was fehlt? Was wurden Sie anders machen?"
                    onInput={e => setFeedbackText((e.target as HTMLElement).innerText)}
                  />

                  <div className="fb-field">
                    <label>Welcher Bereich interessiert Sie am meisten?</label>
                    <div className="fb-interests">
                      {FEEDBACK_INTERESTS.map(i => (
                        <button
                          key={i}
                          type="button"
                          className={`fb-interest${interest === i ? ' active' : ''}`}
                          onClick={() => { setInterest(i); setCustomInterest(''); }}
                        >
                          {i}
                        </button>
                      ))}
                      <button
                        type="button"
                        className={`fb-interest${interest === '_custom' ? ' active' : ''}`}
                        onClick={() => setInterest('_custom')}
                      >
                        Anderes...
                      </button>
                    </div>
                    {interest === '_custom' && (
                      <input
                        type="text"
                        className="fb-input"
                        placeholder="Welcher Bereich?"
                        value={customInterest}
                        onChange={e => setCustomInterest(e.target.value)}
                      />
                    )}
                  </div>

                  <div className="fb-field">
                    <label>E-Mail (optional - falls wir Ruckfragen stellen durfen)</label>
                    <input
                      type="email"
                      className="fb-input"
                      placeholder="name@firma.de"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <p className="fb-incentive">
                    Das nutzlichste Feedback wird mit einem kostenlosen Spotlight-Artikel uber Ihr Unternehmen belohnt.
                  </p>

                  <button
                    type="submit"
                    className="fb-btn"
                    disabled={loading || !feedbackText.trim()}
                  >
                    {loading ? 'Wird gesendet...' : 'Feedback absenden'}
                  </button>

                  {error && <p className="fb-error">{error}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .fb-banner {
          background: #fdfaf6;
          border-bottom: 1px solid #e8e0d8;
          font-size: 0.9rem;
        }

        /* Collapsed strip */
        .fb-collapsed {
          cursor: pointer;
          padding: 0 1.5rem;
          transition: background 0.15s;
        }
        .fb-collapsed:hover { background: #f5ede3; }
        .fb-collapsed-inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 40px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .fb-label {
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--accent);
          white-space: nowrap;
        }
        .fb-teaser {
          font-size: 0.8125rem;
          color: var(--fg-muted);
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .fb-more {
          font-size: 0.8125rem;
          color: var(--accent);
          font-weight: 500;
          white-space: nowrap;
          margin-left: auto;
        }
        .fb-close {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #aaa;
          padding: 0 0.25rem;
          line-height: 1;
          cursor: pointer;
          flex-shrink: 0;
        }
        .fb-close:hover { color: var(--fg); }
        .fb-hide-mobile { display: inline; }
        .fb-show-mobile { display: none; }
        @media (max-width: 600px) {
          .fb-hide-mobile { display: none; }
          .fb-show-mobile { display: inline; }
          .fb-more { margin-left: 0; }
        }

        /* Expanded panel */
        .fb-expanded {
          padding: 0 1.5rem 2rem;
          max-width: 100%;
        }
        .fb-topbar {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.75rem 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e8e0d8;
          margin-bottom: 1.5rem;
        }
        .fb-collapse {
          background: none;
          border: none;
          font-size: 0.8125rem;
          color: var(--fg-muted);
          cursor: pointer;
          padding: 0;
        }
        .fb-collapse:hover { color: var(--fg); }

        /* Two-column layout */
        .fb-layout {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 3rem;
          align-items: start;
        }

        /* Left description */
        .fb-title {
          font-family: var(--font-headline);
          font-size: 1.375rem;
          font-weight: 400;
          line-height: 1.3;
          margin: 0 0 1.25rem;
          color: var(--fg);
        }
        .fb-body p { margin: 0 0 0.875rem; color: var(--fg-muted); line-height: 1.6; font-size: 0.9rem; }
        .fb-body p strong { color: var(--fg); }
        .fb-body ul { padding-left: 1.5rem; margin: 0 0 0.875rem; }
        .fb-body li { margin: 0.375rem 0; color: var(--fg-muted); font-size: 0.875rem; line-height: 1.5; }
        .fb-body li strong { color: var(--fg); }

        .fb-btn {
          display: inline-block;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          padding: 0.625rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background 0.15s;
        }
        .fb-btn:hover:not(:disabled) { background: var(--accent-dark); }
        .fb-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .fb-btn-mobile { display: none; }

        /* Right form */
        .fb-form-wrap {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.5rem;
        }
        .fb-form { display: flex; flex-direction: column; gap: 1rem; }
        .fb-textarea {
          min-height: 100px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          font-size: 0.875rem;
          color: var(--fg);
          line-height: 1.5;
          outline: none;
          font-family: var(--font-body);
          background: var(--bg);
          position: relative;
        }
        .fb-textarea:focus { border-color: var(--accent); }
        .fb-textarea:empty::before {
          content: attr(data-placeholder);
          color: #aaa;
          pointer-events: none;
        }
        .fb-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .fb-field label { font-size: 0.8125rem; font-weight: 600; color: var(--fg); }
        .fb-interests { display: flex; flex-wrap: wrap; gap: 0.375rem; }
        .fb-interest {
          padding: 0.3rem 0.7rem;
          border: 1px solid var(--border);
          border-radius: 9999px;
          background: transparent;
          font-size: 0.75rem;
          color: var(--fg-muted);
          cursor: pointer;
          transition: all 0.15s;
        }
        .fb-interest:hover { border-color: var(--accent); color: var(--accent); }
        .fb-interest.active { background: var(--accent); border-color: var(--accent); color: #fff; }
        .fb-input {
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: var(--fg);
          outline: none;
          font-family: var(--font-body);
          background: var(--bg);
        }
        .fb-input:focus { border-color: var(--accent); }
        .fb-incentive { font-size: 0.75rem; color: var(--fg-muted); font-style: italic; margin: 0; }
        .fb-error { font-size: 0.8125rem; color: var(--accent); margin: 0; }
        .fb-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          text-align: center;
          color: var(--fg);
        }
        .fb-success p { margin: 0; }
        .fb-back-mobile { display: none; }

        /* Mobile */
        @media (max-width: 768px) {
          .fb-layout { grid-template-columns: 1fr; }
          .fb-form-wrap { display: none; }
          .fb-form-wrap.mobile-visible { display: block; }
          .fb-btn-mobile { display: inline-block; }
          .fb-back-mobile {
            display: block;
            background: none;
            border: none;
            font-size: 0.875rem;
            color: var(--accent);
            cursor: pointer;
            padding: 0 0 0.5rem;
          }
          .fb-expanded { padding: 0 1rem 2rem; }
        }
      `}</style>
    </aside>
  );
}
