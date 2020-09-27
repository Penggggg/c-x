import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { parseQuery } from '../../../../util/query';
import { DeployList } from '../../../../containers/deploy-list';

type TPMyDeployList = { } & RouteComponentProps

export const MyDeployList = ({ location }: TPMyDeployList ) => {

    const [ urlParam, urlParam$ ] = useState('');

    useEffect(( ) => {
        const { url } = parseQuery( location.search )
        !!url && urlParam$( url );
    }, [ ]);

    return (
        <DeployList url={ urlParam } />
    );
}