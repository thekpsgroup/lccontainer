// @vitest-environment jsdom
import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const file = fs.readFileSync(path.resolve('src/components/QuoteForm.astro'), 'utf-8');
const scriptMatch = file.match(/<script>([\s\S]*)<\/script>/);
let scriptContent = scriptMatch ? scriptMatch[1] : '';
// Remove ESM-only references for eval in JSDOM
scriptContent = scriptContent.replace(/import\.meta\.env\.DEV/g, 'false');
const html = file
  .replace(/^---[\s\S]*?---/, '')
  .replace(/<script>[\s\S]*<\/script>/, '');

const dom = new DOMParser().parseFromString(html, 'text/html');
document.body.innerHTML = '';
document.body.append(...dom.body.children);

if (scriptContent) {
  // Transpile TypeScript annotations from the inline script before evaluating
  const transpiled = ts.transpileModule(scriptContent, {
    compilerOptions: { target: ts.ScriptTarget.ES2019, module: ts.ModuleKind.ESNext },
  }).outputText;
  // execute component script and expose validateStep globally
  // eslint-disable-next-line no-eval
  eval(`${transpiled};\nwindow.validateStep = validateStep;`);
}

const form = document.getElementById('quoteForm') as HTMLFormElement;

function callValidate(step: number) {
  return (window as any).validateStep(step);
}

describe('QuoteForm component', () => {
  it('includes anti-bot fields', () => {
    expect(form.querySelector('input[name="website"]')).not.toBeNull();
    expect(form.querySelector('#startedAt')).not.toBeNull();
  });

  it('validateStep enforces contact info', () => {
    expect(callValidate(0)).toBe('Please fill in all required fields.');
    (form.elements.namedItem('name') as HTMLInputElement).value = 'John';
    (form.elements.namedItem('email') as HTMLInputElement).value = 'john@example.com';
    (form.elements.namedItem('phone') as HTMLInputElement).value = '1234567890';
    expect(callValidate(0)).toBeNull();
  });

  it('validateStep checks ZIP format', () => {
    const zip = form.elements.namedItem('zip') as HTMLInputElement;
    zip.value = 'abcde';
    expect(callValidate(2)).toBe('Please enter a valid 5-digit ZIP code.');
    zip.value = '12345';
    expect(callValidate(2)).toBeNull();
  });
});
