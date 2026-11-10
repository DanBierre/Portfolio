import { describe, test, expect, vi } from 'vitest';
import { validateBrief, handleBrief } from '../../worker/brief';
import { BUDGET_OPTIONS } from '../../src/site.config';

const good = { name: 'Ana', email: 'ana@studio.co', website: 'mycafe.co.nz', project: 'AI campaign', timeline: 'March', budget: BUDGET_OPTIONS[1] };
const env = (send = vi.fn().mockResolvedValue({ messageId: 'x' })) =>
  ({ EMAIL: { send }, BRIEF_TO: 'dan@x.com', BRIEF_FROM: 'brief@x.com' }) as any;
const req = (body: Record<string, string>, json = true) =>
  new Request('https://x/api/brief', {
    method: 'POST',
    body: new URLSearchParams(body),
    headers: json ? { accept: 'application/json' } : {},
  });

describe('validateBrief', () => {
  test('valid brief passes', () => expect(validateBrief(good)).toEqual({ ok: true, data: good }));

  test('trims whitespace', () =>
    expect(validateBrief({ ...good, name: '  Ana  ' })).toEqual({ ok: true, data: good }));

  test('rejects a multi-line website', () =>
    expect(validateBrief({ ...good, website: 'a.nz\nBcc: x' }).ok).toBe(false));

  test('rejects newline in name (header injection)', () =>
    expect(validateBrief({ ...good, name: 'Ana\r\nBcc: x@y.z' })).toMatchObject({
      ok: false,
      errors: { name: expect.any(String) },
    }));

  test('rejects missing required fields', () => {
    const r = validateBrief({ ...good, name: ' ', email: 'nope', project: '' });
    expect(r.ok).toBe(false);
    expect(Object.keys((r as any).errors).sort()).toEqual(['email', 'name', 'project']);
  });

  test('rejects project over 5000 chars', () => expect(validateBrief({ ...good, project: 'a'.repeat(5001) }).ok).toBe(false));

  test('rejects unknown budget', () => expect(validateBrief({ ...good, budget: '£1m' }).ok).toBe(false));

  test('timeline and budget are optional', () =>
    expect(validateBrief({ ...good, timeline: '', budget: '' }).ok).toBe(true));
});

describe('handleBrief', () => {
  test('sends email with replyTo and subject', async () => {
    const e = env();
    const res = await handleBrief(req(good), e);
    expect(res.status).toBe(200);
    expect(e.EMAIL.send).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'dan@x.com', from: 'brief@x.com', replyTo: 'ana@studio.co', subject: 'New brief from Ana' }),
    );
    expect(e.EMAIL.send.mock.calls[0][0].text).toContain('AI campaign');
  });

  test('honeypot: success response, nothing sent', async () => {
    const e = env();
    const res = await handleBrief(req({ ...good, hp_confirm: 'spam.io' }), e);
    expect(res.status).toBe(200);
    expect(e.EMAIL.send).not.toHaveBeenCalled();
  });

  test('invalid brief returns 400 json with errors', async () => {
    const res = await handleBrief(req({ ...good, email: 'nope' }), env());
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, errors: { email: expect.any(String) } });
  });

  test('send failure returns 502 json', async () => {
    const res = await handleBrief(req(good), env(vi.fn().mockRejectedValue(new Error('boom'))));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: 'send_failed' });
  });

  test('no-JS success redirects to /thanks', async () => {
    const res = await handleBrief(req(good, false), env());
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe('/thanks');
  });

  test('no-JS failure echoes escaped text and email', async () => {
    const res = await handleBrief(
      req({ ...good, project: '<b>hi</b>' }, false),
      env(vi.fn().mockRejectedValue(new Error())),
    );
    const html = await res.text();
    expect(res.status).toBe(502);
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(html).toContain('&lt;b&gt;hi&lt;/b&gt;');
    expect(html).not.toContain('<b>hi</b>');
    expect(html).toContain('mailto:');
  });

  test('oversize body is 413', async () =>
    expect((await handleBrief(req({ ...good, project: 'a'.repeat(70000) }), env())).status).toBe(413));

  test('GET is 405', async () => expect((await handleBrief(new Request('https://x/api/brief'), env())).status).toBe(405));
});

describe('review fixes', () => {
  test('autofill-prone field names are not treated as the honeypot', async () => {
    const e = env();
    await handleBrief(req({ ...good, company_website: 'studio.co' }), e);
    expect(e.EMAIL.send).toHaveBeenCalledOnce();
  });

  test('a long non-Latin brief within the character limit is accepted', async () => {
    const e = env();
    const res = await handleBrief(req({ ...good, project: 'д'.repeat(4000) }), e);
    expect(res.status).toBe(200);
  });
});
