import React, { useState, useEffect } from 'react';
import { YuyinPY } from '../../containers/yuyin-py';
import { StepsContainer } from '@cvte/ai-web-util/components';

export const Test = ( ) => {

    const num = [1,2,3,4,5,6,7,8,9,10,11,12,13];

    const data = useState([
        {
            name: 'default',
            pys: [
                {"cn":"你好","py":[["ni3"],["hao3"]]},
                {"cn":"苹果","py":[["ping2"],["guo3"]]},
                {"cn":"哈哈","py":[["ha1"],["ha1"]]},
                {"cn":"丁雨晴\r","py":[["ding1","zheng1"],["yu3","yu4"],["qing2"],["\r"]]},
                {"cn":"丁雷\r","py":[["ding1","zheng1"],["lei2","lei4"],["\r"]]},
                {"cn":"丁骏波","py":[["ding1","zheng1"],["jun4"],["bo1","bei1","bi4"]]}
            ]
        }
    ])[ 0 ]

    useEffect(( ) => {
        const all: any = { };
        const forms: any = [ ]; 
        data.map( c => {
            all[ c.name ] = { };
            c.pys.map(( py, k ) => {

                const innerForm: any = [ ];
                all[ c.name ][ py.cn ] = [ ]

                py.py.map(( x, kk ) => {
                    if ( !py.cn[ kk ].trim( )) return;
                    innerForm.push({
                        opt: x,
                        label: py.cn[ kk ],
                        default: x[ 0 ],
                        name: c.name + '@' + py.cn + '@' + kk
                    });

                    all[ c.name ][ py.cn ].push( x[ 0 ])
                });

                if ( innerForm.every( x => x.opt.length === 1 )) return;

                forms.push({
                    name: '[' + c.name + '] ' + py.cn,
                    innerForm: innerForm.filter( x => x.opt.length > 1 )
                });
            });
        });

        // console.log({ 
        //     all,
        //     forms 
        // })

    }, [ data ])

    return (
        <div>
            <YuyinPY 
                bucket={''}
                data={ data }
            />

            {/* <StepsContainer
                gap={ 2 }
            >
                {
                    num.map( n => (
                        <div>
                            { n }
                        </div>
                    ))
                }
            </StepsContainer> */}
        </div>
    )
}