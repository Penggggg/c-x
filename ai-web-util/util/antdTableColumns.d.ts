interface TCreateColumns {
    metaArr: {
        [key: string]: any;
    }[];
    meta: {
        [key: string]: any;
    };
    metaTitle: {
        [key: string]: string | {
            title?: string;
            render?: any;
            fixed?: any;
            width?: number;
        };
    };
    actions: {
        edit?: (record: any) => void;
        delete?: (record: any) => void;
        customs?: {
            render: any;
        }[];
    };
}
/**
 * 根据传入的对象、规则，生成table的columns
 */
export declare const createColumns: (metaArr: TCreateColumns['metaArr'], meta: TCreateColumns['meta'], metaTitle: TCreateColumns['metaTitle'], actions?: {
    edit?: ((record: any) => void) | undefined;
    delete?: ((record: any) => void) | undefined;
    customs?: {
        render: any;
    }[] | undefined;
} | undefined) => {
    columns?: undefined;
    dataSource?: undefined;
} | {
    columns: {
        title: string;
        key: string;
        dataIndex?: string | undefined;
        render?: any;
        fixed?: any;
        width?: number | undefined;
    }[];
    dataSource: {
        key: number;
    }[];
};
export {};
