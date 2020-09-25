var express = require('express');
var app = express();
var server = app.listen("https://mic-io.vercel.app/");
var compression = require('compression');
var helmet = require('helmet');

app.use(compression());
app.use(helmet());

console.log('The Server is Running');
console.log('Listening on http://localhost:3000');
var landScape = 1920*4;

var food = []


app.use(express.static('public'));
var socket = require('socket.io');

var io = socket(server);
var SharedData = {}; 


io.sockets.on('connection', newConnection);

function newConnection(socket){
    socket.on("Food", function(data){
        io.sockets.emit('updateFood', data);
    });
    socket.on('FoodFullUpdate', function(data){
        if (food.length == 0)
        {
            food = data.food;
        }
        socket.emit('FoodFullUpdate', {food: food});
    });
    socket.on('updatePos', function(data){
        var id = socket.id;
        SharedData[id] = data.pos;
        socket.broadcast.emit('update', {clients:SharedData});
    });
    socket.on('EatenPlayer', function(data){
        var id = data.id;
        delete SharedData[id];
        io.sockets.emit('update', {clients:SharedData});
        io.to(id).emit('GameOver', {winner:data.winner, color: data.color})
    });
    socket.on('disconnect', function(){
        delete SharedData[socket.id];
        io.sockets.emit('update', {clients:SharedData});
        });
    console.log("New Client: " + socket.id);

}

class Food{
    constructor(x,y){
      this.x = x;
      this.y = y;
      this.r = getRndInteger(16, 90);
      this.color = 255;
      
    }
    show(){
      stroke(1);
      ellipse(this.x, this.y,this.r, this.r);
    }
}
  
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
