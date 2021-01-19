const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const SHIP_SIZE = 25;

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: SHIP_SIZE / 2,
    a: 90 / 180 * Math.PI,

    shipMovement: function () {
        //Vykreslení pozadí
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    }
}



ship.shipMovement();
