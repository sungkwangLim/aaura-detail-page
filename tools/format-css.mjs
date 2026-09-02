import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssFiles = fs.readdirSync(projectDir).filter((name) => name.endsWith(".css"));

function normalizedProperty(property) {
  return property.toLowerCase().replace(/^-(webkit|moz|ms|o)-/, "");
}

function propertyGroup(property) {
  const name = normalizedProperty(property);
  if (name.startsWith("--")) return 0;
  if (/^(position|inset|top|right|bottom|left|z-index|display|visibility|float|clear|overflow|clip|columns?|flex|grid|gap|row-gap|column-gap|align|justify|place|order)/.test(name)) return 1;
  if (/^(box-sizing|width|min-width|max-width|height|min-height|max-height|margin|padding|border|border-radius|outline|box-shadow)/.test(name)) return 2;
  if (/^(font|line-height|letter-spacing|word|white-space|text|color|list-style)/.test(name)) return 3;
  if (/^(background|opacity|filter|backdrop-filter|object|fill|stroke|mask|clip-path|mix-blend-mode|isolation)/.test(name)) return 4;
  if (/^(transform|transform-origin|perspective|transition|animation|will-change|pointer-events|cursor|user-select|scroll)/.test(name)) return 5;
  return 6;
}

function findTopLevel(text, targets, start = 0) {
  let quote = "";
  let comment = false;
  let parentheses = 0;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (comment) {
      if (char === "*" && next === "/") { comment = false; index += 1; }
      continue;
    }
    if (!quote && char === "/" && next === "*") { comment = true; index += 1; continue; }
    if (quote) {
      if (char === "\\") { index += 1; continue; }
      if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === "(") { parentheses += 1; continue; }
    if (char === ")") { parentheses = Math.max(0, parentheses - 1); continue; }
    if (parentheses === 0 && targets.includes(char)) return index;
  }
  return -1;
}

function findMatchingBrace(text, openIndex) {
  let depth = 0;
  let quote = "";
  let comment = false;
  for (let index = openIndex; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (comment) {
      if (char === "*" && next === "/") { comment = false; index += 1; }
      continue;
    }
    if (!quote && char === "/" && next === "*") { comment = true; index += 1; continue; }
    if (quote) {
      if (char === "\\") { index += 1; continue; }
      if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error("Unbalanced CSS braces");
}

function collapseWhitespace(text) {
  return text.replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ").trim();
}

function splitDeclarations(body) {
  const parts = [];
  let start = 0;
  while (start < body.length) {
    const end = findTopLevel(body, [";"], start);
    if (end === -1) { parts.push(body.slice(start)); break; }
    parts.push(body.slice(start, end));
    start = end + 1;
  }
  return parts.map((part, index) => {
    const colon = findTopLevel(part, [":"], 0);
    if (colon === -1) return null;
    return {
      property: part.slice(0, colon).trim(),
      value: collapseWhitespace(part.slice(colon + 1)),
      index,
    };
  }).filter((item) => item && item.property && item.value);
}

function formatLeaf(header, body, indent) {
  const declarations = splitDeclarations(body).sort((a, b) => propertyGroup(a.property) - propertyGroup(b.property) || a.index - b.index);
  const content = declarations.map(({ property, value }) => `${property} : ${value};`).join(" ");
  return `${indent}${collapseWhitespace(header)} { ${content} }`;
}

function formatContainer(css, depth = 0) {
  const indent = "  ".repeat(depth);
  const output = [];
  let index = 0;
  while (index < css.length) {
    while (/\s/.test(css[index] || "")) index += 1;
    if (index >= css.length) break;
    if (css.startsWith("/*", index)) {
      const end = css.indexOf("*/", index) + 2;
      output.push(`${indent}${css.slice(index, end).trim()}`);
      index = end;
      continue;
    }
    const brace = findTopLevel(css, ["{"], index);
    const semicolon = findTopLevel(css, [";"], index);
    if (semicolon !== -1 && (brace === -1 || semicolon < brace)) {
      output.push(`${indent}${collapseWhitespace(css.slice(index, semicolon + 1))}`);
      index = semicolon + 1;
      continue;
    }
    if (brace === -1) break;
    const close = findMatchingBrace(css, brace);
    const header = css.slice(index, brace);
    const body = css.slice(brace + 1, close);
    if (findTopLevel(body, ["{"], 0) !== -1) {
      output.push(`${indent}${collapseWhitespace(header)} {`);
      output.push(formatContainer(body, depth + 1));
      output.push(`${indent}}`);
    } else {
      output.push(formatLeaf(header, body, indent));
    }
    index = close + 1;
  }
  return output.filter(Boolean).join("\n");
}

for (const cssFile of cssFiles) {
  const filePath = path.join(projectDir, cssFile);
  const source = fs.readFileSync(filePath, "utf8");
  fs.writeFileSync(filePath, `${formatContainer(source)}\n`, "utf8");
  process.stdout.write(`formatted ${cssFile}\n`);
}
