
// GameBoard code below
var socket = io.connect("http://24.16.255.56:8888");
var circles = [];
var cur = [];
socket.on("load", function(data){
    console.log(data); //just to see if it's sendt anything to the database by doing load of a state
});

function save(event){
    console.log("Save pressed ")
    for(var i = 0; i < circles.length; i++){
        console.log(circles[i]);
    }
    socket.emit("save", {studentname: "Irene Fransiga", statename: "hw3State", data: "is it saving?"});
    
    
}
function load(event){
    console.log("load pressed");
    socket.emit("load", {studentname: "Irene Fransiga", statename: "hw3State"});
}

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game, ctx) {
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.colors = ["Yellow", "Green", "Blue", "White"];
    this.setNotIt();
    this.time = 0;
    this.ctx = ctx;
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

function RectObs(game){
    this.x = 150;
    this.y = 200;
    this.w = Math.random() * (200) + 20; //(max-min) + min
    this.h = Math.random() * (200) + 20; //(max-min) + min
    Entity.call(this, game, this.x + Math.random() * (800 - this.x), this.y + Math.random() * (800 - this.y));
}
Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

RectObs.prototype = new Entity();
RectObs.prototype.constructor = RectObs;

Circle.prototype.setIt = function () {
    this.it = true;
    this.visualRadius = 500;
};

Circle.prototype.setNotIt = function () {
    this.it = false;
    this.color = Math.floor(Math.random() * Math.floor(this.colors.length));
    this.visualRadius = 200;
};
//if a circle collide with another circle
Circle.prototype.collide = function (other) {
    return (distance(this, other) < this.radius + other.radius);
};
//if a circle collide with the box
Circle.prototype.collideLeft = function () {
    // console.log("1");
    return ((this.x - this.radius) < 0 );
};

Circle.prototype.collideRight = function () {
    // console.log("2");
    return ((this.x + this.radius) > 800);
};

Circle.prototype.collideTop = function () {
    // console.log("3");
    return ((this.y - this.radius) < 0 );
};

Circle.prototype.collideBottom = function () {
    // console.log("4");
    return ((this.y + this.radius) > 700);
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);
 //  console.log(this.velocity);
    this.time += 1/60;
    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;
   

//Collision where to bounce when on the game board
    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
        
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 700 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];   
        //REMOVE AN ENTITY
        if (ent !== this && this.collide(ent)) {
            if(this.collide(ent) && this.it === true){
                // console.log("collide with entity: " + i);
                this.game.removeEntity(this.game.entities[i]);
                if((ent.color === 0 || ent.color === 2)){
                    this.radius +=5;
                } else if ((ent.color === 1 || ent.color === 3) && this.radius > 5){
                    this.radius -=3;
                }
                this.game.addEntity(new Circle(this.game));
            }
            //NOT REALLY NEEDED FOR THIS SIMULATION
            // var temp = { x: this.velocity.x, y: this.velocity.y };
            // var dist = distance(this, ent);
            // var delta = this.radius + ent.radius - dist;
            // var difX = (this.x - ent.x)/dist;
            // var difY = (this.y - ent.y)/dist;

            // this.x += difX * delta / 2;
            // this.y += difY * delta / 2;
            // ent.x -= difX * delta / 2;
            // ent.y -= difY * delta / 2;

            // this.velocity.x = ent.velocity.x * friction;
            // this.velocity.y = ent.velocity.y * friction;
            // ent.velocity.x = temp.x * friction;
            // ent.velocity.y = temp.y * friction;
            // this.x += this.velocity.x * this.game.clockTick;
            // this.y += this.velocity.y * this.game.clockTick;
            // ent.x += ent.velocity.x * this.game.clockTick;
            // ent.y += ent.velocity.y * this.game.clockTick;

            // //swap the circles
            // if (this.it) {
            //     this.setNotIt();
            //     ent.setIt();
            // }
            // else if (ent.it) {
            //     this.setIt();
            //     ent.setNotIt();
                
            // }
        }
        
        //THIS IS GOOD ALREADY -- just need to stop the game
        // if(this.game.entities.length == 1){
        //     console.log(this.time);
        //     // this.game.removeEntity(this.game.entities[this.game.entities.length -1]);
        //     // //not showing :/ 
            // this.ctx.fillStyle = "white";
            // this.ctx.font = "24pt Impact";
            // this.ctx.fillText("Time Taken: " + this.time + " seconds", 500, 100);
        //     // console.log("printed");
        //     this.game.removeEntity(this.game.entities[this.game.entities.length -1]);
        // }

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            if (this.it && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
            if (ent.it && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
    }


    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;

    
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    if(this.it === true){
        ctx.fillStyle = "Red";
    } else{
        ctx.fillStyle = this.colors[this.color];
    }
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};

RectObs.prototype.draw = function(ctx){
    ctx.beginPath();
    ctx.fillStyle = "Green";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
}


// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 400;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();

    // the fixed obstacles
    // for(var i = 0; i < 1; i++){
    //     var rect = new RectObs(gameEngine);
    //     gameEngine.addEntity(rect);
    //     console.log("added rect: " + rect.x + " " + rect.y + " " + rect.w + " " + rect.h);
    // }

    //the red circle
    var circle = new Circle(gameEngine, ctx);
    circle.setIt();
    circles[0] = circle;

    //the white circles
    gameEngine.addEntity(circle);
    for (var i = 0; i < 12; i++) {
        circle = new Circle(gameEngine, ctx);
        gameEngine.addEntity(circle);
        circles[i+1] = circle;
        
    }
    gameEngine.init(ctx);
    gameEngine.start();
});
