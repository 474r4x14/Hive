import Tile from "./Tile";
import SeededRand from "./SeededRand";
import World from "./World";
import Item from "./Item";

export default class Biome {
    constructor(x=null,y=null, seed = null)
    {
        this._id = undefined;
        this.seed = seed;
        this.heat = null;
        this.moisure = null;
        this.x = x;
        this.y = y;
        this.tiles = [];
        if (seed !== null) {
            this.setRand();
        }
    }


    setRand()
    {
        this.rand = new SeededRand(this.seed);
    }

    type()
    {
        if (this.heat < 15) {
            return Biome.TYPE_POLAR;
        } else if (this.heat < 30) {
            return Biome.TYPE_TUNDRA;
        } else if (this.heat < 45) {
            return Biome.TYPE_BOREAL_FOREST;
        } else if (this.heat < 65) {
            if (this.moisure < 33.33) {
                return Biome.TYPE_COLD_DESERT;
            } else if (this.moisure < 66.66) {
                return Biome.TYPE_PRAIRIE;
            } else {
                return Biome.TYPE_FOREST;
            }
        } else {
            if (this.moisure < 20) {
                return Biome.TYPE_WARM_DESERT;
            } else if (this.moisure < 40) {
                return Biome.TYPE_TROPICAL_GRASSLAND;
            } else if (this.moisure < 60) {
                return Biome.TYPE_SAVANNA;
            } else if (this.moisure < 80) {
                return Biome.TYPE_TROPICAL_FOREST;
            } else {
                return Biome.TYPE_RAINFOREST;
            }
        }
    }

    createTiles()
    {
        var y,x;
        for (y=0; y < Biome.size; y++) {
            for (x=0; x < Biome.size; x++) {
                var tile = new Tile();
                //Server.swarmify(tile);
                tile.biomeId = this._id;
                tile.x = (this.x * Biome.size) + x;
                tile.y = (this.y * Biome.size) + y;

                var treeProbability = ((100 - ((this.heat + this.moisure)/2))/10)+1;
                var rand = Math.floor(this.rand.random()*treeProbability);

                if (rand === 0) {
                    tile.blocked = true;
                    switch (Math.floor(this.rand.random()*3)) {
                        case 0:
                        tile.type = Tile.TYPE_APPLE_TREE;
                        var quantity = Math.floor(this.rand.random()*6);
                        if (quantity > 0) {
                            var item = new Item(Item.TYPE_APPLE,);
                            console.log('adding an apple');
                            tile.inventory.push(item);
                        }
                        default:
                        tile.type = Tile.TYPE_OAK_TREE;
                    }
                }

                // console.log('creating tile x',tile.x,'y',tile.y);

                if (this.tiles[y] === undefined) {
                    this.tiles[y] = [];
                }
                this.tiles[y][x] = tile;

                if (World.tiles[tile.y] === undefined) {
                    World.tiles[tile.y] = [];
                }
                World.tiles[tile.y][tile.x] = tile;
                World.unexploredTiles.push(tile);
            }
        }
    }
}
Biome.TYPE_POLAR = 1;
Biome.TYPE_TUNDRA = 2;
Biome.TYPE_BOREAL_FOREST = 3;
Biome.TYPE_COLD_DESERT = 4;
Biome.TYPE_PRAIRIE = 5;
Biome.TYPE_FOREST = 6;
Biome.TYPE_WARM_DESERT = 7;
Biome.TYPE_TROPICAL_GRASSLAND = 8;
Biome.TYPE_SAVANNA = 9;
Biome.TYPE_TROPICAL_FOREST = 10;
Biome.TYPE_RAINFOREST = 10;
Biome.size = 20;
