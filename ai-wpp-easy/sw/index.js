const fs = require('fs');
const path = require('path');
const axios = require('axios');

// const wpHost = `http://127.0.0.1:3001`;
const wpHost = `https://wpp.ai.cvte.com`;

module.exports = async ( cmd ) => {

    // --file参数
    const { file } = cmd.opts( );
    if ( !file ) return
    
    // 读取.json文件
    const Conf = JSON.parse( 
        fs.readFileSync( 
            path.join( process.cwd( ), file ), {
                encoding: 'utf8'
            })
    );
    if ( !Conf.wpp || ( !!Conf.wpp && !Conf.wpp.sw )) return;

    // 读取文件里面的
    const { jsPath, imgPath, app, adm, env, prefix } = Conf.wpp.sw;
    if ( !app || !adm || !env ) return;
    if ( !jsPath && !imgPath ) return 

    // 读取buildPath中的.js文件列表
    let jsList = [ ];
    if ( !!jsPath ) {
        jsList = fs.readdirSync( 
            path.join( process.cwd( ), jsPath )
        ).filter( 
            x => x.endsWith('.js')
        ).map( 
            x => `${ prefix || '' }${ jsPath.startsWith('.') ? jsPath.slice( 1 ) : jsPath }/${x}`
        );
    }
    
    // 读取imgPath中的.js文件列表
    const imgEnd = [ '.jpg', '.jpeg', '.png', '.gif' ]
    let imgList = [ ];
    if ( !!imgPath ) {
        imgList = fs.readdirSync( 
            path.join( process.cwd( ), imgPath )
        ).filter( 
            x => imgEnd.some( y => x.endsWith( y ))
        ).map( 
            x => `${ prefix || '' }${ imgPath.startsWith('.') ? imgPath.slice( 1 ) : imgPath }/${x}`
        );
    }

    const _env = env.toLowerCase( );
    const envName = _env.startsWith('test') ?
        '( 测试环境 )' :
        _env.startsWith('prod') ?
            '( 正式环境 )' :
            _env.startsWith('dev') ? 
                '( 开发环境 )' : '( 未配置环境 )'

    // 对接wpp
    const jsData = {
        adm,
        prefix,
        type: 'web',
        list: jsList,
        appName: `${app}${envName}`
    };

    const imgData = {
        adm,
        prefix,
        list: imgList,
        type: 'gradual',
        appName: `${app}${envName}`
    };

    console.log('jsList: ', jsList );
    console.log('imgList: ', imgList );

    // 注入脚本到 buildPath中的.html文件
    try {
        const scriptUrl = await cacheJSorImg( jsData, imgData );
        const htmlFile = path.join( process.cwd( ), `${jsPath}/index.html` );
        if ( !scriptUrl ) return

        if ( fs.existsSync( htmlFile )) {
            const htmlStr = fs.readFileSync( htmlFile, { encoding: 'utf8' });
            const insertKey = '</title>';
            const Index = htmlStr.indexOf( insertKey ) + insertKey.length;
            const newHtml = htmlStr.slice( 0, Index ) + '\n<script type="text/javascript" src="' + scriptUrl + '"></script>' + htmlStr.slice( Index )

            fs.writeFileSync( htmlFile, newHtml );
        }
    } catch ( e ) { console.log( e )}
}

async function cacheJSorImg( jsData, imgData ) {
    let scriptUrl = '';

    if ( jsData.list.length !== 0 ) {
        const swJS = await axios({
            data: jsData,
            method: 'post',
            url: `${wpHost}/apis/sw-conf/for-build`
        });
        scriptUrl = swJS.data.data
    }

    if ( imgData.list.length !== 0 ) {
        const swJS = await axios({
            data: imgData,
            method: 'post',
            url: `${wpHost}/apis/sw-conf/for-build`
        });
        scriptUrl = swJS.data.data
    }

    return scriptUrl;
}