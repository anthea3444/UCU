const test = require('node:test');
const assert = require('node:assert');

const BASE = 'http://localhost:5001/api/auth';
const email = `test${Date.now()}@example.com`;
const password = 'Test@1234';
let token;

async function send(method, path, body, headers = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
}

test('register rejects missing fields', async () => {
  const r = await send('POST', '/register', { email });
  assert.strictEqual(r.status, 400);
});

test('register creates a new account', async () => {
  const r = await send('POST', '/register', { full_name: 'Test Student', email, password });
  assert.strictEqual(r.status, 201);
});

test('register rejects a duplicate email', async () => {
  const r = await send('POST', '/register', { full_name: 'Test Student', email, password });
  assert.strictEqual(r.status, 409);
});

test('login fails with a wrong password', async () => {
  const r = await send('POST', '/login', { email, password: 'wrong-password' });
  assert.strictEqual(r.status, 401);
});

test('login works and returns a token', async () => {
  const r = await send('POST', '/login', { email, password });
  assert.strictEqual(r.status, 200);
  assert.ok(r.data.token);
  assert.strictEqual(r.data.user.role, 'student');
  token = r.data.token;
});

test('protected route rejects a request with no token', async () => {
  const r = await send('GET', '/me');
  assert.strictEqual(r.status, 401);
});

test('protected route accepts a valid token', async () => {
  const r = await send('GET', '/me', null, { Authorization: `Bearer ${token}` });
  assert.strictEqual(r.status, 200);
});

test('a student cannot open the admin-only route', async () => {
  const r = await send('GET', '/admin-only', null, { Authorization: `Bearer ${token}` });
  assert.notStrictEqual(r.status, 200);
});

test('logout works', async () => {
  const r = await send('POST', '/logout', null, { Authorization: `Bearer ${token}` });
  assert.strictEqual(r.status, 200);
});

test('the token no longer works after logout', async () => {
  const r = await send('GET', '/me', null, { Authorization: `Bearer ${token}` });
  assert.strictEqual(r.status, 401);
});