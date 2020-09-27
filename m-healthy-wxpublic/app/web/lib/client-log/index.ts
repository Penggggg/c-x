

/** 配置 */
(window as any).initConsole = ( opt: opt = {
    url: '/api/common/client-error',
    csrf: 'csrfToken',
    lsName: ''
}) => {
    const originErrorLog = window.console.error;
    window.console.error = ( msg ) => {

        // 获取csrf-token
        const csrf = getCookie( opt.csrf );

        // 获取ls数据
        let OtherMessage = '';
        opt.lsName!.split(',').map( lsName => {
            OtherMessage += `${lsName}: ${getLs( lsName )};`
        });

        // 组织上报错误
        const allMessage = `Origin Message: ${msg}; Other Message: ${OtherMessage}`;
        
        // 上传
        const xhr = new XMLHttpRequest( );
        xhr.open('POST', opt.url, true );
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');;
        if ( opt.csrfName ) {
            xhr.setRequestHeader( opt.csrfName, csrf );
        }
        xhr.send(JSON.stringify(`msg=${allMessage}`));

        originErrorLog( msg );
    }
}

/** 获取ls的值 */
function getLs( name ) {
    return localStorage.getItem( name );
}

/** 获取csrf-token */
function getCookie( name ) {
    name = name + '=';
    const start = document.cookie.indexOf(name);
    let value = '';
    if (start > -1) {
      let end = document.cookie.indexOf(';', start);
      if (end === -1) {
        end = document.cookie.length;
      }
      value = document.cookie.substring(start + name.length, end);
    }
    return value;
}

type opt = {
    url: string
    csrf?: string,
    lsName?: string,
    csrfName?: string
}