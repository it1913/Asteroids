const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const SHIP_SIZE = 25;
const TURN_SPEED = 360;
const FPS = 50;
const SHIP_SPEED = 3;
const FRICTION = 0.95;

class Ship {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = SHIP_SIZE / 2;
        this.a = 90 / 180 * Math.PI;
        this.rotation = 0;
        this.movement = false;
        this.move.x = 0;
        this.move.y = 0;
    }
    draw() {
        ctx.strokeStyle = "white"
        ctx.lineWidth = SHIP_SIZE / 20;
        ctx.beginPath();
        ctx.moveTo(
            this.x + this.size * Math.cos(this.a),
            this.y - this.size * Math.sin(this.a));
        ctx.lineTo(
            this.x - this.size * (Math.cos(this.a) + Math.sin(this.a)),
            this.y + this.size * (Math.sin(this.a) - Math.cos(this.a))
        );
        ctx.lineTo(
            this.x - this.size * (Math.cos(this.a) - Math.sin(this.a)),
            this.y + this.size * (Math.sin(this.a) + Math.cos(this.a))
        );
        ctx.closePath();
        ctx.stroke();    
    }
    move() {
        console.log('Ship.move');
        //Akcelerace lodi
        if (this.movement) {
            this.move.x += SHIP_SPEED * Math.cos(this.a) / FPS;
            this.move.y -= SHIP_SPEED * Math.sin(this.a) / FPS;
        }else{
            this.move.x -= FRICTION * this.move.x / FPS
            this.move.y -= FRICTION * this.move.y / FPS
        }
        //Rotace
        this.a += this.rotation;
        //Pohyb lodě
        this.x += this.move.x;
        this.y += this.move.y;
        //Ošetření okrajů
        if (this.x < 0 - this.size) {
            this.x = canvas.width + this.size;
        } else if (this.x > canvas.width + this.size) {
            this.x = 0 - this.size;
        }
    
        if (this.y < 0 - this.size) {
            this.y = canvas.height + this.size;
        } else if (this.y > canvas.height + this.size) {
            this.y = 0 - this.size;
        }
        //Vykreslení vesmírné lodi
        game.draw();
    } 

    setup() {
    }
    
    keyDown(key) {
        console.log(key)
        switch (key) {
            case 'ArrowLeft':
                this.rotation = TURN_SPEED / 180 * Math.PI / FPS;
                break;
            case 'ArrowRight':
                this.rotation = -TURN_SPEED / 180 * Math.PI / FPS;
                break;
            case 'ArrowUp':
                this.movement = true;
                break;
        }
        this.move();
    }
    
    keyUp(key) {
        switch (key) {
            case 'ArrowLeft':
                this.rotation = 0;
                break;
            case 'ArrowRight':
                this.rotation = 0;
                break;
            case 'ArrowUp':
                this.movement = false;
                break;
        }
        this.move();
    }
    
}

let ship = new Ship();

class Asteroid{
    static FILL_COLOR = 'white';
    constructor(x, y, radius=10, speed=2, angle=0){
        this.x = x;
        this.y = y;
        this.radius = radius;    
        this.speed = speed; 
        this.color = Asteroid.FILL_COLOR;
        this.angle = angle
    }

    draw(){
        ctx.beginPath();
        ctx.strokeStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        console.log(this.x, this.y, this.radius, 0, 2 * Math.PI);
    }
    move() {
        this.y += 10 * this.speed;
    }
}

class Game{
    constructor(){
        this.asteroids = [];        
    }
    createShip() {
        //this.ship = new Ship();
        ship.setup();
    }
    addTopAsteroid() {
        let x = Math.floor(Math.random() * canvas.width);
        let radius = Math.round(Math.random() * 10) + 10;
        let speed = Math.ceil(Math.random() * 5);
        this.asteroids.push(new Asteroid(x, 0, radius, speed));
        console.log('addTopAsteroid '+this.asteroids.length);        
    }
    
    drawPlayground() {
        //Vykreslení pozadí        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);            
    }
    move() {
        /*
        console.log('Game.move '+this.asteroids.length);      
        this.asteroids.forEach(function(obj, index, arr){
            obj.move();
        });
        */
        ship.move();        
    }
    draw() {  
        console.log('Game.draw '+this.asteroids.length);        
        this.drawPlayground();
        this.asteroids.forEach(function(obj, index, arr){
            obj.draw();
        });
        ship.draw();
        console.log('/Game.draw '+this.asteroids.length);        
    }
    setup() {
        this.createShip();
        this.addTopAsteroid();
        this.addTopAsteroid();
        this.addTopAsteroid();
        this.draw();
        setInterval(this.move, 1000 / FPS);
        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);    
    }    
    play() {
        console.log('play');
        this.move();
    };    
    keyDown(ev) {        
        ship.keyDown(ev.key);
    }    
    keyUp(ev) {
        ship.keyUp(ev.key);
    }
}
let game = new Game();

game.setup();
game.play();