// import Server from "../src/Server.js";
var Mongo = require("mongodb");
const WebSocket = require('ws');
/*
import WebSocket from "ws";

// import Mongo from "mongodb";


// import Swarm from "../shared/Swarm";
// import World from "../shared/World";
*/
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
// Server.startDB(MongoClient, Server.loadBiomes);

require('./hive.min');
global.updateDB = function(table,data)
{
    console.log('weeeeeeeee UPDATEDB!!!! ',table,data,ttt);
}

// var MongoClient = Mongo.MongoClient;
var url = "mongodb://hive.defenestrate.me:27017/";
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    Server.DB = db.db("hive");
    // Server.DB.dropDatabase();
    console.log('DB connected!');
    // onComplete();
    // Server.DB =
    start(MongoClient);
});




