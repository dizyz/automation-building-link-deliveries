import * as Path from 'path';

import {VISITOR_PASSWORD} from './@env';
import {sanitizeFilename} from './@utils';

export const PROJECT_DIR = Path.resolve(__dirname, '..');

export const PUBLIC_DIR = Path.resolve(PROJECT_DIR, 'public');
export const DELIVERIES_JSON_PATH = Path.resolve(
  PUBLIC_DIR,
  `deliveries_${sanitizeFilename(VISITOR_PASSWORD)}.json`,
);
export const DELIVERIES_MAINTENANCE_JSON_PATH = Path.resolve(
  PUBLIC_DIR,
  `deliveries_maintenance.json`,
);
