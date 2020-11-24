const express = require("express")
const path = require("path")
const fs = require("fs")
const md5 = require("md5-node")
const router = express.Router()
const MongoControl = require("../databasecontrol").MongoControl
const article = new MongoControl("MODEST", "article")
const multer = require('multer')//文件请求处理

// 文章列表获取
router.get("/getArticleList", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    article.find({}, function (error, result) {
        res.send(result.reverse())
    })
})
// 文章详情获取
router.get("/getArticle", (req, res) => {
    let { _id } = req.query
    res.setHeader('Access-Control-Allow-Origin', '*')
    article.findById(_id, function (error, result) {
        const newData = result[0]
        newData.browseNum += 1
        article.updateById(_id, newData, function (err, doc) {
            if (err) {
                res.handle500()
                return
            }
            res.send(result)
        })
    })
})
// 评论数更新
router.get("/remarkCount", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let { _id } = req.query
    var count = 0
    comment.find({}, (err, res) => {
        res.forEach(item => {
            if (item.topic_id == _id) {
                count++
            }
        })
    })
    article.findById(_id, function (error, result) {
        // console.log(result[0])
        var newData = result[0]
        newData.notRead = newData.notRead + 1
        newData.remark = count
        article.updateById(_id, newData, function (err, result) {
            if (err) {
                res.handle500()
                return
            }
            res.send("remark更新完成")
        })
    })
})
// 文章删除
router.get('/removeArticle', (req, res) => {
    let { _id } = req.query
    res.setHeader('Access-Control-Allow-Origin', '*')
    article.removeById(_id, function (err, result) {
        if (err) {
            res.handle500()
            return
        }
        res.send("删除成功")
    })
})
// 文章更新
const newDataGroup = multer().fields([
    { name: "titleImg" },
    { name: "mdUrl" }
])
router.post("/updataArticle", newDataGroup, function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    var _id = req.body['_id']
    var headTitle = req.body['headTitle']
    var contentTitle = req.body['contentTitle']
    var titleText = req.body["titleText"]
    var contentType = req.body["contentType"]
    var contentTag = req.body["contentTag"]
    var titleImg = req.files["titleImg"]
    var md = req.files["mdUrl"]
    // 文件数据处理
    var titleImgUrl = ""
    var MdUrl = ""
    article.findById(_id, function (error, result) {
        if (error) {
            res.send(createMsg(500, errUser));
            return
        }
        var newData = result[0]
        newData.headTitle = headTitle
        newData.contentTitle = contentTitle
        newData.titleText = titleText
        newData.contentType = contentType
        newData.contentTag = contentTag
        if (titleImg != undefined) {
            let { buffer, originalname } = titleImg[0]
            let filetype = originalname.split('.')[1]
            if (filetype != 'jpg' && filetype != 'png' && filetype != 'jpeg') {
                res.send(createMsg(3, "文件格式不正确"));
                return
            }
            let fileName = new Date().getMonth() + 1 + "." + new Date().getDate() + "_" + originalname.split(".")[0] + Math.floor(Math.random() * 345 + 111) + Math.floor(Math.random() * 678 + 222)
            fs.writeFileSync(`./static/articleImg/${fileName}.jpg`, buffer);
            titleImgUrl += fileName
            newData.titleImg = titleImgUrl
        }
        if (md != undefined) {
            let { buffer, originalname } = md[0]
            let filetype = originalname.split('.')[1]
            if (filetype != 'md') {
                res.send(createMsg(3, "文件格式不正确"))
                return
            }
            let mdName = new Date().getMonth() + 1 + "." + new Date().getDate() + "_" + originalname.split(".")[0] + Math.floor(Math.random() * 345 + 111) + Math.floor(Math.random() * 678 + 222)
            fs.writeFileSync(`./static/markdown/${mdName}.md`, buffer);
            MdUrl += mdName
            newData.MdUrl = MdUrl
        }
        article.updateById(_id, newData, function (err, result) {
            if (err) {
                res.handle500()
                return
            }
            res.send("更新成功!")
        })
    })
})
// 文章图片获取
router.get("/articleImg", function (req, res) {
    var picName = req.query.name
    res.sendFile(path.resolve("./static/articleImg/" + picName + ".jpg"))
})
// 文章文件获取
router.get("/articleMd", function (req, res) {
    var mdName = req.query.name
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.sendFile(path.resolve("./static/markdown/" + mdName + ".md"))
})
// modest文章录入
const dataGroup = multer().fields([
    { name: "titleImg" },
    { name: "mdUrl" }
])
router.post("/addArticle", dataGroup, (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    // 值类型数据处理
    var headTitle = req.body['headTitle']
    var contentTitle = req.body['contentTitle']
    var titleText = req.body["titleText"]
    var contentType = req.body["contentType"]
    var contentTag = req.body["contentTag"]
    var date = req.body["date"]
    var titleImg = req.files["titleImg"]
    var md = req.files["mdUrl"]
    // 文件数据处理
    var titleImgUrl = ""
    var MdUrl = ""
    // 默认数据
    var isFirst = false
    var browseNum = 0
    var remark = 0
    var notRead = 0
    if (titleImg != undefined) {
        let { buffer, originalname } = titleImg[0]
        let filetype = originalname.split('.')[1]
        if (filetype != 'jpg' && filetype != 'png' && filetype != 'jpeg') {
            res.send(createMsg(3, "文件格式不正确"));
            return
        }
        let fileName = new Date().getMonth() + 1 + "." + new Date().getDate() + "_" + originalname.split(".")[0] + Math.floor(Math.random() * 345 + 111) + Math.floor(Math.random() * 678 + 222)
        fs.writeFileSync(`./static/articleImg/${fileName}.jpg`, buffer);
        titleImgUrl += fileName
    }
    if (md != undefined) {
        let { buffer, originalname } = md[0]
        let filetype = originalname.split('.')[1]
        if (filetype != 'md') {
            res.send(createMsg(3, "文件格式不正确"))
            return
        }
        let mdName = new Date().getMonth() + 1 + "." + new Date().getDate() + "_" + originalname.split(".")[0] + Math.floor(Math.random() * 345 + 111) + Math.floor(Math.random() * 678 + 222)
        fs.writeFileSync(`./static/markdown/${mdName}.md`, buffer);
        MdUrl += mdName
    }
    article.insert({
        headTitle: headTitle,
        contentTitle: contentTitle,
        titleImg: titleImgUrl,
        titleText: titleText,
        contentType: contentType,
        contentTag: contentTag,
        headTitle: headTitle,
        date: date,
        MdUrl: MdUrl,
        isFirst: isFirst,
        browseNum: browseNum,
        remark: remark,
        notRead: notRead
    }, (err, result) => {
        if (err) {
            res.status(500).send()
            return
        }
        res.send('录入成功!')
    })
})
module.exports = router