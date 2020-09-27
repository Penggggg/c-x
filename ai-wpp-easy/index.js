const { program } = require('commander');

// 定义当前版本
program
    .version( require('./package').version );

// 定义使用方法
program
    .command('sw')
    .option('--file <file-string>', '定义wpp.swJSON文件的位置', './config/nacos.json' )
    .action( cmd => {
        require('./sw')( cmd )
            .then(( ) => { })
    });


program.parse( process.argv );