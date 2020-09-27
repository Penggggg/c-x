import React, { useEffect } from 'react';

type TPageTitle = {
    children?: any,
    title: string
}
export const PageTitle = ({ children, title }: TPageTitle ) => {

    useEffect(( ) => {
        if ( !!title ) {
            document.title = title
        }
    }, [ ]);

    return (
        <div style={{ height: '100%' }}>
            { children }
        </div>
    );

}