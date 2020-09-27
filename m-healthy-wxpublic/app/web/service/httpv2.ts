import Vue from 'vue';
import axios from 'axios';
import { HttpPluginV2 } from 'plugins/httpv2';

const Loading = require('muse-ui-loading').default;
const MuseUIToast = require('muse-ui-toast').default;

class httpV2 {

    public get<T>( options, tips?: Tips ) {
        return this.getOrigin<T>( 'get', options, tips );
    }

    public post<T>( options, tips?: Tips ) {
        return this.getOrigin<T>( 'post', options, tips );
    }

    public put<T>( options, tips?: Tips ) {
        return this.getOrigin<T>( 'put', options, tips );
    }

    public delete<T>( options, tips?: Tips ) {
        return this.getOrigin<T>( 'delete', options, tips );
    }

    private getOrigin<T>( type, options, tips?: Tips ) {
        return this.origin<T>( Object.assign({ }, options, {
            method: type
        }), tips );
    }

    private origin< T >( options, tips?: Tips ): Promise< T > {

        MuseUIToast.config({
            position: 'top', 
        });
    
        const load = tips ?
                        tips.loadMsg ?
                        Loading({
                              size: 30,
                              color: '#fff',
                              text: tips.loadMsg,
                              className: 'decorate-loading',
                              overlayColor: 'rgba( 0, 0, 0, 0.6)',
                          }) :
                          null :
                        null;
    
        options.header = options.header || { };
        options.headers = Object.assign({ }, options.header, {
          'x-csrf-token': getCookie('csrfToken'),
        });

        return axios( options )
                .then( req => {
    
                  const { status, message, data } = req.data;
    
                  if ( load ) {
                      load.close( );
                  }
    
                  if ( Number( status ) !== 200 && Number( status ) !== 0 ) {
    
                    MuseUIToast.error(
                      tips ?
                          tips.errMsg || message :
                          message
                    );

                    // 客户端报错
    
                  }
    
                  if ( ( Number( status ) === 200 || Number( status ) === 0 ) && !!tips && !!tips.successMsg ) {
                    MuseUIToast.success(
                      tips.successMsg
                    );
                  }
    
                  return req.data;
    
                }).catch( e => {
    
                    if ( load ) {
                        load.close( );
                    }
                    MuseUIToast.error(
                      '网络错误, 请稍后重试'
                    );
                    console.error('出错啦：',e);
    
                });
    }

}

type Tips = {
    loadMsg?: string
    errMsg?: string
    successMsg?: string
  };
  
type normalOpt<T> = {
    data?: any,
    headers?: any
    url: T
}

  // 获取cookie
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


export const httpv2 = new httpV2( );