const express = require("express")
const path = require("path")
const fs = require("fs")
const md5 = require("md5-node")
const router = express.Router()
const MongoControl = require("../databasecontrol").MongoControl
const career = new MongoControl("MODEST", "career")


router.post("/addCareer", (req, res) => {
    const { date, content } = req.body
    let picPath = ""
    let picName = ""
    let picMd5 = ""
    if (req.body.pic) {
        fs.writeFileSync(path.resolve(`./routes/careerPic/${req.body.picName}.txt`), req.body.pic, () => { })
        picPath = `/careerPic/${req.body.picName}`
        picMd5 = md5(req.body.pic)
        picName = req.body.picName
    }
    career.insert({
        date: date,
        content: content,
        picPath,
        picName,
        picMd5
    }, (err, result) => {
        res.send({
            success: 8001,
            message: "提交成功！"
        })
    })
})
router.get("/getCareer", (req, res) => {
    career.find({}, (err, result) => {
        res.send({
            success: 8001,
            message: result
        })
    })
})
router.get("/careerPic/:id", (req, res) => {
    res.sendFile(path.resolve(`./routes/careerPic/${req.params.id}.txt`))
})
router.get('/removeCareer', (req, res) => {
    let { _id } = req.query
    career.removeById(_id, function (err, result) {
        if (err) {
            res.handle500()
            return
        }
        res.send("删除成功")
    })
})

module.exports = router