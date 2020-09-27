import React from 'react';
import { Tag } from 'antd';

/**
 * 将节点的nlp转换成后台的字段
 */
export const _fixCondition = variables => {
    const { range, variable, cnList, content, operator, intent, slot, entity } = variables;
    const variable_name = range === 'input' ?
        `&{input}` :
        range === 'variable' ?
            '${' + `${variable}` + '}':
            range === 'slot' ?
                `&{${cnList.join('.')}}` : 
                range === 'intent' ?
                    `#{${cnList.join('.')}}` :
                    `@{${cnList.join('.')}}`;
    let meta: any = { }

    if ( range === 'intent' ) {
        meta.skill_id = intent[ 0 ];
        meta.intent_id = intent[ 1 ];

    } else if ( range === 'slot' ) {
        meta.skill_id = slot[ 0 ];
        meta.intent_id = slot[ 1 ];
        meta.slot_id = slot[ 2 ];

    } else if ( range === 'entity' ) {
        meta.entity_id = entity
    }

    return {
        operator,
        variable_name,
        value: content,
        refer_field: meta,
        compare_type: range
    }
}

/**
 * 将节点的nlp转换成后台的字段
 */
export const fixCondition = conditions => {
    const rules = ( conditions.rules || [ ]).map( r => {
        const { variables } = r;
        return {
            ...r,
            variables: variables.map( _fixCondition )
        }
    })
    return {
        ...conditions,
        rules
    };
}

/**
 * fix slot
 */
export const fixSayList = ( say_type, say_list ) => {
    let _say_list = [ ];

    if ( say_type === 'text' ) {
        _say_list = say_list.map( x => ({
            show_type: 'text',
            content: {
                text: x
            }
        }))
    } else if ( say_type === 'image' ) {
        _say_list = say_list.map( x => ({
            show_type: 'image',
            content: {
                title: x.key,
                description: x.key,
                url: x.value
            }
        }))
    } else if ( say_type === 'my_option' ) {
        _say_list = say_list.map( x => ({
            show_type: 'option',
            content: {
                title: x.title,
                description: x.title,
                my_option: x.options.map( y => ({
                    label: y.key,
                    value: y.value
                }))
            }
        }))
    }

    return _say_list
}


/** 入参 */
export const fixInParams = parmas => {
    const { type, cnList, value, pos, name, need_deal } = parmas;
    let meta = { value, pos, name, need_deal };
    if ( type === 'slot' ) {
        meta = {
            ...meta,
            value: '&{' + `${cnList[ 0 ]}.${cnList[ 1 ]}.${cnList[ 2 ]}` + '}'
        }
    } else if ( type === 'context' ) {
        meta = {
            ...meta,
            value: '${' + value + '}'
        }
    }
    return meta;
}

/** 把各种回复类型，展现在节点上 */
export const showContent = output => {
    if ( !output ) return '';
    const { show_type, content } = output;
    if ( !content ) return '';
    const { url, text, title, my_option, get_log } = content;

    if ( show_type === 'text' ) return <pre style={{ width: '100%', whiteSpace: 'pre-line' }}>{ text }</pre>;
    if ( show_type === 'image' ) return `${url}`;
    if ( show_type === 'my_option' ) return `${title} 选项${( my_option || [ ]).length }个`
    if ( show_type === 'human_agent' ) return `${ !!get_log ? '' : '不'}携带聊天记录。${text}`
    if ( show_type === 'intent' ) return text;

    return '';
}

/** 展示词槽节点里面的内容 */
export const showSlot = slot_context => {
    if ( !slot_context ) return;
    const { entity_name, slot_name } = slot_context;
    return (
        <div>
            {
                !!entity_name ? (
                    <Tag
                        color='magenta'
                    >
                        { entity_name }
                    </Tag>
                ) : ''
            }
            {

                !!slot_name ? (
                    <Tag
                        color='blue'
                    >
                        { slot_name.split('@')[0]}
                    </Tag>
                ) : ''
            }
        </div>
    )
}