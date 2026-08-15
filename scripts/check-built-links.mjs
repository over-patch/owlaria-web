import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { relative, resolve, sep } from 'node:path';
import console from 'node:console';
import process from 'node:process';

const attributePattern =
  /\b(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>"'=]+))/gi;
const idPattern = /\bid\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>"'=]+))/gi;
const externalSchemePattern = /^[a-z][a-z\d+.-]*:/i;

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);

      if (entry.isDirectory()) {
        return findHtmlFiles(path);
      }

      return entry.isFile() && path.endsWith('.html') ? [path] : [];
    }),
  );

  return files.flat();
}

function valuesFor(pattern, html) {
  return Array.from(html.matchAll(pattern), (match) =>
    match.slice(1).find((value) => value !== undefined),
  );
}

function isInsideDirectory(directory, path) {
  const pathRelativeToDirectory = relative(directory, path);

  return (
    pathRelativeToDirectory === '' ||
    (!pathRelativeToDirectory.startsWith(`..${sep}`) &&
      pathRelativeToDirectory !== '..' &&
      !pathRelativeToDirectory.startsWith('..'))
  );
}

function hasEscapingPathSegment(pathname) {
  return pathname.split('/').some((segment) => {
    try {
      return ['.', '..'].includes(decodeURIComponent(segment));
    } catch {
      return true;
    }
  });
}

function targetPath(distDirectory, pathname) {
  if (pathname === '/') {
    return resolve(distDirectory, 'index.html');
  }

  const relativePath = pathname.slice(1);
  const destination = pathname.endsWith('/')
    ? `${relativePath}index.html`
    : relativePath;

  return resolve(distDirectory, destination);
}

async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

export async function checkBuiltLinks(distDirectory = resolve('dist')) {
  const errors = [];
  const htmlFiles = await findHtmlFiles(distDirectory);

  for (const htmlPath of htmlFiles) {
    const html = await readFile(htmlPath, 'utf8');
    const fileLabel = `/${relative(distDirectory, htmlPath)}`;
    const elementIds = new Set(valuesFor(idPattern, html));

    for (const value of valuesFor(attributePattern, html)) {
      if (
        !value ||
        externalSchemePattern.test(value) ||
        value.startsWith('//')
      ) {
        continue;
      }

      if (value.startsWith('#')) {
        const fragment = value.slice(1);
        if (fragment && !elementIds.has(fragment)) {
          errors.push(`${fileLabel}: missing same-page fragment #${fragment}`);
        }
        continue;
      }

      if (!value.startsWith('/')) {
        continue;
      }

      const [pathname] = value.split(/[?#]/, 1);
      if (hasEscapingPathSegment(pathname)) {
        errors.push(`${fileLabel}: path escapes dist: ${value}`);
        continue;
      }

      const target = targetPath(distDirectory, pathname);
      if (!isInsideDirectory(distDirectory, target)) {
        errors.push(`${fileLabel}: path escapes dist: ${value}`);
      } else if (!(await exists(target))) {
        errors.push(`${fileLabel}: missing target: ${value}`);
      }
    }
  }

  return errors;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const errors = await checkBuiltLinks();

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  }
}
