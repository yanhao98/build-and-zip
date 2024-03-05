import archiver from 'archiver';
import dayjs from 'dayjs';
import { exec, execSync } from 'node:child_process';
import fs from "node:fs";
import os from 'node:os';
import yargs from "yargs";

const cwd = process.cwd();
const packageJsonPath = `${cwd}/package.json`;
if (!fs.existsSync(packageJsonPath)) {
    console.error(`File not found: ${packageJsonPath}`);
    process.exit(1);
}
let pkgName = require(packageJsonPath).name;
pkgName = pkgName.replace('@', '').replace('/', '-');
const BUILD_TIME = dayjs().format('YYYYMMDD_HHmmss');

const argv = yargs()
    .option('script', {
        default: 'build',
    })
    .parseSync(process.argv);

const command = `npm run ${argv.script}`;
execSync(command, {
    stdio: 'inherit',
    cwd,
    env: {
        ...process.env,
        VITE_BUILD_TIME: BUILD_TIME,
        VUE_APP_BUILD_TIME: BUILD_TIME,
    }
});

function zipFolderAsync(sourceDir: string, outPath: string): Promise<void> {
    // console.debug(`sourceDir :>> `, sourceDir);
    // console.debug(`outPath :>> `, outPath);
    // https://github.com/archiverjs/node-archiver?tab=readme-ov-file#quick-start

    return new Promise((resolve, reject) => {
        // 创建文件的写入流
        const output = fs.createWriteStream(outPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // 设置压缩级别
        });

        // 监听错误事件
        archive.on('error', err => reject(err));
        output.on('error', err => reject(err));

        // 文件写入完成事件
        output.on('close', () => {
            console.log(`Archive created successfully. Total bytes: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
            resolve();
        });

        // 将压缩内容的输出流与文件的写入流关联
        archive.pipe(output);

        // 将文件夹添加到压缩文件中
        archive.directory(sourceDir, false);

        // 完成归档（这将关闭流）
        archive.finalize();
    });
}

function openFolder(path: string) {
    const platform = os.platform();

    let command;
    switch (platform) {
        case 'darwin': // macOS
            command = `open "${path}"`;
            break;
        case 'win32': // Windows
            command = `start "" "${path}"`;
            break;
        // case 'linux': // Linux
        //     command = `xdg-open "${path}"`;
        //     break;
        // default:
        //     throw new Error(`Platform ${platform} is not supported`);
    }
    if (!command) {
        console.error(`[openFolder] Platform ${platform} is not supported`);
        return;
    }

    exec(command, (error) => {
        if (error) {
            console.error(`Could not open folder: ${error}`);
            return;
        }
        // console.log(`Folder '${path}' opened successfully.`);
    });
}

const distZipPath = `${cwd}/dist-zip`;
if (!fs.existsSync(distZipPath)) {
    fs.mkdirSync(distZipPath);
}
const filename = `${pkgName}_${BUILD_TIME}.zip`;
await zipFolderAsync(`${cwd}/dist`, `${distZipPath}/${filename}`);
console.log(`Zip file created: ${distZipPath}/${filename}`);
openFolder(distZipPath);
