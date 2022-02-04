const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//buttons
const buttonElements = document.querySelectorAll(".button");
let buttonMeasurements = [];

function measureButtons() {
    buttonMeasurements = [];
    buttonElements.forEach(button => {
        buttonMeasurements.push(button.getBoundingClientRect());
    });
}
measureButtons();
// console.log(buttonMeasurements);

//creating particles
let particlesArray = [];
class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.weight = Math.random() * 1.5 + 1.5;
        this.directionX = Math.random() * 2;
    }
    update() {
        this.y += this.weight;
        // this.x += this.directionX;
        if(this.size >= 0.3) this.size -= 0.2;
    }
    draw() {
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // ctx.fillStyle = "white";
        // ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

let activeButton = 1;
buttonElements.forEach(button => button.addEventListener("mouseenter",function(){
    activeButton = button.dataset.number;
}));
buttonElements.forEach(button => button.addEventListener("mouseleave",function(){
    activeButton = -1;
}));

function handleParticles() {
    for(let i=0; i < particlesArray.length; i++){
        for(let y = i; y < particlesArray.length; y++){
            let dx = particlesArray[i].x - particlesArray[y].x;
            let dy = particlesArray[i].y - particlesArray[y].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let opacity = particlesArray[i].size/80 + particlesArray[y].size/80;
            ctx.strokeStyle = "rgba(255,255,255," + opacity;
            if(distance < 70) {
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[y].x, particlesArray[y].y);
                ctx.stroke();
            }
        }
        particlesArray[i].update();
        particlesArray[i].draw();
        if(particlesArray[i].size <= 1){
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

function createParticle() {
    if(activeButton > -1){
        let size = Math.random() * 40 + 10;
        let x = Math.random() * (buttonMeasurements[activeButton].width - size * 2) + buttonMeasurements[activeButton].x + size;
        let y = buttonMeasurements[activeButton].y + 40;
        particlesArray.push(new Particle(x, y, size));
    }
}

function animate() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    createParticle();
    handleParticles();
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize' ,function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    measureButtons();
});