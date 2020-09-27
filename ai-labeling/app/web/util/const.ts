const isProd = ( process.env.NODE_ENV || '').toLowerCase( ).includes('prod');

/** 系统地址 */
export const systems = {
    /** 数据集地址 */
    Datasets: isProd ? 
        `http://drive.research.cvte.cn/` :
        `http://10.22.21.26:9081/#/dashboard`,
    /** 服务管理 */
    Sys: isProd ? 
        `http://server.research.cvte.cn` :
        `http://10.22.21.27:8090`
}

/** 后台标注模板 跟 前端组件 映射关系 */
export const templte2Front = {
    // 图片标签
    image_classification: 'img-tag',
    // 音频标注
    voice: 'voice',
    // 图片检测
    detection: 'detection-tag',
    // 文本标注
    txt: 'txt'

};

/** 文件类型，跟mime的映射 */
export const fileType2Mime = {
    '图片': 'image/jpeg,image/png,image/jpg,image/bmp',
    '文本': 'application/json,text/plain,text/plain;charset=utf-8',
    '音频': 'audio/mpeg,audio/aav,audio/wav',
    '视频': 'video/mpeg,video/x-msvideo',
}