import React, { useMemo } from 'react';
import BraftEditor from 'braft-editor';
import { http } from '../../util';
import 'braft-editor/dist/index.css'

export const RichText = ({ defaultValue = '', onChange, uploadUrl = '', placeholder = '' }: RichText ) => {

    const val$ = useMemo(( ) => {
        return BraftEditor.createEditorState( defaultValue || '' );
    }, [ defaultValue ]);

    return (
        <BraftEditor 
            defaultValue={ val$ }
            placeholder={ placeholder }
            onChange={ e => !!onChange && onChange( e.toHTML( ))}
            excludeControls={[
                'hr', 
                'emoji', 
                'clear',
                'subscript', 
                'text-align', 
                'blockquote', 
                'font-family', 
                'line-height', 
                'text-indent', 
                'superscript', 
                'remove-styles', 
                'letter-spacing', 
            ]}
            media={ !!uploadUrl ? {
                uploadFn: ({ success, file, error }) => {

                    const { name } = file;
                    const formData = new FormData( );
                    formData.append('file', file );

                    http.post< any >({
                        data: formData,
                        url: uploadUrl
                    }).then(({ status, data }) => {
                        if ( status !== 200 ) return error({ msg: `错误` });
                        success({
                            url: `${ data.startsWith('http') ? data : 'http://' + data }`,
                            meta: {
                                id: name,
                                alt: name,
                                title: name,
                                poster: name,
                                loop: true,
                                autoPlay: true,
                                controls: true,
                              },
                        })
                    });
                }
            } : undefined }
        />
    )
}

type RichText = {
    uploadUrl?: string
    placeholder?: string
    defaultValue?: string
    onChange?: ( html: string ) => void
}