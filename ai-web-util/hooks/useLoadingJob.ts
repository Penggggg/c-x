import { useState, useCallback } from 'react';

export const useLoadingJob = < T >( job: ( args?: any ) => Promise< any >) => {
    const [ isLoading, setLoading ] = useState( false );
    const doJob = useCallback(
        async outterArgs => {
            setLoading( true );
            const result = await job( outterArgs );
            setLoading( false );
            return result;
        },
        [ job ]
    );

    return [ doJob, isLoading ] as const;
}