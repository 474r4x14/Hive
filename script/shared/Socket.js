import Biome from "./Biome";
import Hive from "./Hive";

export default class Socket {

    // A client has connected
    static connection(ws)
    {
        console.log('connected!');
        ws.on('message', function(data){Socket.receive(ws,data)});
        ws.send(JSON.stringify({type:'biomes',data:Biome.biomeMeta()}));
        ws.send(JSON.stringify({type:'lifeforms',data:Hive.lifeForms}));
        // Let's add the client to the connections array for reference
        Socket.connections.push(ws);
    }

    // Sends data to all connected clients
    static send(data)
    {
        console.log('sending data to socket', data, Socket.connections.length);
        var i;
        for (i = 0; i < Socket.connections.length; i++) {
            Socket.connections[i].send(JSON.stringify(data));
        }
    }

    static receive(ws,data)
    {
        console.log('received: %s', data);
        var json = JSON.parse(data);
        // Get the modded tile info
        /*
        if (json.request === 'tile') {
            console.log('client wants tiles');
            var biome = Biome.getById(json.id);
            if (biome !== undefined) {
                var i;
                for (i = 0; i < biome.updatedTiles.length; i++) {

                    // TODO don't want all the tiles!
                    console.log('send tile data: ', biome.updatedTiles[i]);
                    ws.send(JSON.stringify({type:'tile',data:biome.updatedTiles[i]}));
                }
            } else {
                console.log('the biome is undefined?',json.id, World.biomes);
            }
        }
        */
    }
}

Socket.connections = [];
window['wsConn'] = Socket.connection;