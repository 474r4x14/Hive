import World from "./shared/World";
import Utils from "./shared/Utils";
import Biome from "./shared/Biome";
import Tile from "./shared/Tile";
import Hive from "./shared/Hive";
import LifeForm from "./shared/LifeForm";
import DB from "./shared/DB";


export default class Server {
    static startDB(dbMap)
    {
        DB.createCollection = dbMap['createCollection'];
        DB.find = dbMap['find'];
        DB.findOne = dbMap['findOne'];
        DB.insertOne = dbMap['insertOne'];
        DB.update = dbMap['update'];
        Server.loadBiomes();
    }


    static loadBiomes()
    {

        console.log('loading the biomes');
        DB.createCollection(DB.COLLECTION_BIOMES, function(err, res) {
            console.log("biomes Collection created!");
            DB.find(DB.COLLECTION_BIOMES,{},function(err, result) {
                if (err) throw err;
                // Do any biomes exist?
                if (result.length > 0) {
                    // Let's populate the arrays
                    Server.processBiomes(result);

                } else {
                    // No biomes exist, let's create a starting point at 0,0
                    // console.log('there are no biomes!');
                    var biome = World.addBiome(0,0);
                    console.log('got a biome?',biome);
                    biome._id = undefined;
                    // dbo.collection("biomes").insertOne(biome, function(err, res) {
                    DB.insertOne(DB.COLLECTION_BIOMES, biome, function(err, res) {
                        if (err) throw err;
                        console.log("Added biome 0,0");
                        console.log(res.insertedId);
                        biome._id = res.insertedId;
                        // console.log('insert rand test: ' + biome.rand.random()*10);
                        biome.createTiles();
                    });
                }
            });
        });

    }


    static processBiomes(biomes)
    {
        var i;
        for (i = 0; i < biomes.length; i++) {
            var biome = Biome.populateFromData(biomes[i]);
            var x,y;
            // Upgrade all the biome's tiles
            for (y=0; y < biome.tiles.length;y++) {
                for (x=0; x < biome.tiles[y].length;x++) {
                    Server.swarmify(biome.tiles[y][x]);
                }
            }

            // Let's get any tile changes from the DB
            DB.find(DB.COLLECTION_TILES,{biomeId:biome._id},function(err, result) {
                // console.log('found some tiles in the DB', result);
                for (i = 0; i < result.length; i++) {
                    var b = result[i];
                    // console.log('t:',b);
                    Utils.populateItem(World.tiles[b.y][b.x],b);
                    biome.updatedTiles.push(b);
                }
            });
        }
        World.populateEdges();
        Server.loadLifeForms();
    }

    static loadLifeForms()
    {
        DB.createCollection(DB.COLLECTION_LIFE, function(err, res) {
            if (err) throw err;
            // console.log("Life Collection created!");

            DB.find(DB.COLLECTION_LIFE,{},function (err, result) {
                if (err) throw err;
                console.log(result);
                Server.processLifeForms(result);
            });
        });
    }


    static processLifeForms(lifeForms)
    {
        if (lifeForms.length > 0) {
            console.log('got '+lifeForms.length+' lifeforms');
            console.log(lifeForms);
            var i;
            for (i = 0; i < lifeForms.length; i++) {
                // console.log('got a LF from DB | ',i,lifeForms.length);
                // Got a lifeform from the DB
                var lifeForm = new LifeForm();
                Utils.populateItem(lifeForm, lifeForms[i]);
                // lifeForms.push(lifeForm);
                Hive.upgrade(lifeForm);
                lifeForm.startTask();
                lifeForm.notifySwarm();
                // LifeForm.spawnify(lifeForm);
                Hive.lifeForms.push(lifeForm);
            }
        } else {
            // console.log('no DB LF, gen one');
            var lifeForm = LifeForm.spawn();
            Hive.upgrade(lifeForm);
            lifeForm.startTask();
            // lifeForms.push(lifeForm);
            Hive.lifeForms.push(lifeForm);
            DB.insertOne(DB.COLLECTION_LIFE,lifeForm, function(err, res) {
                if (err) throw err;
            });
        }
        var idle = Hive.findIdle();
        if (idle !== null) {
            console.log('found an idle, lets task him up!', idle);
            idle.setTask(LifeForm.ACTION_GATHER_FOOD);
            idle.startTask();
            Server.saveLifeForm(idle);
        }
        // We've pretty much set up everything, let's start the simulation
        Server.tick();
    }
    static saveLifeForm(lifeForm)
    {
        DB.update(DB.COLLECTION_LIFE,{_id:lifeForm._id},lifeForm);
    }


    static tick()
    {
        var i;
        for (i =0; i < Hive.lifeForms.length; i++) {
            Hive.lifeForms[i].animate();
        }
        setTimeout(Server.tick,1000/60);
    }

    static swarmify(item)
    {
        if (item instanceof Tile) {

            item.update = function()
            {
                console.log('doing tile update');
                var row = DB.findOne(DB.COLLECTION_TILES,{x:this.x,y:this.y},{_id:1});
                console.log('got row:',row);
                if (row !== null && row !== undefined) {
                    console.log('tile exists, updating');
                    DB.update(DB.COLLECTION_TILES,{_id:this._id},this);
                } else {
                    console.log('tile doesnt exist, inserting');
                    DB.insertOne(DB.COLLECTION_TILES, this, function(err, res) {
                        if (err) throw err;
                        // console.log("Added tile ",this.x,this.y);
                        // console.log(res.insertedId);
                        // console.log('insert rand test: ' + biome.rand.random()*10);
                    });

                }

            }
        }
    }




}
// Server.DB;
// Server.socket;
window['start'] = Server.startDB;
// window['Server'] = Server;
