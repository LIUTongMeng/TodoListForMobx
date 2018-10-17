const path = require('path')
const config = {
    mode:'development',
    entry:'./src/index.jsx',
    output:{
        path:path.resolve(__dirname, 'dist'),
        filename:'main.js'
    },
    module:{
        rules:[
            {
                test:/\.jsx?$/,
                loader:'babel-loader'
            }
        ]
    },
    devtool:'source-map',
    devServer:{
        contentBase:path.resolve(__dirname, 'dist'),
        port :8003
    }
}

module.exports = config