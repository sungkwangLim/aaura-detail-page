import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(projectDir, 'semantic.html'), 'utf8');
const css = fs.readFileSync(path.join(projectDir, 'styles.css'), 'utf8');
const scripts = ['analysis-slider.js', 'skin-code-rotation.js'].map((file) => fs.readFileSync(path.join(projectDir, file), 'utf8'));

test('every shipped class uses the aaura namespace and global element rules stay inside the component', () => {
  const htmlClasses = [...html.matchAll(/class="([^"]+)"/g)].flatMap((match) => match[1].trim().split(/\s+/));
  const selectorText = css.split(/\r?\n/).map((line) => line.slice(0, line.indexOf('{'))).filter((selector) => selector && !/^\s*(?:@|from\b|to\b|\d)/.test(selector));
  const cssClasses = [...selectorText.join(' ').matchAll(/\.([A-Za-z_][\w-]*)/g)].map((match) => match[1]);
  const unprefixed = [...new Set([...htmlClasses, ...cssClasses].filter((name) => !name.startsWith('aaura-')))];
  const unsafeGlobalRules = css.split(/\r?\n/).filter((line) => /^(?::root|\*|html|body|h[1-6](?:\s|,|\{)|p(?:\s|,|\{))/.test(line.trim()));

  assert.deepEqual(unprefixed, []);
  assert.deepEqual(unsafeGlobalRules, []);
});

test('every local image is served from the approved Cafe24 asset base without relative references', () => {
  const assetBaseUrl = 'https://ecimg.cafe24img.com/pg2912b19731780022/skinapse/web/detail/assets/';
  const deploymentFiles = fs.readdirSync(projectDir).filter((file) => /\.(?:html|css)$/.test(file));
  const deploymentSource = deploymentFiles.map((file) => fs.readFileSync(path.join(projectDir, file), 'utf8')).join('\n');
  const actual = fs.readdirSync(path.join(projectDir, 'assets'), { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name);
  const missingCafe24Urls = actual.filter((file) => !deploymentSource.includes(`${assetBaseUrl}${file}`)).sort();
  const relativeReferences = [...deploymentSource.matchAll(/(?:src=["']|url\(["']?)assets\/([A-Za-z0-9._-]+)/g)].map((match) => match[1]);

  assert.deepEqual(missingCafe24Urls, []);
  assert.deepEqual(relativeReferences, []);
});
