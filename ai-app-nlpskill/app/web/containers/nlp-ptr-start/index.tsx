import { Button, Drawer } from 'antd';
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { NlpPtrConditionRel } from '../nlp-ptr-condition-rel'
import { PtrConfTitle } from '../ptr-conf-title';

/**
 * nlp流程图，开始节点
 */
export const NlpPtrStart = React.forwardRef(({ abilityId = '', defaultValue = { }}: NlpPtrStart, ref ) => {

    const rulesRef = useRef< any >( null );
    const ptrDataRef = useRef< any >({ conditions: { }});

    /** 节点数据 */
    const [ ptrData, ptrData$ ] = useState< any >({ conditions: { }});
    const [ showDrawer, showDrawer$ ] = useState( false );

    const onSure = async ( ) => {
        const { err, data } = await getData( );
        if ( err ) return;
        ptrData$( data );
        showDrawer$( false );
        ptrDataRef.current = data;
    }

    /** 获取该节点的数据 */
    const getData = async ( ) => {

        const rulesEle = rulesRef.current;
        if ( !rulesEle ) {
            return {
                err: false,
                data: {
                    conditions: { }
                }
            }
        } else {
            const rules = await rulesEle.getData( );
            return {
                err: rules.err,
                data: {
                    conditions: rules.data
                }
            }
        }
    }

    useImperativeHandle( ref, ( ) => ({
        getData: async ( ) => {
            return ptrDataRef.current;
        }
    }))

    useEffect(( ) => {
        if ( !Object.keys( defaultValue ).length ) return;
        ptrDataRef.current = {
            conditions: ( defaultValue.conditions || { })
        };
    }, [ defaultValue ])

    return (
        <div className='con-nlp-ptr-start'>

            {/* 界面节点 */}
            <Button 
                icon='bulb'
                type='primary'
                onClick={( ) => showDrawer$( true )}
            >
                开始
            </Button>

            {/* 右侧弹框 */}
            <Drawer
                width={ 480 }
                visible={ showDrawer }
                title='配置 - 开始节点'
                onClose={( ) => showDrawer$( false )}
            >
                <PtrConfTitle 
                    title='规则配置'
                    tips={[
                        `规则配置：`,
                        '如果比较的范围是意图，则需要在内容里面填入判断意图的一个置信度（分数），例如80。 系统在判断用户的意图时，总会返回一个置信度（分数）。当大于或者小于该分数时触发本规则。',
                        `直接执行：`,
                        `无需任何条件或者规则，只要到达该节点即自动执行。`,
                        `执行子话题：`,
                        `跳过本节点，执行后面的节点/子话题。`
                    ]}
                />
                <NlpPtrConditionRel 
                    ref={ rulesRef }
                    abilityId={ abilityId }
                    types={[ 'conf', 'true', 'null' ]}
                    defaultValue={ Object.assign({ operator: 'conf', ...(( defaultValue || { }).conditions || { })})}
                />
                <Button
                    block
                    type='primary'
                    style={{ marginTop: 50 }}
                    onClick={ onSure }
                >
                    确定
                </Button>
                
            </Drawer>
        
        </div>
    )
});

type NlpPtrStart = {
    abilityId?: any
    defaultValue?: any
}

