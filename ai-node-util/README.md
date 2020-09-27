# node快速工具

> 皆在快速帮助node项目，链接各服务实例

## Sql

```
// your.sql.ts
import * as aiUtil from '@cvte/ai-node-util';
const config = {
    host, // 选填，不填则默认为研究院的sql服务
    port: 23321, // 仅需要填port
    user: 'root',
    password: 'dev**2018',
    database: 'ai-authoryty-center'
};
export default new aiUtil.Sql( config );

// any.ts
import sqlHelper from '../your.sql';
const result = await sqlHelper.sql(
    `SELECT name, FROM ${your_table} where id = ${your_id}`
);
```

## Nacos配置中心

> 注意：在dev模式，若你使用了nodemon，会导致不断重启node服务的情况

```
// your.ts

import path from 'path';
import * as aiUtil from '@cvte/ai-node-util';

const dataId = 'ai-authority-center-test';
const group = 'ai-authority-center-test';

aiUtil.getNacos( 
    dataId, 
    group, 
    path.join( __dirname, './config/index.json') // 制定生成一个配置json文件，选填。并且会监听nacos，实时更改配置文件
).then( res => {
    console.log( '...', res ); // 这里能输出配置
})
```

```
// nodemon.json

{   
    "ignore": ["config"] 
}
```

## 开发

```
cmd1: npm run dev
```
