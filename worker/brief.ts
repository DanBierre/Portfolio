import { BUDGET_OPTIONS, site } from '../src/site.config';
import type { Env } from './index';

export type Brief = { name: string; email: string; project: string; timeline: string; budget: string };
type Errors = Partial<Record<keyof Brief, string>>;

// Per-field limits cap the text; this only stops oversized payloads (URL-encoded non-Latin text is ~6-9 bytes per char).
const MAX_BODY_BYTES = 64_000;
// Deliberately not an autofill-prone name, so browser extensions don't fill it for real visitors.
const HONEYPOT = 'hp_confirm';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBrief(
  input: Record<string, string>,
): { ok: true; data: Brief } | { ok: false; errors: Errors } {
  const get = (k: keyof Brief) => (input[k] ?? '').trim();
  const data: Brief = {
    name: get('name'),
    email: get('email'),
    project: get('project'),
    timeline: get('timeline'),
    budget: get('budget'),
  };
  const errors: Errors = {};

  if (!data.name) errors.name = 'Please add your name.';
  else if (data.name.length > 100 || /[\r\n]/.test(data.name)) errors.name = 'Please use a shorter, single-line name.';

  if (data.email.length > 254 || !EMAIL_RE.test(data.email)) errors.email = 'Please add a valid email address.';

  if (!data.project) errors.project = 'Tell me a little about the project.';
  else if (data.project.length > 5000) errors.project = 'Please keep this under 5,000 characters.';

  if (data.timeline.length > 200) errors.timeline = 'Please keep the timeline under 200 characters.';

  if (data.budget && !(BUDGET_OPTIONS as readonly string[]).includes(data.budget))
    errors.budget = 'Please choose a budget range from the list.';

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export async function handleBrief(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });

  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return new Response('Payload too large', { status: 413 });
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return new Response('Payload too large', { status: 413 });

  const fields = Object.fromEntries(new URLSearchParams(raw));
  const success = () =>
    wantsJson ? Response.json({ ok: true }) : new Response(null, { status: 303, headers: { location: '/thanks' } });

  // Bots fill the hidden field; give them a normal-looking success and send nothing.
  if (fields[HONEYPOT]) {
    console.log('brief honeypot hit');
    return success();
  }

  const result = validateBrief(fields);
  if (!result.ok) {
    return wantsJson
      ? Response.json({ ok: false, errors: result.errors }, { status: 400 })
      : fallbackPage(400, 'Some details need fixing', Object.values(result.errors), fields);
  }

  const { data } = result;
  try {
    await env.EMAIL.send({
      to: env.BRIEF_TO,
      from: env.BRIEF_FROM,
      replyTo: data.email,
      subject: `New brief from ${data.name}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Timeline: ${data.timeline || '-'}`,
        `Budget: ${data.budget || '-'}`,
        '',
        data.project,
      ].join('\n'),
    });
  } catch (err) {
    console.error('brief send failed', err);
    return wantsJson
      ? Response.json({ ok: false, error: 'send_failed' }, { status: 502 })
      : fallbackPage(502, 'Your brief didn’t send', ['Something went wrong on my side.'], fields);
  }

  return success();
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// Shown only to visitors without JavaScript: keeps their text so nothing is lost.
function fallbackPage(status: number, title: string, problems: string[], fields: Record<string, string>) {
  const contact = site.email;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${escape(title)}</title>
<style>body{font:1.05rem/1.55 system-ui,sans-serif;max-width:40rem;margin:3rem auto;padding:0 1rem;background:#f2f3f4;color:#121314}pre{white-space:pre-wrap;background:#fff;padding:1rem;border:1px solid #d6d9dc}a{color:#3e4a26}</style></head>
<body><h1>${escape(title)}</h1><ul>${problems.map((p) => `<li>${escape(p)}</li>`).join('')}</ul>
<p>Your message is below so you can copy it. Email it to <a href="mailto:${contact}">${contact}</a>, or <a href="javascript:history.back()">go back</a> to edit and resend.</p>
<pre>${escape(fields.project ?? '')}</pre></body></html>`;
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8' } });
}
