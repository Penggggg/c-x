import { observable, action } from 'mobx';

/**
 * 图片标注
 */
class LabelImg {
    
    /** 
     * 正在选中的文件id（图片、音频等）
     * 通过该参数进入已完成、待标注列表
     */
    @observable
    selectedEntryFile: any = null;

    /**
     * 设置
     */
    @action
    setselectedEntryFile = ( file: any ) => {
        this.selectedEntryFile = file;
    }

}

export default new LabelImg( );