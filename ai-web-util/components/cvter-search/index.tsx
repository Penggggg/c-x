import { Select } from 'antd';
import React, { useMemo } from 'react';
import { useList } from '../../hooks';

/**
 * @description
 * cvter的搜索框
 */
export const CvterSearch = ({ url, query, accountKey, nameKey, placeholder, onChange, multipul = false }: TComCvterSearch ) => {

    /** 域名账号成员 */
    const [ staff, staff$ ] = useList<any>({
        listUrl: url
    });

    /** 进行搜索 */
    const onSearch = ( search: string ) => {
        if (( search || '' ).includes('-')) {
            return;
        }
        if ( !search ) {
            return staff$.reset( );
        }
        staff$.load(`?${query}=${search}`)
    }

    /** 点击选择 */
    const onChange_ = ( r: any ) => {
        !!onChange && onChange( r );
    }

    /** 选项 */
    const options$ = useMemo(( ) => {
        return [
            ...staff.map( x => `${ x[ nameKey ]}-${ x[ accountKey ]}`)
        ]
    }, [ staff ]);

    return (
        <Select 
            showSearch
            style={{ width: '100%' }}
            placeholder={ placeholder }
            onChange={( e: any ) => onChange_( e )}
            onSearch={( e: any ) => onSearch( e )}
            mode={ multipul ? 'multiple' : 'default' }
        >
            {
                options$.map(( o, k ) => (
                    <Select.Option 
                        key={ k }
                        value={ o }
                    >
                        { o }
                    </Select.Option>
                ))
            }
        </Select>
    )
}

type TComCvterSearch = {
    url: string
    query: string
    nameKey: string
    accountKey: string
    multipul?: boolean
    placeholder?: string,
    onChange?: ( result: string ) => void
}