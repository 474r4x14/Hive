import World from "./World";
import Hive from "./Hive";
import Tile from "./Tile";
import Biome from "./Biome";
import Utils from "./Utils";
import Item from "./Item";
import AStar from "./utils/AStar";

export default class LifeForm {
    constructor()
    {
        this._id = null;
        this.x = Math.floor(Biome.size/2);
        this.y = Math.floor(Biome.size/2);
        this.pixelX = this.x*Tile.SIZE;
        this.pixelY = this.y*Tile.SIZE;
        this.health = 100;
        this.hunger = 100;
        this.action = LifeForm.ACTION_IDLE;
        this.sightDistance = 100;
        this.destination = undefined;
        this.path = [];
        console.log('lifeform?');

    }

    animate()
    {
        if (this.destination !== undefined) {
            // console.log('go to dest: ',this.pixelX,this.pixelY, '|',this.destination.x*Tile.SIZE,this.destination.y*Tile.SIZE);
        }
    }

    static spawn()
    {
        console.log('spawning!');
        var lifeForm;
        lifeForm = new LifeForm();
        lifeForm._id = Hive.lifeForms.length;
        // Swarm.upgrade(lifeForm);
        lifeForm.notifySwarm();
        return lifeForm;
    }

    setTask(){}
    startTask(){}
    notifySwarm(){console.log('no swarm here');}


    static swarmify(lifeform)
    {
        lifeform.setTask = function(action){
            console.log('swarm set task!');
            this.action = action;
        };
        lifeform.notifySwarm = function(){console.log('oh hai! swarm here');}


        lifeform.startTask = function()
        {
            console.log('lifeform start action');
            if (this.action === LifeForm.ACTION_GATHER_FOOD) {
                // if can see food
                if (!this.checkLocalArea()) {

                // else if any known food
                    var i, dist = null, result = null;
                    for (i = 0; i < Hive.known.items.length; i++) {
                        if (Hive.known.items[i].type === Item.TYPE_APPLE) {
                            var tileDist = Utils.dist(this.x,this.y,Hive.known.items[i].x,Hive.known.items[i].y);
                            if (dist === null || dist > tileDist) {
                                dist = tileDist;
                                result = Hive.known.items[i];
                            }
                        }
                    }
                    // There's some known about food, let's just go there
                    if (result !== null) {
                        this.destination = result;
                    } else {
                        // There's no known food, let's explore!
                        var closest = null, dist = null;
                        for (i=0; i < World.unexploredTiles.length; i++) {
                            var tileDist = Utils.dist(this.x,this.y,World.unexploredTiles[i].x,World.unexploredTiles[i].y);
                            if (dist === null || dist > tileDist) {
                                dist = tileDist;
                                closest = World.unexploredTiles[i];
                            }
                        }
                        this.destination = closest;
                    }
                }
                if (this.destination !== null) {
                    console.log('got a destination, start pathfinding');
                    /*
                    var astar = new AStar(World.tiles[0].length,World.tiles.length);
                    var x,y;
                    for (y = 0; y < World.tiles.length;y++) {
                        for (x = 0; x < World.tiles[y].length;x++) {
                            if (World.tiles[y][x].blocked === true) {
                                //astar.block(x,y);
                            }
                        }
                    }
                    */


                    console.log('lets astar.search this!');

                    var astar = new AStar();

                    // console.log(astar.);

                    /*
                    for (var a = 0; a < astar.grid.length; a++) {
                        var output = '';
                        for (var b = 0; b < astar.grid[a].length; b++) {
                            if (astar.grid[a][b].isWall) {
                                output += '1';
                            } else {
                                output += '0';
                            }
                        }
                        console.log('row: ',output);
                    }
                    */
                    //var test = astar.search(this.x,this.y,this.destination.x,this.destination.y);
                    // console.log(test);
                }

                console.log('got dest',this.destination);
            }
        }

        lifeform.checkLocalArea = function()
        {
            console.log('checking the local area');
            // console.log(World.tiles);
            var x,y;
            var maxTileDist = Math.ceil(this.sightDistance/Tile.SIZE);
            // console.log('y',this.y-maxTileDist,'->',this.y+maxTileDist);
            // console.log('x',this.x-maxTileDist,'->',this.x+maxTileDist);
            var dist = null;
            var result = null;
            for (y = this.y-maxTileDist; y < this.y+maxTileDist; y++) {
                for (x = this.x-maxTileDist; x < this.x+maxTileDist; x++) {
                    // console.log('testing tile',x,y);
                    if (World.tiles[y] !== undefined && World.tiles[y][x] !== undefined) {
                        // console.log('tiles is defined');
                        if (!World.tiles[y][x].visible) {
                            World.tiles[y][x].visible = true;
                            // remove the tile from the unexplored array
                            var i;
                            for (i=0; i < World.unexploredTiles.length; i++) {
                                if (World.unexploredTiles[i] === World.tiles[y][x]) {
                                    World.unexploredTiles.splice(i,1);
                                    break;
                                }
                            }
                            World.tiles[y][x].update();
                        }
                        // console.log('tile type:', World.tiles[y][x].type, 'inventory: ',World.tiles[y][x].inventory);
                        if (
                            World.tiles[y][x].type === Tile.TYPE_APPLE_TREE &&
                            World.tiles[y][x].inventory.length > 0
                        ) {
                            // console.log('we found an apple tree!!!');
                            var tileDist = Utils.dist(this.x,this.y,World.tiles[y][x].x,World.tiles[y][x].y);
                            if (dist === null || dist > tileDist) {
                                dist = tileDist;
                                result = World.tiles[y][x];
                            }

                        }
                        // console.log('checking tile',World.tiles[y][x]);
                    } else {
                        console.log('tile is undefined?');
                    }
                }
            }
            if (result !== null) {
                console.log('got a result =)');
                this.destination = result;
                return true;
            } else {
                console.log('there were no apples in sight');
            }
            return false;
        }


    }
}
LifeForm.ACTION_IDLE = 0;
LifeForm.ACTION_GATHER_FOOD = 1;