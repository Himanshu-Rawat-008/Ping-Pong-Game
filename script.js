let can = document.getElementById("table");
// for 2d figure apply only to canvas tag
let draw = can.getContext("2d");

let start = false;

// Properties of Ball
const ball = {
    x:can.width/2,
    y:can.height-10,
    radius: 4,
    velX: 5,
    velY:5,
    speed: 1, 
    color:"Green"
}
var  score = 0;
const barUp = {
    x:(can.width-50)/2,
    y:0,
    width:50,
    height:5,
    color:"white"
}
const barDown={
    x:(can.width-50)/2,
    y:can.height-5,
    width:50,
    height:5,
    color:"white"
}
function drawRectangle(x,y,w,h,color){
    // DRAW PADDLE
    draw.fillStyle=color;
    draw.fillRect(x,y,w,h);
}

function drawCircle(x,y,r,color){
    // Draw Ball
    draw.fillStyle = color;
    draw.beginPath();
    // arc(x,y,r,0,Math.PI*2,false) -- 0 for start angle -- false for clockwise direction
    draw.arc(x,y,r,0,Math.PI*2,true);
    draw.closePath();
    draw.fill();
}

function drawScore(text,x,y){
    draw.fillStyle = "white";
    draw.font = "10px Arial";
    draw.fillText(text,x,y);
}

function restart(){
    ball.x = can.width/2;
    ball.y = can.height-10;
    ball.velY=-ball.velY;
    ball.speed =5;
}

// Collision Detection
function detect_collision(ball,player){
    // player = barUp or barDown
    player.top=player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x+player.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x+ball.radius;
    return player.left<ball.right
            &&player.top<ball.bottom 
            &&player.right>ball.left
            &&player.bottom>ball.top;
}
//                     player.top<ball.bottom
//                         _______________
// player.left<ball.right |               |  player.right>ball.left
//                        |_______________|
//                        player.bottom>ball.top

function updates()
{
    if(ball.y-ball.radius<0) 
    {
        start = false;
        score++;
        restart();
    }
    else if(ball.y+ball.radius>can.height)
    {
        start = false;
        score++;
        restart();
    }
    ball.x+=ball.velX;
    ball.y+=ball.velY;
    if(ball.x-ball.radius<0||ball.x+ball.radius>can.width)
    {
        ball.velX=-ball.velX;
    }
    let player = (ball.y+ball.radius<can.height/2)? barUp:barDown;
    if(detect_collision(ball,player))
    {
        // hitSound.play();
        //default angle is 0 deg in Radian
        let angle =0;
        //check where the ball hits the paddle
        if(ball.x<(player.x+player.width/2))
            angle = -1 * Math.PI/4;
        else if(ball.x>(player.x+player.width/2))
            angle = Math.PI/4;
        
        console.log(ball.velY);
        console.log(ball.velX);
        ball.velY=(player===barUp?1:-1)*ball.speed*(Math.cos(angle)/4);
        ball.velX= ball.speed*(Math.sin(angle)/4);
        ball.speed+=0.2;
    }
}
function helper(){
    // create table  or background
    drawRectangle(0,0,can.width, can.height,"black");
    drawScore(score,0,can.height/2);
    // bar 1
    drawRectangle(barUp.x,barUp.y,barUp.width,barUp.height,barUp.color);
    //bar 2
    drawRectangle(barDown.x,barDown.y,barDown.width,barDown.height,barDown.color);
    // draw ball
    drawCircle(ball.x,ball.y,ball.radius,ball.color);
}


let inter = -1;

window.onkeydown = function(e){
    start = true;
    // if d is pressed move left
    if(e.key=='d'||e.key=='D')
    {
    if(inter == -1){
        inter = setInterval(function(){
            let moveLeft= barUp.x;
            if(moveLeft<can.width-50){
                barUp.x=moveLeft+10;
                barDown.x=moveLeft+10;
                }
            }, 1000/fps);
        }
    }
    //if a is pressed move right
    if(e.key=='a'||e.key=='A')
    {
    if(inter == -1){
        inter = setInterval(function(){
            let moveLeft= barUp.x;
            if(moveLeft>0){
                barUp.x=moveLeft-10;
                barDown.x=moveLeft-10;
                }
        }, 1000/fps);
        }
    }
};

window.onkeyup = function(){
    clearInterval(inter);
    inter = -1;
};

function call_back(){
    if(start == true)
        updates();
    helper();
}
let fps = 60;
// call this function to move the ball
let looper = setInterval(call_back, 1000/fps);
