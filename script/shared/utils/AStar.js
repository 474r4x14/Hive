/**
 * Taken from https://briangrinstead.com/blog/astar-search-algorithm-in-javascript/
 */
import BinaryHeap from './BinaryHeap';
import Point from "./Point";
export default class AStar
{
    constructor(grid)
    {
        this.grid = grid;
    }

    init() {
        for(var y = 0, yl = this.grid.length; y < yl; y++) {
            for(var x = 0, xl = this.grid[y].length; x < xl; x++) {
                var node = this.grid[y][x];
                node.f = 0;
                node.g = 0;
                node.h = 0;
                node.cost = 1;
                node.visited = false;
                node.closed = false;
                node.parent = null;
            }
        }
    }
    heap() {
        return new BinaryHeap(function(node) {
            return node.f;
        });
    }
    search(start, end, diagonal, heuristic) {
        this.init();
        heuristic = heuristic || this.manhattan;
        diagonal = !!diagonal;

        var openHeap = this.heap();

        openHeap.push(start);


        while(openHeap.size() > 0) {
            console.log('openHeap is > 0');

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path.
            if(currentNode === end) {
                var curr = currentNode;
                var ret = [];
                while(curr.parent) {
                    var point = new Point(curr.x,curr.y);
                    // ret.push(curr);
                    ret.push(point);
                    curr = curr.parent;
                }
                console.log('return # 1');
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // console.log('current node: ',currentNode);
            
            // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
            var neighbors = this.neighbors(currentNode, diagonal);
            // console.log('got neighbours',neighbors);
            for(var i=0, il = neighbors.length; i < il; i++) {
                var neighbor = neighbors[i];

                if(neighbor.closed || neighbor.isBlocked()) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                var gScore = currentNode.g + neighbor.cost;
                var beenVisited = neighbor.visited;

                if(!beenVisited || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        // No result was found - empty array signifies failure to find path.
        console.log('return # 2');
        return [];
    }
    manhattan(pos0, pos1) {
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

        var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        return d1 + d2;
    }
    neighbors(node, diagonals) {
        var ret = [];
        var x = node.x;
        var y = node.y;

        // West
        if(this.grid[y][x-1] ) {
            ret.push(this.grid[y][x-1]);
        }

        // East
        if(this.grid[y][x+1] ) {
            ret.push(this.grid[y][x+1]);
        }

        // South
        if(this.grid[y-1] && this.grid[y-1][x]) {
            ret.push(this.grid[y-1][x]);
        }

        // North
        if(this.grid[y+1] && this.grid[y+1][x]) {
            ret.push(this.grid[y+1][x]);
        }

        if (diagonals) {

            // Southwest
            if(this.grid[y-1] && this.grid[y-1][x-1]) {
                ret.push(this.grid[y-1][x-1]);
            }

            // Southeast
            if(this.grid[y-1] && this.grid[y-1][x+1]) {
                ret.push(this.grid[y-1][x+1]);
            }

            // Northwest
            if(this.grid[y+1] && this.grid[y+1][x-1]) {
                ret.push(this.grid[y+1][x-1]);
            }

            // Northeast
            if(this.grid[y+1] && this.grid[y+1][x+1]) {
                ret.push(this.grid[y+1][x+1]);
            }

        }

        return ret;
    }
};