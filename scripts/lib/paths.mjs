import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const DATA_DIR = path.join(ROOT, 'data');
export const ENTRIES_DIR = path.join(DATA_DIR, 'entries');
export const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.yml');
export const METRICS_FILE = path.join(DATA_DIR, 'metrics.json');
export const LINK_STATUS_FILE = path.join(DATA_DIR, 'link-status.json');

export const SCHEMA_FILE = path.join(ROOT, 'schema/entry.schema.json');

export const README_FILE = path.join(ROOT, 'README.md');
export const DOCS_DIR = path.join(ROOT, 'docs');
export const LIST_DIR = path.join(DOCS_DIR, 'list');
export const DIST_DIR = path.join(ROOT, 'dist');
