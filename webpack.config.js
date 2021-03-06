var webpack = require("webpack");
var path = require("path");
module.exports = {
    entry:{
        loader:"./js/loader.js",
        vendor:"./js/vendor.js"
    },
    output:{
        path: __dirname + "/public/",
        filename: "[name].js",
        publicPath:"/altarix/public/"
    },
    resolve:{
        alias:{
            "jquery":path.resolve(__dirname+"/node_modules/jquery2")
        }
    },
    module: {
        loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader?presets[]=es2015'
			},
            {
                test: require.resolve("jquery2"),
                loader: "expose-loader?$!expose-loader?jQuery"
            },
            {
                test:/\.css$/,
                loader:"style-loader!css-loader"
            },
            {
                test:/\.(png|jpg|gif|svg|eot|woff|woff2|ttf)$/,
                loader:"file-loader?name=[path][name].[ext]"
            }
        ]
    },
	devtool:'source-map',
	plugins:[
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			sourceMap:true
		})
	]
}

