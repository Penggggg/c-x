import * as mysql from 'mysql';

type Tresult = {
    ok: boolean,
    result?: any
}

interface ISql {
    readonly host: string
    readonly pool: mysql.Pool
    sql( sql: string ): Promise< Tresult >
}

class Sql implements ISql {

    public pool!: mysql.Pool;
    public host!: string;

    constructor( config: Partial< mysql.PoolConfig >) {

        // 研究院 - sql默认host为10.22.21.25
        this.host = config.host ?
            config.host : '10.22.21.25';

        this.pool = mysql.createPool({
            ...config,
            host: this.host,
            insecureAuth: true,
            multipleStatements: true
        });
    }

    public sql( sql = '' ): Promise< Tresult > {
        return new Promise( res => {
            this.pool.getConnection(( err, connection ) => {
                if ( !!err ) {
                    console.log(`
                        ============ Sql Connection Error ==========
                    `)
                    console.log( err );
                    return res({ 
                        ok: false,
                    });
                }
                connection.query( sql, ( err, rows ) => {
                    if ( !!err ) {
                        console.log(`
                            ============ Sql query ==========
                        `)
                        console.log( err );
                        return res({ 
                            ok: false,
                        });
                    }
                    res({
                        ok: true,
                        result: rows
                    });
                    connection.release( );
                })
            });
        })
    }
}

export { Sql };