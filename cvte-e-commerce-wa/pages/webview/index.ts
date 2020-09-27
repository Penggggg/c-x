

Page({
    data: {
        
        // 当前url
        url: ''

    },

    onLoad( options: any ) {
        this.setData!({
            url: options.url || ''
        });
    },
})
