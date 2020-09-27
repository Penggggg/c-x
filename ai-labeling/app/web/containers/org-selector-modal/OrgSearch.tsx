import { Layout, Input, Button } from 'antd';
import React, { useState, useEffect, useImperativeHandle } from 'react';
import './OrgSearch.less';

const OrgSearch = React.forwardRef(({ onFilterChange, initValue }: any, ref ) => {

    useImperativeHandle( ref, ( ) => ({
        reset: ( ) => {
            setName('');
            setAccount('');
        }
    }))

    /** 姓名 */
    const [ name, setName ] = useState('');
    /** 域账户 */
    const [ account, setAccount ] = useState('');

    /** 搜索 */
    const goSearch = ( ) => {
        !!onFilterChange && onFilterChange({
            name,
            account
        });
    };

    useEffect(( ) => {
        const { name, account } = ( initValue || { });
        setName( name );
        setAccount( account );
    }, [ ]);
    
    return (
        <div className="c-org-search">
            <div className="line">
                <div className="line-item mr">
                    <span>域账号：</span>
                    <Input 
                        value={ account }
                        onPressEnter={ goSearch }
                        onChange={ e => setAccount( e.target.value )}
                    />
                </div>
                <div className="line-item mr">
                    <span>姓名：</span>
                    <Input
                        value={ name }
                        onPressEnter={ goSearch }
                        onChange={ e => setName( e.target.value )}
                    />
                </div>
                <Button 
                    type="primary"
                    onClick={ goSearch }
                >
                    搜索
                </Button>
            </div>
        </div>
    );
});

export default React.memo( OrgSearch );