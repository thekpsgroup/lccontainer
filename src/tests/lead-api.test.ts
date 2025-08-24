import { describe, it, expect, vi } from 'vitest';
import { POST } from '../pages/api/lead';

function makePayload(extra: Partial<Record<string, any>> = {}) {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    interest: "Buy - 20'",
    zip: '12345',
    startedAt: String(Date.now() - 4000),
    ...extra,
  };
}

describe('lead API', () => {
  it('rejects invalid input based on schema', async () => {
    const payload = makePayload({ email: 'not-an-email' });
    const req = new Request('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const res = await POST({ request: req, clientAddress: '10.0.0.1' } as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe('Invalid input');
  });

  it('throttles rapid submissions from same IP', async () => {
    const start = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(start);
    const ip = '10.0.0.2';
    const body = JSON.stringify(makePayload());

    const req1 = new Request('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const res1 = await POST({ request: req1, clientAddress: ip } as any);
    expect(res1.status).toBe(200);

    const req2 = new Request('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const res2 = await POST({ request: req2, clientAddress: ip } as any);
    expect(res2.status).toBe(429);

    vi.advanceTimersByTime(10000);
    const req3 = new Request('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const res3 = await POST({ request: req3, clientAddress: ip } as any);
    expect(res3.status).toBe(200);

    vi.useRealTimers();
  });
});
