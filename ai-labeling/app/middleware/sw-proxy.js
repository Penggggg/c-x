"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require('axios');
var wpHost = "https://wpp.ai.cvte.com";
/**
 * sw文件的代理
 */
exports.swProxy2 = function (_a) {
    _a = {};
    return function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (ctx.path === '/sw.js') {
                        try {
                            ctx.set('content-type', 'application/javascript; charset=utf-8');
                            return [2 /*return*/, ctx.body = "\n\n                const t = " + Date.now() + ";\n\n\n\n                // \u5F88\u60F3\u8981 - \u5BA2\u6237\u7AEF\u4EE3\u7801\u3001\u5176\u4ED6\u514D\u767B\u9646\u8D44\u6E90\n                const reallyWant = [{\"ver\":1,\"url\":\"/dist/build/index.20d4c0da.js\",\"isIn\":true},{\"ver\":1,\"url\":\"/dist/build/vendor.d745c05b.js\",\"isIn\":true}]\n                \n                // \u6E10\u8FDB\u5F0F - \u533A\u5206 \u7CFB\u7EDF\u5185\u8D44\u6E90\u3001\u5916\u94FE\n                const graduals = [{\"ver\":1,\"url\":\"/dist/build/img/bg-1.jpg\",\"isIn\":true},{\"ver\":1,\"url\":\"/dist/build/img/bg-2.jpg\",\"isIn\":true},{\"ver\":1,\"url\":\"/dist/build/img/cvte.png\",\"isIn\":true}]\n                \n                // \u8FD9\u91CC\u5F00\u59CB\u4E0D\u7528\u751F\u6210\n                const version = 'wp-sw-v1';\n                const versionKey = '@';\n                \n                // \u5237\u65B0\u672C\u5730\u7F13\u5B58\n                const refreshCache = ( ) => new Promise( r => {\n                    // \u5F53\u524D\u57DF\u540D\n                    const { origin } = location;\n                    caches.open( version )\n                        .then( vCache => {\n                            vCache.keys( )\n                                .then( reqArr => {\n                \n                                    // \u5148\u505A\u5904\u7406\uFF1A\u62FF\u5230\u7248\u672C\u3001\u62FF\u5230url\n                                    const cacheArr = reqArr.map(({ url }) => {\n                                        const meta = url.split( versionKey ).filter( x => !!x );\n                                        const ver = Number( meta.pop( ));\n                                        const resource = meta.join( versionKey );\n                                        return {\n                                            ver,\n                                            url: resource\n                                        };\n                                    });\n                \n                                    // \u62FF\u5230\u5DF2\u7ECF\u4E0D\u5728\u914D\u7F6E\u5217\u8868\u3001\u6216\u7248\u672C\u4E0D\u76F8\u7B49\u7684\u7F13\u5B58\n                                    const delArr = cacheArr.filter( x => {\n                                        const target = [ ...graduals, ...reallyWant ]\n                                            .map( g => ({ \n                                                ...g, \n                                                url: g.isIn ? origin + g.url : g.url\n                                            }))\n                                            .find( c => c.url === x.url );\n                                        return !target || ( !!target && target.ver !== x.ver );\n                                    });\n                \n                                    delArr.length > 0 && console.log( '\u5220\u9664\u7F13\u5B58\uFF1A', delArr );\n                \n                                    Promise.all(\n                                        delArr.map( del => vCache.delete( del.url + versionKey + del.ver ))\n                                    ).then(( ) => r( ))\n                                })\n                        })\n                })\n                \n                // \u52A0\u8F7D\u5F88\u60F3\u8981\u7684\u8D44\u6E90\n                const getReallyWant = ( ) => new Promise( r => {\n                    caches.open( version )\n                        .then( vCache => {\n                            Promise.all(\n                                reallyWant.map( w => new Promise( r1 => {\n                \n                                    const cacheKey = w.url + versionKey + w.ver;\n                                    vCache.match( cacheKey )\n                                        .then( lastCache => {\n                                            if ( !!lastCache ) return r1( );\n                        \n                                            console.log('\u52A0\u8F7D\u8D44\u6E90\uFF1A', w.url );\n                                            fetch( w.url )\n                                                .then( res => {\n                                                    if ( res.ok ) {\n                                                        vCache\n                                                            .put( cacheKey, res.clone( ))\n                                                            .then(( ) => r1( ))\n                                                    } else {\n                                                        r1( )\n                                                    }\n                                                })  \n                                        })\n                                }))\n                            ).then(( ) => r( ))\n                        })\n                    \n                })\n                \n                this.addEventListener('install', e => {\n                    this.skipWaiting( );\n                    e.waitUntil(\n                        Promise.all([ ])\n                    );\n                });\n                \n                this.addEventListener('activate', e => {\n                    console.log('sw activate');\n                    e.waitUntil(\n                        Promise.all([\n                            clients.claim( ),\n                            // \u6839\u636E\u5217\u8868/\u7248\u672C\uFF0C\u5220\u9664\u672C\u5730\u65E0\u7528\u8D44\u6E90\n                            refreshCache( ),\n                            // \u52A0\u8F7D reallywant\n                            getReallyWant( )\n                        ])\n                    );\n                });\n                \n                this.addEventListener('fetch', e => {\n                \n                    const { origin } = location;\n                    const { url, method } = e.request;\n                \n                    const resource = [ ...graduals, ...reallyWant ]\n                        .map( g => ({ \n                            ...g, \n                            url: g.isIn ? origin + g.url : g.url\n                        }))\n                        .find( g => g.url === url );\n                \n                    !!resource && console.log('\u3010\u53D1\u8D77\u8BF7\u6C42\u3011', url );\n                \n                    if ( !!resource && method.toUpperCase( ) === 'GET' ) {\n                \n                        const cacheKey = url + versionKey + resource.ver;\n                        e.respondWith(\n                            caches.open( version )\n                                .then( vCache => vCache.match( cacheKey ))\n                                .then( reqCahe => {\n                \n                                    !!reqCahe && console.log('\u3010\u547D\u4E2D\u3011', cacheKey );\n                                    if ( !!reqCahe ) return reqCahe;\n                                    return fetch( e.request )\n                                        .then( res => {\n                                            caches\n                                                .open( version )\n                                                .then( vCache => \n                                                    vCache.put( cacheKey, res.clone( ))\n                                                )\n                                            return res.clone( );\n                                        })\n                                })\n                        );\n                    }\n                })\n                        ;\n                            \n                "];
                        }
                        catch (e) {
                            ctx.body = 'get sw error';
                        }
                    }
                    return [4 /*yield*/, next()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
};
