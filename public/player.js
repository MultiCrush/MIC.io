class Player{
  constructor(){
    // this.pos = createVector(random(-landScape, landScape), random(-landScape,landScape));
    this.pos = createVector(0,0);

    this.r = 64;
    this.vel = createVector(0,0);
    this.data = new Food(this.pos.x, this.pos.y, this.r);
    this.name = "";
    this.color = 255;
  }
  show(){
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y,this.r, this.r);
  }
  updateDir(){
    let newvel = createVector(mouseX - width/2, mouseY - height/2);
    newvel.div(45);
    newvel.limit(5);
    this.vel.lerp(newvel, 0.2); 
    this.pos.add(this.vel);
    this.pos.x = constrain(this.pos.x, -landScape + this.r, landScape-this.r);
    this.pos.y = constrain(this.pos.y,-landScape + this.r, landScape-this.r);
    this.data.update(this.pos.x, this.pos.y, this.r, this.name, this.color);
    socket.emit('updatePos', {pos: this.data});
  } 
  eat(b){
    if (b.pos){    
      var d = dist(this.pos,b.pos)*2;
    }
    else{
      var d = dist(this.pos.x, this.pos.y, b.x, b.y)*2;
    }
    if (d < this.r-b.r && floor(this.r) > floor(b.r))
      {return true;}
    return false;
  }
  grow(b){
    let sum = (PI * this.r * this.r) + (PI * b.r * b.r);
    let newR = sqrt(sum/PI);
    this.r = int(newR);
  }
}
