import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Security Tests: Infrastructure', () => {
  const rootDir = path.resolve(__dirname, '../../..');

  it('firebase.json has all 7 security headers', () => {
    const data = fs.readFileSync(path.join(rootDir, 'firebase.json'), 'utf8');
    const json = JSON.parse(data);
    const headers = json.hosting.headers[0].headers;
    const headerKeys = headers.map((h: any) => h.key);
    
    expect(headerKeys).toContain('Content-Security-Policy');
    expect(headerKeys).toContain('Strict-Transport-Security');
    expect(headerKeys).toContain('X-Content-Type-Options');
    expect(headerKeys).toContain('X-Frame-Options');
    expect(headerKeys).toContain('X-XSS-Protection');
    expect(headerKeys).toContain('Referrer-Policy');
    expect(headerKeys).toContain('Permissions-Policy');
  });

  it('firestore.rules has default deny-all', () => {
    const data = fs.readFileSync(path.join(rootDir, 'firestore.rules'), 'utf8');
    expect(data).toMatch(/match \/\{document=\*\*\} \{\s*allow read, write: if false;\s*\}/);
  });

  it('firestore.rules enforces authentication', () => {
    const data = fs.readFileSync(path.join(rootDir, 'firestore.rules'), 'utf8');
    expect(data).toContain('request.auth != null');
  });

  it('firestore.rules enforces ownership for sessions', () => {
    const data = fs.readFileSync(path.join(rootDir, 'firestore.rules'), 'utf8');
    expect(data).toContain('request.resource.data.userId == request.auth.uid');
  });

  it('.env.example contains all required variables', () => {
    const data = fs.readFileSync(path.join(rootDir, '.env.example'), 'utf8');
    expect(data).toContain('VITE_FIREBASE_API_KEY=');
    expect(data).toContain('VITE_FIREBASE_AUTH_DOMAIN=');
    expect(data).toContain('VITE_GEMINI_API_KEY=');
    expect(data).toContain('VITE_GA_MEASUREMENT_ID=');
  });

  it('No hardcoded API keys in env.ts', () => {
    const data = fs.readFileSync(path.join(rootDir, 'src/config/env.ts'), 'utf8');
    expect(data).not.toContain('AIzaSy');
  });

  it('No hardcoded API keys in firebase.ts', () => {
    const data = fs.readFileSync(path.join(rootDir, 'src/config/firebase.ts'), 'utf8');
    expect(data).not.toContain('AIzaSy');
  });

  it('No hardcoded API keys in constants', () => {
    const data = fs.readFileSync(path.join(rootDir, 'src/constants/index.ts'), 'utf8');
    expect(data).not.toContain('AIzaSy');
  });

  it('manifest.json does not leak sensitive info', () => {
    const data = fs.readFileSync(path.join(rootDir, 'public/manifest.json'), 'utf8');
    expect(data).toContain('"short_name":');
    expect(data).not.toContain('key');
  });

  it('.gitignore blocks .env files', () => {
    const data = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf8');
    expect(data).toContain('.env');
    expect(data).toContain('.env.local');
  });
});
