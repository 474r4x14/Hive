
// Create WebSocket connection.
// import Point from "./Point.mjs";
// import LifeForm from "./LifeForm.mjs";

const socket = new WebSocket('ws://swarm.defenestrate.me:8080');


// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

/*
var point = new Point();
var test = point.dist(1,2,3,4);
console.log('test = ' + test);
*/




