// import Server from "../Server.js";

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


    update(){}


}
Tile.SIZE = 32;
Tile.TYPE_BLANK = 0;
// Trees
Tile.TYPE_APPLE_TREE = 1;
Tile.TYPE_OAK_TREE = 2;
