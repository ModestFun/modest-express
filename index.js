const express = require("express")
const spdy = require('spdy')
const fs = require("fs")
const bodyParser = require("body-parser")
const cors = require('cors')
// 引入文件
const carrerRouter = require("./routes/career.router")
// 配置
const app = express()
const httpsOption = {
    key: fs.readFileSync("./https/3888548_modestfun.com.key"),
    cert: fs.readFileSync("./https/3888548_modestfun.com.pem")
}
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const hostname = "localhost"
const port = 3030
// 监听
// spdy.createServer(httpsOption, app).listen(port,()=>{
//     console.log(`Server running at http://${hostname}:${port}!`)
// })
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}!`)
})
// 历程路由
app.use("/api-career", carrerRouter)

// 博客首页路由
// app.use("/static", express.static('./build/static'));
// app.use("/assets", express.static('./build/assets'));
// app.get('/', function (req, res) {
//     res.sendFile(path.resolve('./build/index.html'));
// })
// app.get('/:id', function (req, res) {
//     res.sendFile(path.resolve('./build/index.html'));
// })
// app.get('/:id/:id', function (req, res) {
//     res.sendFile(path.resolve('./build/index.html'));
// })

