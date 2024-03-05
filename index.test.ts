import { describe, expect, test } from 'bun:test';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

describe('运行测试', () => {
    test('打包测试', () => {
        fs.rmdirSync('dist', { recursive: true });
        fs.rmdirSync('dist-zip', { recursive: true });

        fs.mkdirSync('dist');
        fs.writeFileSync('dist/file.txt', 'Hello, World!');

        execSync('node index.js --open=false', { stdio: 'inherit' });

        const files = fs.readdirSync('dist-zip');
        console.debug(`files :>> `, files);
        expect(files.length).toBe(1);
    });
});