import Biome from "./Biome";

export default class World {

    static addBiome(x,y)
    {

        var difference = 50;
        var neighbours = 0;
        var heat = 0;
        var moisture = 0;
        var biome = new Biome(x,y, Math.floor(Math.random()*99999999));
        // biome.rand = new SeededRand(biome.seed);
        // biome._id = World.biomes.length;
        if (x === 0 && y === 0) {
            biome.heat = 50;
            biome.moisure = 75;
        } else {
            var ny, nx;
            for (ny = y-1; ny <= y+1; ny++) {
                for (nx = x-1; nx <= x+1; nx++) {
                    if (
                        this.biomes[ny] !== undefined &&
                        this.biomes[ny][nx] !== undefined
                    ) {
                        neighbours ++;
                        heat += this.biomes[ny][nx].heat;
                        moisture += this.biomes[ny][nx].moisure;
                    }
                }
            }
            heat /= neighbours;
            moisture /= neighbours;
            var rand;
            rand = (Math.random()*difference)-(difference/2);
            heat += rand;
            if (heat > 100) {
                heat = 100;
            } else if (heat < 0) {
                heat = 0;
            }
            rand = (Math.random()*difference)-(difference/2);
            moisture += rand;
            if (moisture > 100) {
                moisture = 100;
            } else if (moisture < 0) {
                moisture = 0;
            }
            biome.heat = heat;
            biome.moisure = moisture;
        }
        World.addToGrid(biome);
        World.biomes.push(biome);
        return biome;

    }

    static addToGrid(biome)
    {

        if (World.biomeGrid[biome.y] === undefined) {
            World.biomeGrid[biome.y] = [];
        }

        World.biomeGrid[biome.y][biome.x] = biome;

    }

    static checkEdges()
    {
        var i;
        for (i = World.edgeTiles.length-1; i > 0; i--) {
            if (!World.edgeTiles[i].isEdge()) {
                World.edgeTiles.splice(i,1);
            }
        }
    }
}
World.lifeForms = [];
World.biomes = [];
World.biomeGrid = [];
World.tiles = [];
World.unexploredTiles = [];
// Tiles next to unexplored areas
World.edgeTiles = [];