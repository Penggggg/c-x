

export const generateDic = ( DIC: any = { }) => {

    /** 
     * 根据路径值，找到数据字典中对应的中文 
     * deepPath：用逗号分割开，如：'dataset.is_training'
     */
    const findDicCN = ( pathStr: string, val: string | number ) => {
        const dicArr: any = pathStr.split('.')
            .reduce(( pre, cur ) => {
                return pre[ cur ]
            }, DIC );
        
        const target = (dicArr || [ ]).find(( x: any ) => x.value === val || x.value === String( val ));
        return target ? target.label : '';
    }

    /** 
     * 根据路径值，返回一个数据字典 
     * 如：'dataset.is_training'
     */
    const findDic = ( pathStr: string ) => {
        return pathStr.split('.')
            .reduce(( pre, cur ) => {
                return pre[ cur ]
            }, DIC );
    }

    return {
        findDic,
        findDicCN
    }

}