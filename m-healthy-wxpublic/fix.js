const fs = require("fs");
const path = require('path');

const jsDir =  path.join( __dirname, './public/dist');
fs.readdir( jsDir, ( err, files ) => {
    if ( err ) { return; }
    files.map( fileName => {
        if ( fileName.split('.')[ fileName.split('.').length - 1 ] === 'js' ) {
            fs.readFile( `${jsDir}/${fileName}`, 'utf8', (err, data ) => {
                if ( err ) {
                    return console.log('[Error]: remove use strict error.');
                }
                fs.writeFile(`${jsDir}/${fileName}`,
                    data.replace(/\'use strict\'/g, "")
                        .replace(/\"use strict\"/g, ""), 
                    err => {
                        if ( err ) {
                            return console.log('[Error]: remove use strict error in a.js');
                        }
                })
            })
        }
    });
});

