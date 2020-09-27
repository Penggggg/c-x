const fs = require('fs');
const readline = require('readline');
const child_process = require('child_process');

const path = './package.json';
const versionKey = 'version'
const { execSync } = child_process;
const packageJson = JSON.parse( fs.readFileSync( path, {
    encoding: 'utf8'
}) || '{ }');

const oldVersion = packageJson[ versionKey ];
const versionArr = oldVersion.split('.');
const lastVersion = Number( versionArr[ versionArr.length - 1 ]);

const newVersion = [
    ...versionArr.slice( 0, 2 ),
    lastVersion + 1
].join('.');

// 修改log颜色
console.log('\x1b[32m\x1b[1m');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Entre Publish Git Commit: ', answer => {

    // 这里可以加上你的构建脚本

    // 修改package.json的发布版本
    fs.writeFileSync( path, JSON.stringify({
        ...packageJson,
        [ versionKey ]: newVersion
    }));

    // 设置仓库 npm set registry https://npm.gz.cvte.cn
    execSync('npm set @cvte:registry https://npm.gz.cvte.cn');

    // git add .
    execSync('git add .');

    // // git commit -m , 这里可以改成cmd交互，来获取commit文本
    execSync(`git commit -m "${answer}"`);

    // // 发布
    execSync('npm publish');

    rl.close( );
});
