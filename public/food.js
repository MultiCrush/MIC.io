class Food{
  constructor(x,y, r, name, col){
    this.x = x;
    this.y = y;
    if (r){
      this.r = r;
    }
    else{
      this.r = 29;
    }
    if (name){
      this.name = name;
    }
    else{
      this.name = '';
    }
    if (col){
      this.color = col;
    }
    else{
      
      this.color = color(random(255), random(255), random(255));
    }
  }
  toShow(){
    if (abs(pl.pos.x - this.x) < width + this.r)
    { if (abs(pl.pos.y - this.y) < height + this.r){return true}}
    return false;
  }
  show(){
    if (this.toShow()){      
      fill(this.color.levels);

      stroke(1);
      ellipse(this.x, this.y,this.r, this.r);
      textAlign(CENTER, CENTER);
      textSize((this.r/64)*22);
      fill(0,0,0);
      text(this.name, this.x, this.y);
    }
  }
  update(x, y, r, name, color){
    this.x = x;
    this.y = y;
    this.r = r;
    this.name = name;
    this.color = color;
  }
}
