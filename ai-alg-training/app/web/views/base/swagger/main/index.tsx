import yaml from 'js-yaml';
import SwaggerUI from 'swagger-ui-react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { http } from '@cvte/ai-web-util/util';
import "swagger-ui-react/swagger-ui.css"

export const Main = ( props: RouteComponentProps ) => {

    /** swagger */
    const [ swagger, swagger$ ] = useState({ });

    /** didMount */
    useEffect(( ) => {
        const { search } = props.location;
        const [ qKey, qVal ] = search.split('=') 

        http.get<string>({
            url: decodeURIComponent( qVal )
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            swagger$( yaml.load( data ))
        })
    }, [ ]);

    return (
        <div className="animated fadeIn" style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
            {
                !!swagger && (
                    <SwaggerUI spec={ swagger }/>
                )
            }
        </div>
    );
}