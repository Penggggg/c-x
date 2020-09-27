import React, { useEffect, useState } from 'react';

export const useQuery = ( ) => {

    const [ queryStr, queryStr$ ] = useState('')
    const [ query, query$ ] = useState< Query >({ });
    
    useEffect(( ) => {
        let temp = { };
        let str = location.search;
        location.search.slice( 1 ).split('&')
            .map( x => {
                const [ key, val ] = x.split('=');
                temp[ key ] = val;
            })
        query$( temp );
        queryStr$( str );
    }, [ ]);

    return [ 
        query, 
        queryStr
    ] as Result;
}

type QueryStr = string
type Result = [ Query, QueryStr ]
type Query = {[ key: string ]: string };