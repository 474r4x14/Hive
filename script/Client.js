
// Create WebSocket connection.
// import Point from "./Point.mjs";
// import LifeForm from "./LifeForm.mjs";

import Biome from "./shared/Biome";
import Spriteset from './shared/Spriteset';
import World from "./shared/World";

const socket = new WebSocket('ws://72.11.130.113:8080');


// Connection opened
socket.addEventListener('open', function (event) {
    // socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    var data = JSON.parse(event.data);
    if (data.type === 'biomes') {
        var i;
        for (i = 0; i < data.data.length; i++) {
            var biome = Biome.populateFromData(data.data[i]);
            World.biomes.push(biome);
        }
    } else {
        console.log('unknown type ',data.type);
    }
});

let canvas;
window.onload = function(e) {
    console.log('window loaded');
    canvas = document.getElementById("hive");
    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight; //document.height is obsolete
    var spriteset = new Spriteset(spriteLoaded);
};
var ctx;
function spriteLoaded()
{
    console.log('spriteloaded');
    ctx = canvas.getContext("2d");
    requestAnimationFrame(redraw);
}

function redraw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var i;
    for (i = 0; i < World.biomes.length; i++) {
        World.biomes[i].draw(ctx);
    }
    requestAnimationFrame(redraw);
}

