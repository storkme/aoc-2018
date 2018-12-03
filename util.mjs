import { readFileSync } from 'fs';

export function fileToString(filename) {
    return readFileSync(filename, 'utf8');
}

export function readInputArray(filename) {
    return fileToString(filename)
        .split('\n')
        .map(s => s.trim());
}

export function readInput() {
    if (!process.argv[2]) {
        console.error(`Usage: node ${process.argv[1]} FILE`);
        process.exit(1);
    }

    return readInputArray(process.argv[2]);
}