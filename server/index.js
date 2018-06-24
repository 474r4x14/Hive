
var Mongo = require("mongodb");
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
console.log('opening ws conn');

wss.on('connection', function connection(ws) {
    /*
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    */
    // ws.send(JSON.stringify(Swarm.lifeForms));
    // ws.send(JSON.stringify(World.tiles));

});


var MongoClient = Mongo.MongoClient;

require('./hive.min');


// var MongoClient = Mongo.MongoClient;
var url = "mongodb://hive.defenestrate.me:27017/";
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("hive");

    var createCollection = function(table, callback)
    {
        console.log('created????');
        dbo.createCollection(table,callback);
    };

    var find = function(table, cols, callback){
        return dbo.collection(table).find(cols).toArray(callback); //DB['collection']("biomes")['find']({})['toArray'](function(err, result) {
    };

    var findOne = function(table, cols, query){
        var row = dbo.collection(table).findOne(query, function(err, result) {
            // console.log('fondOne row:',result);
        }); // DB['collection']("tiles")['findOne']({x:this.x,y:this.y},{_id:1});
        return row;
    };

    var insertOne = function(table, object, callback){
        return dbo.collection(table).insertOne(object,callback);// DB['collection']("biomes")['insertOne'](biome, function(err, res) {
    };

    var update = function(table, keys, object){
        return dbo.collection(table).update(keys,object);
    };

    var dbMap = {
        createCollection:createCollection,
        find: find,
        findOne: findOne,
        insertOne: insertOne,
        update: update
    };

    console.log('DB connected!');
    start(dbMap);
});
