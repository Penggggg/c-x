import { Context } from 'egg';

module.exports = {
    async myReq( url, options ) {

      const backupResult = {
        data: null,
        message: null,
        status: 500
      };

      try {

        options = Object.assign({ }, {
          dataType: 'json',
          contentType: 'json',
          timeout: '1000000',
        }, options );

        const iac = await this.ctx.service.common.index.getIAC( );

        const javaHeader = this.ctx.cookies.get('x-auth-token');

        options.headers = Object.assign({ }, options.headers, {
          'access-token': iac,
          'x-iac-token': iac
        });

        if ( javaHeader ) {
          options.headers = Object.assign({ }, options.headers, {
            'x-auth-token': javaHeader,
            // 'x-auth-token': '..LlmZIw-wuj_RT9RiZHlh//lWP5EExo-8jpxrRvRbm007b1YlkiHc4UZSi02aNTTYfEEFxdRhyU-59pEGxBG3endk13GZ6PqxLqOUlsPb4p_3jr353U4M75RBpM6zbLFkSlD6SrT8WwtZSybNgnzy-gbFYcfpvZDJFxXCS2oT2CxOQ'
          });
        }

        this.ctx.logger.info(`[Api] ${url} request options: ${JSON.stringify( options)}`);

        const req = await this.ctx.curl( url, options );
        const status = req.data.status || req.data.statusCode;

        this.ctx.logger.info(`[Api] ${url} result: ${JSON.stringify( req.data )}`);

        if ( Number( status ) !== 0 && Number( status ) !== 200 ) {
          return Object.assign( backupResult, {
            message: req.data.message,
          });
        }

        const data = req.data;
        return Object.assign( data, {
          status: 200,
        });

      } catch ( e ) {
        this.ctx.logger.error(`[Api] ${url} error: ${JSON.stringify( e )}`);
        return Object.assign( backupResult, {
          message: JSON.stringify( e ),
        });
      }
    },
  };