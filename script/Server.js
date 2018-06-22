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
        DB.createCollection("biomes", function(err, res) {
            console.log("biomes Collection created!");
            DB.find('biomes',{},function(err, result) {
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
                    biome.createTiles();
                    // dbo.collection("biomes").insertOne(biome, function(err, res) {
                    DB.insertOne("biomes", biome, function(err, res) {
                        if (err) throw err;
                        // console.log("Added biome 0,0");
                        // console.log(res.insertedId);
                        // console.log('insert rand test: ' + biome.rand.random()*10);
                    });
                }
            });
        });

    }


    static processBiomes(biomes)
    {
        var i;
        for (i = 0; i < biomes.length; i++) {
            var biome = new Biome();
            Utils.populateItem(biome, biomes[i]);
            biome.setRand();
            // console.log('rand test '+biome.rand.random()*10);
            // World.biomes[biome._id] = biome;
            World.biomes.push(biome);
            World.addToGrid(biome);
            biome.createTiles();
            var x,y;
            // Upgrade all the biome's tiles
            for (y=0; y < biome.tiles.length;y++) {
                for (x=0; x < biome.tiles[y].length;x++) {
                    Server.swarmify(biome.tiles[y][x]);
                }
            }

            // Let's get any tile changes from the DB
            DB.find("tiles",{biomeId:biome._id},function(err, result) {
                // console.log('found some tiles in the DB', result);
                for (i = 0; i < result.length; i++) {
                    var b = result[i];
                    console.log('t:',b);
                    Utils.populateItem(World.biomeGrid[b.y][b.x],b);
                }
            });
        }
        Server.loadLifeForms();
    }

    static loadLifeForms()
    {
        DB.createCollection("life", function(err, res) {
            if (err) throw err;
            // console.log("Life Collection created!");

            DB.find("life",{},function (err, result) {
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
            DB.insertOne("life",lifeForm, function(err, res) {
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
        DB.update("life",{_id:lifeForm._id},lifeForm);
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
                // console.log('doing tile update');
                var row = DB.findOne("tiles",{x:this.x,y:this.y},{_id:1});

                if (row) {
                    DB.update("tile",{_id:this._id},this);
                } else {
                    DB.insertOne("tile", this, function(err, res) {
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
