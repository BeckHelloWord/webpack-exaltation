const htmlWebpackPlugin = require('html-webpack-plugin');

/**
 * [chunkhash]:hash值，当文件有修改时，修改的文件的hash会进行变化
 * [name]:会将entery中的属性值，替换掉output中的[name]，即打包出来的文件名
 */
module.exports = {
    entry: {
        main: "./src/main.js",
        say: "./src/world.js"
    },
    output: {
        path: __dirname + '/dist',
        filename: "js/[name]-[chunkhash].js", //js文件生成到dist/js文件夹中
        publicPath: "//bxjr.com/", //为引用路径批量添加具体路径
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index-[chunkhash].html', //生成的模板命名
            template: "index.html", //指定html生成的模板
            inject: "head", //指定在模板中引入的位置
            title: "webapck 测试", //自定义模板内容，传参
            data: "我是通过webpack模板自定义的", //自定义模板内容，传参
            minify: {
                removeComments: true, //为模板去除注释
                collapseWhitespace: true, //为模板去除空格
            },
            chunks: ['main'], //制定改文件引入那个js文件（chunks）
        }),
        new htmlWebpackPlugin({
            filename: 'a-[chunkhash].html', //生成的模板命名
            template: "index.html", //指定html生成的模板
            inject: "head", //指定在模板中引入的位置
            title: "我是文件a", //自定义模板内容，传参
            data: "我是通过webpack模板自定义的", //自定义模板内容，传参
            minify: {
                removeComments: true, //为模板去除注释
                collapseWhitespace: true, //为模板去除空格
            },
            excludeChunks: ['main'], //排除文件，白话就是不要哪个文件引入文件，除它外其余都引入，与chunks异曲同工
        })
    ]
}