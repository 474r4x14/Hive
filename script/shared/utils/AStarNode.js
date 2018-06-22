import Point from "./Point";

export default class AStarNode {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.pos = new Point(x,y);
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.cost = 1;
        this.visited = false;
        this.closed = false;
        this.parent = null;
        this.blocked = false;
    }

    isBlocked()
    {
        return this.blocked;
    }
}