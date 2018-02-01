var canvasXsize = window.innerWidth;
var canvasYsize = window.innerHeight;

var balloonSize = 80;

var balloons = [];
var myCount = 0;
var myClouds = -100;
var tightness = 20;

var r;
var g;
var b;

var sound;
var balloonMusic;

var score = 0;
var newData = 0;

var me;
var challenger = "waiting...";

var winner = 30;

var socket = io.connect('http://165.227.192.162:9000/'); // Declare the socket
var data = 0;
var name_data = null;

var currentStatus = "start";

function preload(){
    sound = loadSound("pop.mp3");
}


function setup() {
	createCanvas(canvasXsize, canvasYsize);
  balloonMusic = document.getElementById("balloonMusic");
  winSong = document.getElementById("win");
  // me = createInput('Type you name here');
}

// Connect the socket
socket.on('connect', function() {
    console.log("Connected");
});

// Receive from other
socket.on('gotScore', function(data) {
  //alert("got a new score");
  console.log("Got a new score for them of: "+data);
  newData = data;
  them(challenger, newData);

});

// Receive from other
socket.on('gotName', function(name_data) {
  //alert("got a new score");
  challenger = name_data;
  them(challenger, newData);

});

// Send the score to other
var sendScore = function(score) {
   console.log("sending score: "+ score);
   socket.emit('score', score);
};

var sendName = function(me){
  socket.emit('name', me);
}

function changeStatus(){
  alert("Clicked");
}

function draw(){
  if (currentStatus == "start"){
    intro();
  } else if (currentStatus == "game"){
    playGame();
  } else if (currentStatus == "winOne"){
    winPerson(me);
  } else if (currentStatus == "winTwo"){
    winPerson(challenger);
  }
}//Close draw

function intro(){
  textFont('Life Savers');
  background(120, 220, 255);
  if (myClouds > canvasXsize+300){
    myClouds = -500;
    cloud(myClouds-100, 300, 50);
    cloud(myClouds, 500, 80);
    cloud(myClouds,-500, 280);
    cloud(myClouds-200, 100, 30);
    cloud(myClouds+300, 180, 20);
    cloud(myClouds+500, 300, 70);
  }
  cloud(myClouds-100, 300, 50);
  cloud(myClouds, 500, 80);
  cloud(myClouds-200, 100, 30);
  cloud(myClouds+300, 180, 20);
  cloud(myClouds+500, 300, 70);
  document.getElementById('startButton').style.display = "block";
  //document.getElementById('text_input').value = '';
  document.getElementById('text_input').style.display = "block";
  fill(0);
  textSize(84);
  textAlign(CENTER);
  text("Welcome to the Balloon Game!", canvasXsize/2, (canvasYsize/2)-100);
  textSize(34);
  text("Use the needle to pop balloons as they float through the air.", canvasXsize/2, (canvasYsize/2)-50);
  text("The first player to pop 30 balloons wins!", canvasXsize/2, (canvasYsize/2)-0);
  document.getElementById('startButton').addEventListener("click", function(){
      if(document.getElementById('text_input').value == "")
      {
          me = "No Name";
      } else{
      currentStatus = "game";
      document.getElementById('startButton').style.display = "none";
      document.getElementById('text_input').style.display = "none";
      me = document.getElementById('text_input').value;
    }
  });
}

function playGame(){
  background(120, 220, 255);
  if (myClouds > canvasXsize+300){
    myClouds = -500;
    cloud(myClouds-100, 300, 50);
    cloud(myClouds, 500, 80);
    cloud(myClouds,-500, 280);
    cloud(myClouds-200, 100, 30);
    cloud(myClouds+300, 180, 20);
    cloud(myClouds+500, 300, 70);
  }
  cloud(myClouds-100, 300, 50);
  cloud(myClouds, 500, 80);
  cloud(myClouds-200, 100, 30);
  cloud(myClouds+300, 180, 20);
  cloud(myClouds+500, 300, 70);
  theScore();
  them(challenger, newData);
  myClouds += 0.1;
  if (myClouds == canvasXsize + 100){
      myClouds = 0;
  }
  for (var i = 0; i < balloons.length; i++) {
      balloons[i].drawBalloon();
      balloons[i].move();

      if (balloons[i].positionY === 0){
        currentStatus = "winTwo";
      }

      if (mouseX <= balloons[i].positionX + tightness && mouseX >= balloons[i].positionX - tightness){
          if (mouseY <= balloons[i].positionY + tightness && mouseY >= balloons[i].positionY - tightness){
              console.log("Hovering over balloons["+i+"]");
              if (mouseIsPressed){

                  // pop the balloon
                  balloons.splice(i, 1);
                  console.log(balloons[i]);
                  bang(mouseX, mouseY);
                  sound.play();
                  score++;
                  sendScore(score);
                  sendName(me);
              }
          }
      }
       if (balloons.length > 50) {
          balloons.splice(0, 1);
      }
  }

  if (myCount == 65){
      r = random (0, 255);
      g = random (0, 255);
      b = random (0, 255);
      console.log("adding a Balloon");
      balloons.push(new Balloon(random(0, canvasXsize), canvasYsize + 150, balloonSize, r, g, b));
      myCount = 0;
  }
  myCount++;

  if(score >= winner){
    currentStatus = "winOne";
  } else if (newData >= winner){
    currentStatus = "winTwo";
  }

  balloonMusic.play();
}//Close playGame

function winPerson(person){
  textFont('Life Savers');
  background(249, 176, 0);
  fill(0);
  textSize(84);
  textAlign(CENTER);
  text(person+" wins!", canvasXsize/2, canvasYsize/2);
  balloons.length = 0;
  score = 0;
  newData = 0;
  balloonMusic.pause();
  balloonMusic.currentTime = 0;
  winSong.play();
  setTimeout(function(){
    currentStatus="start";
  }, 5000);
}

function myInputEvent() {
  console.log('you are typing: ', this.value());
}

function cloud(x, y, size){
    fill(255, 255, 255);
	  noStroke();
	  ellipse(x, y, size, size);
    ellipse(x+size/2, y-size/3, size, size);
    ellipse(x+size/2, y, size, size);
    ellipse(x+size, y, size, size);
}

function theScore(){
    fill(0);
    textSize(44);
    textAlign(LEFT);
    text(me+": "+score, 40, 60);
}


function them(challenger, data){
  fill(0);
  textSize(44);
  textAlign(LEFT);
  text(challenger+": "+data, 40, 120);
}



function bang(x, y){
    noStroke();
    fill(249, 176, 0);
    ellipse(x, y, 175, 175);
}

var Balloon = function(positionX, positionY, balloonSize, colorR, colorG, colorB){

    this.positionX = positionX;
    this.positionY = positionY;
    this.balloonSize = balloonSize;
    this.balloonTie =52;
    this.moveUp = 1.2;
    this.colorR = colorR;
    this.colorG = colorG;
    this.colorB = colorB;

    this.drawBalloon = function(){

        // body
        cursor('needleCursor.png');
        noStroke();
        fill(this.colorR, this.colorG, this.colorB);
        ellipse(this.positionX, this.positionY, this.balloonSize, this.balloonSize);
        ellipse(this.positionX, this.positionY+5, this.balloonSize/1.06, (this.balloonSize/1.4) + 30);
        ellipse(this.positionX, this.positionY+5, this.balloonSize/1.06, (this.balloonSize/1.4) + 30);
        // tie
        stroke(160);
        strokeWeight(1);
        line(this.positionX, this.positionY + this.balloonTie, this.positionX, this.positionY + this.balloonTie + 100);
        noStroke();
        fill(this.colorR, this.colorG, this.colorB);
        ellipse(this.positionX, this.positionY+ this.balloonTie, 10, 10);


    }

    this.move = function() {

    this.positionY = this.positionY - this.moveUp; // this runs every second... ah ok so it's subtracting moveUp every second

  }

}
