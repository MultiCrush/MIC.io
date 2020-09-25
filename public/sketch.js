var pl = null;
var clients;
var zoom = 1;
var fillR = 1;
var dead = false
var socket;
var down = false;
var food = [];
var foods = 10000;
var landScape = 1920*4;
var NameInput;
var button;
var killer;
var killerC;
var rStart;
var Rslider;
var Gslider;
var Bslider;
var start = false;
var colors = {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pl = new Player();
  rStart = 
  NameInput = createInput();
  NameInput.size(250, 30);

  NameInput.position((width/2) - (NameInput.width/2), (height/2))
  NameInput.value('');

  button = createButton('PLAY')
  button.size(100, 30);
  button.position(NameInput.x + NameInput.width/2 - button.width/2, NameInput.y + 60);

  button.mousePressed(play);

  Rslider = createSlider(0,225, 255);
  Rslider.position(button.x + button.width/2 - Rslider.width/2, button.y + 60);

  Gslider = createSlider(0,225, 255);
  Gslider.position(Rslider.x + Rslider.width/2 - Gslider.width/2, Rslider.y + 40);  

  Bslider = createSlider(0,225, 255);
  Bslider.position(Gslider.x + Gslider.width/2 - Bslider.width/2, Gslider.y + 40);

  for (var i = 0; i < foods; i++)
    food.push(new Food(random(-landScape, landScape), random(-landScape,landScape)));

  
  socket = io.connect('http://localhost:3000');

  socket.emit('FoodFullUpdate', {food: food})
  socket.on('update', updateOthers);
  socket.on('FoodFullUpdate', function(data){
    var temp = data.food;
    for(var i = 0; i<foods; i++)
    {
      let newF = temp[i];
      food[i] = new Food(newF.x,newF.y,newF.r,'', newF.color);
    }
  });
  socket.on('updateFood', function(data){
    console.log(data);
    var i = data.index;
    var newF = data.newFood;
    food[i] = new Food(newF.x,newF.y,newF.r, '',newF.color);
  });

  socket.on('GameOver', function(data){
    dead = true;
    killer = data.winner;
    killerC = data.color;
      
    button = createButton('PLAY AGAIN')
    button.size(100, 30);
    button.position(width/2 - button.width/2, height/2 + 60);
    button.mousePressed(end);

  });
}
function play(){
  pl.name = NameInput.value();
  let col = color(Rslider.value(), Gslider.value(), Bslider.value(), 255);
  pl.color = col;


  NameInput.remove();
  button.remove();
  Rslider.remove();
  Gslider.remove();
  Bslider.remove();
  start = true;
}


function draw() {
  background(100);

  translate(width/2, height/2);

  if (!dead){
    if (pl.r > width/3){
      var newzoom = (width/2) / pl.r;
      zoom = lerp(zoom, newzoom, 0.1)
      scale(zoom);
    }
    translate(-pl.pos.x, -pl.pos.y);
    for (let i = 0; i< foods; i++)
    {    
      if (food[i]){
        food[i].show(255,255,255)    
        if (pl.eat(food[i])){
          pl.grow(food[i]);
          food[i] = new Food(random(-landScape, landScape), random(-landScape,landScape));
          var data = {index: i, newFood: food[i]};
          socket.emit("Food", data);
        }
      }
    }
    for (var id in clients){
      if (id != socket.id){
        var p = new Food(clients[id].x,clients[id].y,clients[id].r, clients[id].name, clients[id].color);
        p.show();

        if (pl.eat(p)){
          pl.grow(p);
          socket.emit("EatenPlayer", {id: id, winner: pl.name, color:pl.color});

        }
      }
    }
    if (start){
      pl.show();
      pl.updateDir();
    }
    else{
      col = color(Rslider.value(), Gslider.value(), Bslider.value(), 255);
      button.style('background-color', col);

    }
  }
  else{
    translate(-pl.pos.x, -pl.pos.y);

    fill(killerC.levels)

    fillR = lerp(fillR, width*1.5, 0.075);

    ellipse(pl.pos.x,pl.pos.y, fillR, fillR);
    fill(255,255,255);
    textAlign(CENTER, CENTER);
    textSize(30);
    text("You Were Eaten By " + killer,pl.pos.x,pl.pos.y-30);
  }

}


function updateOthers(data){
  clients = data.clients;

}

function end(){
  location.reload()
}
