# 注意事项

> 请保持antd版本在 3.x

```
// 请在webpack配置加入：

resolve: {
    alias: {
        antd: path.resolve('./node_modules/antd'), // 你的npm-antd路径
        react: path.resolve('./node_modules/react') // 你的npm-react路径
    }
}
```

```
// 请在webpack配置更改：

rules: [
    {
        test: /\.ts(x?)$/,
        exclude: /node_modules/, // 删除掉
        use: [
            {
                loader: "ts-loader",
                options: { allowTsInNodeModules: true } // 加入
            }
        ]
    },
    // ...
]
```