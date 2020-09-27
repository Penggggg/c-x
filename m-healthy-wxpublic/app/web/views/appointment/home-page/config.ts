/** 大服务分类 */
export const serviceClassify = [
    {
        url: `/health-check/package`,
        chineseDes: '健康体检',
        englishDes: 'Physical Examination ',
        backImg: '/public/img/1@2x.png'
    },
    {
        url:'/appointment/order',
        firstDept: 'OUTPATIENT_DEPT',
        chineseDes: '门诊预约',
        englishDes: 'Clinic Reservation',
        backImg: '/public/img/2@2x.png'
    },
    {
        url:'/health-card/my',
        chineseDes: '健康卡预约',
        englishDes: 'Health Card Reservation',
        backImg: '/public/img/3@2x.png'
    },
    {
        url:'',
        firstDept: 'PSYCHOLOGY_DEPT',
        chineseDes: '心理咨询',
        englishDes: 'Psychological Counseling',
        backImg: '/public/img/4@2x.png'
    },
]

/** 健康服务 */
export const healthyService = [
    {
        url:'/appointment/record', 
        iconImg: '/public/img/7@2x.png',
        des: '我的预约'
    },
    {
        url:'/record/body-check', 
        iconImg: '/public/img/8@2x.png',
        des: '报告查询'
    },
    {
        url:'/health-service/clinic-record', 
        iconImg: '/public/img/5@2x.png',
        des: '就诊记录'
    },
    {
        url:'/my-order/list', 
        iconImg: '/public/img/6@2x.png',
        des: '我的订单'
    },
    {
        url:'/body-sign/list', 
        iconImg: '/public/img/9@2x.png',
        des: '我的体征'
    },
    {
        url:'/e/hall?tab=0', 
        iconImg: '/public/img/12@2x.png',
        des: '心理测评'
    },
    {
        url:'/account/family-members', 
        iconImg: '/public/img/11@2x.png',
        des: '我的家人'
    },
    {
        url:'',
        iconImg: '/public/img/10@2x.png',
        des: '我的计划'
    },
]

/** 视源健康课 */
export const healthLesson =  [{
    linkUrl: 'https://mp.weixin.qq.com/s/7Rx4hjKKjKkjM28l6978Qg',
    image: '/public/img/lesson2.jpg',
    title:'烟与肺癌的纷纷扰扰',
    time:'2019年6月27日'
  },
  {
    linkUrl: 'https://mp.weixin.qq.com/s/pa8m8COeDyzDOT7QYbm08Q',
    image: '/public/img/lesson3.jpg',
    title:'“胃”你保驾护航——胃癌大揭秘',
    time:'2019年6月1日'
  },{
    linkUrl: 'https://mp.weixin.qq.com/s/Ua_EU2OZhEdquKhq5WZvIQ',
    image: '/public/img/lesson1.jpg',
    title:'洗牙常见问题',
    time:'2019年4月29日'
  }];