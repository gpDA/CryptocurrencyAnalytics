var sita=Math.random(0,Math.PI);
var x=0
var y=0
var r=10
var time=0;
var time_up=true;
var rectys=[];
var direction=[]
var logo_width=400
var logo_height=200
var amp=logo_height*0.25;
var canvas;
var title;
var price_color;
var price_alpha=1;


var loc=[];
var vol=[];
var size=[];
var shape=[];
var rot=[];
var randa=[];
var colors=[];
var icon_colors=[[0,137,108],[208,16,76],[46,169,223]];

function set_icon(num){
  loc=[];
  vol=[];
  size=[];
  shape=[];
  colors=[];
  rot=[];
  randa=[];  
  for (i=0;i<num;i++){
    ran=floor(random(icon_colors.length));
    colors.push(ran);
    shape.push(round(random(0,1)));
    loc.push( createVector(random(width),random(height)));
    vol.push( createVector(random(-3,3),random(-3,3)));
    size.push(random(width/num/2,width/num*3));
    rot.push(random(0,3));
    randa.push(random(0.6,1.2));
  }
  

}
function draw_icon(num){
  
 
  for (i=0;i<num;i++){
    noStroke();
    fill(icon_colors[colors[i]][0],icon_colors[colors[i]][1],icon_colors[colors[i]][2]);
    if(shape[i]==0){
    ellipse(loc[i].x,loc[i].y,size[i]*randa[i]);
    }else{
    push();
    rectMode(CENTER);
    translate(loc[i].x,loc[i].y);
    rotate(rot[i]);
    rect(0,0,size[i],size[i]*0.6*randa[i]);
    pop();
    }
  

  }
}


// function mousePressed(){
//   console.log(234);
//   set_icon(round(random(10,20)));
// }

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  windowWidth0=windowWidth;
  set_icon(round(random(10,20)));

}



function setup() {
  
  canvas=createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index:-1');
  windowWidth0=windowWidth;
  set_icon(round(random(10,20)));
  logo = createGraphics(windowWidth0, windowHeight*0.2);
  logo.rectMode(CENTER);
  yi_target=[];
  logo.background(250);
  logo.push();
  logo.translate(0,logo_height/2);
  logo.fill(0);
  for (i=0;i<=20;i++){
    yi=sin(sita)*amp;
    yi_target.push(yi);
    sita+=PI/4;
  }
  logo.pop();
  for (i=0;i<=10;i++){
    rectys.push(random(-amp/2,amp/2));
    if(random(1)>0.5){
      direction.push(1);
    }else{
      direction.push(-1);
    }
  }
}
time_change0=0.02

function mousePressed(){
  set_icon(round(random(10,20))); 


}

function draw(){


  // $(".group").css({
  //       no-box-sizing;
  //       });
  // logo_width=width*0.4;
  // logo_height=logo_width/2;
  frameRate(16);
  //background(220);
  background(240);
  draw_icon(10);
  for (i=0;i<loc.length;i++){
  loc[i].add(vol[i]);
  vol[i].x*random(0.8,1.2);
  vol[i].y*random(0.8,1.2);
    
  }
  
  fill(250);
  push();
  noStroke();
  rect(0,0,width,height*0.15);
  strokeWeight(3);
  stroke(220);
  line(0,height*0.15,width,height*0.15);
  image(logo,width*0.35,-height*0.05);
  time_change=time_change0*map(abs(time),0,1,1,0.5);
  if(time_up){
    time+=time_change;
    if(time>=1){
 time_up=!time_up
    }
    
  }
  else{
    time-=time_change;
    if(time<=-1){
 time_up=!time_up
    }
  }
  
  logo.background(250);
  logo.push();
  logo.translate(0,logo_height/2);
  logo.fill(0);
  
  //rect part
  for (i=0;i<=10;i++){
    yi=sin(sita)*amp;
    logo.fill(0);
    logo.noStroke();
    vrectys=0.5;
    rectys[i]+=vrectys*direction[i];
    if(abs(rectys[i])>=amp/2*random(0.9,1)){
      direction[i]*=-1; 
    }
    if(rectys[i]<0){
    logo.fill(0,137,108);
    }else{
    logo.fill(208,16,76);}
    logo.rect((logo_width-2*r)/10*i+r,rectys[i],2*r,rectys[i]*2);
    sita+=PI/4;
  }
  
  
  //circle part
  for (i=0;i<=10;i++){
    logo.noStroke();
    yi=sin(sita)*amp;
    logo.fill(46,169,223);
    logo.ellipse((logo_width-2*r)/10*i+r,yi_target[i]*time,r);
    sita+=PI/4;
  }
  logo.pop();

  //price change visualization
  price_alpha=0;
  if(selected_change_of_price>1){
  price_alpha=map(selected_change_of_price,1,1.1,30,150);
  fill(0,137,108,price_alpha);
  }else if(selected_change_of_price==1){
  fill(220);
  }else{
  price_alpha=map(selected_change_of_price,1,0.9,30,100);
  fill(208,16,76,price_alpha);
  }
  noStroke();
  //rect(0,height*0.15,width,height*0.85);
  //ellipse(width*0.2,height*0.2,width*0.1);


  fill(0);
  textFont('Lato');
  textAlign(LEFT);
  stroke(1);
  textSize(40);
  // text(selected_change_of_price.toFixed(2),width*0.15,height*0.95);
  // text(avg_senti.toFixed(2),width*0.25,height*0.95);
  // text(recent_senti.toFixed(2),width*0.35,height*0.95);
  // text(selected_senti.toFixed(2),width*0.45,height*0.95);



}

