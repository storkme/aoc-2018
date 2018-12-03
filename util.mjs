import { readFileSync } from 'fs';

export function fileToString(filename) {
    return readFileSync(filename, 'utf8');
}