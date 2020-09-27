import React, { useState } from 'react';
// import { TextLabelTag } from '../../../components/text-label-tag';
import { Button } from 'antd';
import { http } from '@cvte/ai-web-util/util';
import { TextLabelTag } from '@cvte/ai-web-util/components';

export const TestPage = ( ) => {

    const [ tags, tags$ ] = useState([ 
        {
            id: 'tag-1',
            val: '主语'
        }, {
            id: 'tag-2',
            val: '谓语'
        }, {
            id: 'tag-3',
            val: '宾语'
        }, {
            id: 'tag-4',
            val: '形容词'
        }
    ]);

    const onChange = ( ) => {
        // tags$([
        //     {
        //         id: 'tag-1',
        //         val: '主语'
        //     }, {
        //         id: 'tag-2',
        //         val: '谓语'
        //     }, {
        //         id: 'tag-3',
        //         val: '宾语'
        //     }, {
        //         id: 'tag-4',
        //         val: '形容词'
        //     }, {
        //         id: 'tag-5',
        //         val: '形容词11'
        //     }
        // ])
        http.get({
            url: `/t-apis/user_info`
        });
    }

    return (
        <div>

            <Button
                onClick={ onChange }
            >
                ????
            </Button>

            <TextLabelTag 
                tags={ tags }
                params={[
                    "心心念念的往事、曾经深爱过的人、年少琐碎的过往，它们就像缠绕之间的一阵风，来的缱绻，去的时候让人来不及挽留。",
                    "我只希望，不管三年，五年，或是十年以后。某一天，我们相遇，还能相认，你大喊一声，我想死你了。那一刻，我定会泪流满面。我们是朋友，永远的朋友。"
                ]}
                defaultValue={[
                    {
                        paramKey: 0,
                        offset: 0,
                        length: 2,
                        tagId: 'tag-1'
                    }
                ]}
                onSure={ console.log }
                onDelete={ console.log }
                onUpdate={ console.log }
                onCreate={ console.log }
            />
        </div>
    );
}