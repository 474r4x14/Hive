// import Server from "../Server.js";

import World from "./World";
import Spriteset from "./Spriteset";
import Biome from "./Biome";
import Point from "./utils/Point";

export default class Tile {
    constructor()
    {
        // Real world position
        this.x = 0;
        this.y = 0;

        this.biomeId = 0;
        this.visible = false;
        this.blocked = false;
        this.type = Tile.TYPE_BLANK;
        this.inventory = [];
    }

    isEdge()
    {
        if (
            this.visible &&
            (
                (
                    World.tiles[this.y-1] !== undefined &&
                    !World.tiles[this.y-1][this.x].visible
                ) ||
                (
                    World.tiles[this.y+1] !== undefined &&
                    !World.tiles[this.y+1][this.x].visible
                ) ||
                (
                    World.tiles[this.y][this.x-1] !== undefined &&
                    !World.tiles[this.y][this.x-1].visible
                ) ||
                (
                    World.tiles[this.y][this.x+1] !== undefined &&
                    !World.tiles[this.y][this.x+1].visible
                )
            )
        ) {
            return true;
        }
        return false;
    }

    isNextTo(x,y)
    {
        if (
            (y === this.y && (x-1 === this.x || x+1 === this.x)) ||
            (x === this.x && (y-1 === this.y || y+1 === this.y))
        ) {
            return true;
        }
        return false;
    }

    draw(context) {
        // console.log('drawing tile');
        let spriteSize = 32;

        let spriteX = 1%4;
        // let spriteY = ((0-spriteX)/4);
        let spriteY = 0;
        context.drawImage(Spriteset.img, (spriteX)*spriteSize,(spriteY)*spriteSize,spriteSize,spriteSize, this.x*Tile.SIZE, this.y*Tile.SIZE, Tile.SIZE, Tile.SIZE);
        if (this.type !== Tile.TYPE_BLANK) {
            spriteX = 2%4;
            if (this.inventory.length > 0) {
                spriteX = 3%4;
            }
            context.drawImage(Spriteset.img, (spriteX)*spriteSize,(spriteY)*spriteSize,spriteSize,spriteSize, this.x*Tile.SIZE, this.y*Tile.SIZE, Tile.SIZE, Tile.SIZE);
        }

        if (!this.visible) {
            spriteX = 0%4;
            context.drawImage(Spriteset.img, (spriteX)*spriteSize,(spriteY)*spriteSize,spriteSize,spriteSize, this.x*Tile.SIZE, this.y*Tile.SIZE, Tile.SIZE, Tile.SIZE);
        }
    }

    static getBiomeFromCoords(x,y)
    {
        var bx,by,modX,modY;
        modX = x%Biome.size;
        modY = y%Biome.size;
        bx = (x-modX)/Biome.size;
        by = (y-modY)/Biome.size;
        return new Point(bx,by);
    }

    update(){}


}
Tile.SIZE = 32;
Tile.TYPE_BLANK = 0;
// Trees
// TODO we need to restock the fruit after x amount of time
Tile.TYPE_APPLE_TREE = 1;
Tile.TYPE_OAK_TREE = 2;
