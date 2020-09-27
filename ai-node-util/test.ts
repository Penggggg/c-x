import { AiJwt } from './aiJwt';

const user = {"username":"何卓鹏","user_id":106,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSQU5ET00iOiI0OTA1NTciLCJjcmVhdGVfdGltZSI6MTU4NTE5NTg1NCwiZXhwIjoxNTg1MjgyMjU0LCJzc29fcm9sZSI6MCwidXNlcl9pZCI6MTA2fQ.zUUVEXewc73vXyabQKldzn9Fcv7obqr7o_NH_FzQ024","login_name":"hezhuopeng","role":{"role_name":"普通用户","role_identify":0,"from":"","is_new":false},"team":{"id":2,"team_name":"engineer","description":"工程组"}};

const a = async ( ) => {
    console.log('????')
    const b = await AiJwt.sign( user )
    console.log( b )
}

a( )