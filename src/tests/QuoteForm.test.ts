// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const file = fs.readFileSync(path.resolve('src/components/QuoteForm.astro'), 'utf-8');
const scriptMatch = file.match(/<script>([\s\S]*)<\/script>/);
const scriptContent = scriptMatch ? scriptMatch[1] : '';
const html = file
  .replace(/^---[\s\S]*?---/, '')
  .replace(/<script>[\s\S]*<\/script>/, '');

const dom = new DOMParser().parseFromString(html, 'text/html');
document.body.innerHTML = '';
document.body.append(...dom.body.children);

if (scriptContent) {
  // execute component script and expose validateStep globally
  eval(`${scriptContent};\nwindow.validateStep = validateStep;`);
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
