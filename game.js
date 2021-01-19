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
};

sketch();