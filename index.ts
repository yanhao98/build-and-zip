import fs from "fs";
import yargs from "yargs";
import { execSync, exec } from 'child_process';
import archiver from 'archiver';
import os from 'os';

function zipFolderAsync(sourceDir: string, outPath: string): Promise<void> {
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

function getCurrentFormattedTime() {
    let now = new Date();

    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let day = String(now.getDate()).padStart(2, '0');
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
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
        default:
            throw new Error(`Platform ${platform} is not supported`);
    }

    exec(command, (error) => {
        if (error) {
            console.error(`Could not open folder: ${error}`);
            return;
        }
        // console.log(`Folder '${path}' opened successfully.`);
    });
}

const cwd = process.cwd();
const packageJsonPath = `${cwd}/package.json`;
if (!fs.existsSync(packageJsonPath)) {
    console.error(`File not found: ${packageJsonPath}`);
    process.exit(1);
}
const name = require(packageJsonPath).name;
if (name === 'build-and-zip') process.exit(0);

const BUILD_TIME = getCurrentFormattedTime();

const argv = yargs()
    .option('script', {
        default: 'build',
    }).parseSync(process.argv);

const command = `npm run ${argv.script}`;
execSync(command, {
    stdio: 'inherit',
    cwd,
    env: {
        ...process.env,
        VITE_BUILD_TIME: BUILD_TIME,
    }
});

const distZipPath = `${cwd}/dist-zip`;
if (!fs.existsSync(distZipPath)) {
    fs.mkdirSync(distZipPath);
}
const filename = `${name}_${BUILD_TIME}.zip`;
await zipFolderAsync(`${cwd}/dist`, `${distZipPath}/${filename}`);
console.log(`Zip file created: ${distZipPath}/${filename}`);
openFolder(distZipPath);