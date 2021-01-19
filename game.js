const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const SHIP_SIZE = 25;
const TURN_SPEED = 360;
const FPS = 60;
const SHIP_SPEED = 5;
const FRICTION = 0.95;

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: SHIP_SIZE / 2,
    a: 90 / 180 * Math.PI,
    rotation: 0,
    movement: false,
    move: {
        x: 0,
        y: 0,
    }
}
setInterval(sketch, 1000 / FPS);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(ev) {
    console.log(ev.key)
    switch (ev.key) {
        case 'ArrowLeft':
            ship.rotation = TURN_SPEED / 180 * Math.PI / FPS;
            break;
        case 'ArrowRight':
            ship.rotation = -TURN_SPEED / 180 * Math.PI / FPS;
            break;
        case 'ArrowUp':
            ship.movement = true;
            break;
    }
}

function keyUp(ev) {
    switch (ev.key) {
        case 'ArrowLeft':
            ship.rotation = 0;
            break;
        case 'ArrowRight':
            ship.rotation = 0;
            break;
        case 'ArrowUp':
            ship.movement = false;
            break;
    }
}

function sketch() {
    console.log('sketch');
    //Vykreslení pozadí
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //Akcelerace lodi
    if (ship.movement) {
        ship.move.x += SHIP_SPEED * Math.cos(ship.a) / FPS;
        ship.move.y -= SHIP_SPEED * Math.sin(ship.a) / FPS;
    }else{
        ship.move.x -= FRICTION * ship.move.x / FPS
        ship.move.y -= FRICTION * ship.move.y / FPS
    }

    //Vykreslení vesmírné lodi
    ctx.strokeStyle = "white"
    ctx.lineWidth = SHIP_SIZE / 20;
    ctx.beginPath();
    ctx.moveTo(
        ship.x + ship.size * Math.cos(ship.a),
        ship.y - ship.size * Math.sin(ship.a));
    ctx.lineTo(
        ship.x - ship.size * (Math.cos(ship.a) + Math.sin(ship.a)),
        ship.y + ship.size * (Math.sin(ship.a) - Math.cos(ship.a))
    );
    ctx.lineTo(
        ship.x - ship.size * (Math.cos(ship.a) - Math.sin(ship.a)),
        ship.y + ship.size * (Math.sin(ship.a) + Math.cos(ship.a))
    );
    ctx.closePath();
    ctx.stroke();
    //Rotace
    ship.a += ship.rotation;
    //Pohyb lodě
    ship.x += ship.move.x;
    ship.y += ship.move.y;
    //Ošetření okrajů
    if (ship.x < 0 - ship.size) {
        ship.x = canvas.width + ship.size;
    } else if (ship.x > canvas.width + ship.size) {
        ship.x = 0 - ship.size;
    }

    if (ship.y < 0 - ship.size) {
        ship.y = canvas.height + ship.size;
    } else if (ship.y > canvas.height + ship.size) {
        ship.y = 0 - ship.size;
    }
    game.draw();
};

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
}

class Game{
    constructor(){
        this.asteroids = [];
    }
    addTopAsteroid() {
        let x = Math.floor(Math.random() * canvas.width);
        let radius = Math.round(Math.random() * 10) + 10;
        let speed = Math.ceil(Math.random() * 5);
        this.asteroids.push(new Asteroid(x, 0, radius, speed));
        console.log('addTopAsteroid '+this.asteroids.length);        
    }

    draw() {
        //console.log('Game.draw '+this.asteroids.length);        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.asteroids.forEach(function(obj, index, arr){
            obj.draw();
        });
    }
    setup() {
        this.addTopAsteroid();
        this.addTopAsteroid();
        this.addTopAsteroid();
    }
    play() {
        sketch();
    }
}
let game = new Game();

game.setup();
game.play();




