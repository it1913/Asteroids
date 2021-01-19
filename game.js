const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const SHIP_SIZE = 25;
const TURN_SPEED = 360;
const FPS = 50;
const SHIP_SPEED = 3;
const FRICTION = 0.9;
const ASTEROID_SPEED = 3;
const MIN_ASTEROID_SPEED = 2;
const RADIUS = 20;
const MIN_RADIUS = 20;
const COLLISION_BORDER = 1;


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
        ctx.strokeStyle = "white";
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
        //Kolizní kolečko
        /* ctx.strokeStyle = "red";
         ctx.beginPath();
         ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
         ctx.stroke();
         ctx.closePath();*/
    }
    move() {
        //Akcelerace lodi
        if (this.movement) {
            this.move.x += SHIP_SPEED * Math.cos(this.a) / FPS;
            this.move.y -= SHIP_SPEED * Math.sin(this.a) / FPS;
        } else {
            this.move.x -= FRICTION * this.move.x / FPS;
            this.move.y -= FRICTION * this.move.y / FPS;
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

class Asteroid {
    static FILL_COLOR = 'gray';
    constructor(x, y, radius = 10, speed = 2, angle = 2 * Math.PI) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.color = Asteroid.FILL_COLOR;
        this.angle = angle;
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
    move() {
        this.y += Math.cos(this.angle) * (10 * this.speed / FPS);
        this.x += Math.sin(this.angle) * (10 * this.speed / FPS);
    }
}

function detectCollision(asteroid, ship) {
    let sidea = Math.abs(asteroid.x - ship.x);
    let sideb = Math.abs(asteroid.y - ship.y);
    let distance = Math.sqrt(sidea ** 2 + sideb ** 2);
    return (distance < asteroid.radius + ship.size);
}

function detectCollisionBorder(asteroid) {
    return (asteroid.y + COLLISION_BORDER > canvas.height ||
        asteroid.y - COLLISION_BORDER < 0 ||
        asteroid.x - COLLISION_BORDER < 0 ||
        asteroid.x + COLLISION_BORDER > canvas.width);
}

class Game {
    constructor() {
        this.asteroids = [];
    }
    createShip() {
        //this.ship = new Ship();
        ship.setup();
    }
    addTopAsteroid() {
        let radius = Math.round(Math.random() * RADIUS) + MIN_RADIUS;
        let speed = Math.ceil(Math.random() * ASTEROID_SPEED + MIN_ASTEROID_SPEED);
        let angle = Math.PI / 4 * (2 * Math.random() - 1);
        let x = Math.floor(Math.random() * canvas.width);
        let y = radius;
        this.asteroids.push(new Asteroid(x, y, radius, speed, angle));
    }
    addTopAsteroidLeft() {
        let radius = Math.round(Math.random() * RADIUS) + MIN_RADIUS;
        let speed = Math.ceil(Math.random() * ASTEROID_SPEED + MIN_ASTEROID_SPEED);
        let angle = Math.PI / 4 * (2 * Math.random() - 1) + Math.PI / 2;
        let x = radius;
        let y = Math.floor(Math.random() * canvas.height);
        this.asteroids.push(new Asteroid(x, y, radius, speed, angle));
    }
    addTopAsteroidBottom() {
        let radius = Math.round(Math.random() * RADIUS) + MIN_RADIUS;
        let speed = -Math.ceil(Math.random() * ASTEROID_SPEED + MIN_ASTEROID_SPEED);
        let angle = -Math.PI / 4 * (2 * Math.random() - 1);
        let x = Math.floor(Math.random() * canvas.width);
        let y = canvas.height - radius;
        this.asteroids.push(new Asteroid(x, y, radius, speed, angle));
    }
    addTopAsteroidRight() {
        let radius = Math.round(Math.random() * RADIUS) + MIN_RADIUS;
        let speed = Math.ceil(Math.random() * ASTEROID_SPEED + MIN_ASTEROID_SPEED);
        let angle = -Math.PI / 4 * (2 * Math.random() - 1) - Math.PI / 2;
        let x = canvas.width - radius;
        let y = Math.floor(Math.random() * canvas.height);
        this.asteroids.push(new Asteroid(x, y, radius, speed, angle));
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
        this.drawPlayground();
        this.asteroids.forEach(function (obj, index, arr) {
            obj.move();
            obj.draw();
            if (detectCollision(obj, ship)) {
                arr.splice(arr.indexOf(obj), 1);
            } else
                if (detectCollisionBorder(obj)) {
                    arr.splice(arr.indexOf(obj), 1);
                }
        });
        ship.draw();
    }
    setup() {
        this.createShip();
        for (let i = 10; i > 0; i--) {
            this.addTopAsteroid();
            this.addTopAsteroidLeft();
            this.addTopAsteroidBottom();
            this.addTopAsteroidRight();
        }
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