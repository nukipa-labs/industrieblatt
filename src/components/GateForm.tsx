'use client';

// Inline gate form for content-gated blog posts. Rendered when
// `post.is_gated` is true on a FullPost (the CMS truncates the body to
// the first `gate_after_paragraph` paragraphs and drops components +
// sources). The submission unlocks the full body on subsequent reads
// for visitors matching the same email (the cms checks
// cms.form_submissions by email).
//
// Why this file is in the starter (platform contract): every site that
// reads from Nukipa's CMS can have any post gated by the customer at
// any time. Without this branch, gated posts look "broken" - body just
// stops mid-paragraph with no way to continue.
//
// On submit:
//   POST /public/v1/forms/<slug>/submit   {fields...}
// The cms persists the row + forwards to CRM. The unlock cookie is
// expected to be set by whatever surface owns visitor identity (the
// Nukipa-managed `apps/public` does this via `apps/public/server/api/
// forms.post.ts` -> setCookie('UNLOCK_COOKIE', email)). On a custom
// agent-generated site that points directly at the gateway, the visitor
// will re-unlock on the next page load only if your site also persists
// the email -> visitor identity. Out of the box this form unlocks the
// current page on success by triggering a refresh that the cms will
// answer from the visitor's now-existing submission row (matched by
// email when the cookie is wired). See `blog-integration.md` -> Gating
// for the full picture.

import { useCallback, useState } from 'react';
type GateFormField = { key: string; label?: string; type?: string; required?: boolean; placeholder?: string };

export interface GateFormProps {
  /** Slug of the form to submit to (cms.forms.slug). Required. */
  formSlug: string;
  /** Optional display name from the cms.forms row. */
  formName?: string | null;
  /** Field schema projected from the gate form. */
  fields: GateFormField[];
  /** Optional headline / sub-copy override. */
  heading?: string;
  subheading?: string;
}

const GATEWAY = process.env.NEXT_PUBLIC_NUKIPA_GATEWAY_URL || process.env.NUKIPA_GATEWAY_URL || '';

export function GateForm(props: GateFormProps) {
  const [values, setValues]   = useState<Record<string, string>>({});
  const [submitting, setSub]  = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const onChange = useCallback((key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
  }, []);

  const onSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!GATEWAY) {
      setError('Missing NEXT_PUBLIC_NUKIPA_GATEWAY_URL.');
      return;
    }
    setSub(true);
    setError(null);
    try {
      const res = await fetch(`${GATEWAY.replace(/\/+$/, '')}/public/v1/forms/${encodeURIComponent(props.formSlug)}/submit`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        // Browser sends the host on its own; the gateway forwards it to
        // the CMS so the slug lookup is tenant-scoped.
        body: JSON.stringify(values),
        credentials: 'include'
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message || `HTTP ${res.status}`);
      }
      // Reload so the server-rendered post fetches the now-unlocked body.
      // The CMS matches by email; if the visitor's cookie store carries
      // an identity that maps to this email it'll unlock on the next
      // request. (For platform-managed sites, apps/public sets the
      // unlock cookie automatically.)
      if (typeof window !== 'undefined') window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSub(false);
    }
  }, [props.formSlug, values]);

  const heading    = props.heading    || `Read the rest of this post`;
  const subheading = props.subheading || `Drop your email and we'll unlock the full article.`;

  return (
    <aside
      className="my-12 rounded-lg border border-slate-200 bg-slate-50 p-6"
      aria-label={props.formName || 'Gate form'}
    >
      <h2 className="text-xl font-semibold text-slate-900">{heading}</h2>
      <p className="mt-1 text-sm text-slate-600">{subheading}</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        {props.fields.map((f) => (
          <FieldInput
            key={f.key}
            field={f}
            value={values[f.key] ?? ''}
            onChange={(v) => onChange(f.key, v)}
          />
        ))}
        {error && (
          <p className="text-sm text-red-600" role="alert">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? 'Sending...' : 'Unlock'}
        </button>
      </form>
    </aside>
  );
}

function FieldInput({ field, value, onChange }: {
  field: GateFormField;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `gate-field-${field.key}`;
  const inputClasses = 'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900';
  const label = (
    <label htmlFor={id} className="block text-sm font-medium text-slate-700">
      {field.label || field.key}
      {field.required ? <span className="ml-1 text-red-600">*</span> : null}
    </label>
  );

  if (field.type === 'textarea') {
    return (
      <div>
        {label}
        <textarea
          id={id}
          value={value}
          required={field.required}
          placeholder={field.placeholder ?? undefined}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses + ' mt-1'}
        />
      </div>
    );
  }

  const inputType = field.type === 'email' ? 'email'
                  : field.type === 'phone' ? 'tel'
                  : field.type === 'number' ? 'number'
                  : 'text';

  return (
    <div>
      {label}
      <input
        id={id}
        type={inputType}
        value={value}
        required={field.required}
        placeholder={field.placeholder ?? undefined}
        onChange={(e) => onChange(e.target.value)}
        className={inputClasses + ' mt-1'}
      />
    </div>
  );
}
