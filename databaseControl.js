
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectId = mongodb.ObjectId
const mongodbUrl = 'mongodb://127.0.0.1:27017'

class MongoControl {
    constructor(dbName, collectionName) {
        this.dbName = dbName
        this.collectionName = collectionName
    }
    _init(callback) {
        MongoClient.connect(mongodbUrl, { useNewUrlParser: true }, (error, client) => {
            if (error) {
                callback(error)
                return
            }
            var db = client.db(this.dbName)
            callback(null, db.collection(this.collectionName), client)
        })
    }
    find(findQuery, callback) {
        this._init((err, collection, client) => {
            collection.find(findQuery).toArray(function (err, res) {
                callback(err, res)
                client.close()
            })
        })
    }
    insert(docs, callback) {
        this._init((err, collection, client) => {
            collection.insert(docs, (err, res) => {
                callback(err, res)
                client.close()
            })
        })
    }
    update(findQuery, newDate, callback) {
        this._init((err, collection, client) => {
            collection.update(findQuery, { $set: newDate }, (err, res) => {
                callback(err, res)
                client.close()
            })
        })
    }
    remove(findQuery, callback) {
        this._init((err, collection, client) => {
            collection.remove(findQuery, (err, res) => {
                callback(err, res.result)
                client.close()
            })
        })
    }
    removeById(_id, callback) {
        var findQuery = { _id: ObjectId(_id) }
        this.remove(findQuery, callback)
    }
    updateById(_id, newDocs, callback) {
        var findQuery = { _id: ObjectId(_id) }
        this.update(findQuery, newDocs, callback)
    }
    findById(_id, callback) {
        var findQuery = { _id: ObjectId(_id) }
        this.find(findQuery, callback)
    }
}

exports.MongoControl = MongoControl