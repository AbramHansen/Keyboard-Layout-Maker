var c = document.getElementById("mainCanvas");
var ctx = c.getContext("2d");

var mouseX = 0;
var mouseY = 0;

var buttons = [];

c.addEventListener("mousemove", e => {
    mouseX = e.x - c.getBoundingClientRect().x;
    mouseY = e.y - c.getBoundingClientRect().y;

    for(var button of buttons) {
        if(button.pointIn(mouseX, mouseY)) {
            button.hover = true;
        } else {
            button.hover = false;
        }
    }
})
c.addEventListener("mousedown", e => {
    for(var button of buttons) {
        if(button.pointIn(mouseX, mouseY)) {
            button.selected = true;
            break; //makes sure no more than one button is selected at the same time.
        }
    }
})
c.addEventListener("mouseup", e => {
    for(var button of buttons) {
        if(button.selected) {
            button.selected = false;
            button.snapToGrid();
        }
    }
})

function addKey(){
    buttons.push(new Item(100,100,50,50,document.getElementById("bubble").value,document.getElementById("lable").value));
}

class Item {
    constructor(x,y,width,height,text,lable) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.lable = lable;
        this.selected = false;
        this.hover = false;
    }
    update() {
        if(this.selected) {
            this.x = mouseX - this.width / 2;
            this.y = mouseY - this.height / 2;
        }
    }
    draw() {
        //key
        ctx.fillStyle = "Grey";
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height,5);
        ctx.fill();

        //lable
        ctx.fillStyle = "Black";
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.fillText(this.lable, this.x + this.width / 2, this.y + this.height / 2);
    }
    drawBubble() {
        if(this.hover && this.text != "") {
            const textLength = ctx.measureText(this.text).width;

            //text bubble
            const margin = 5;
            ctx.fillStyle = "White";
            ctx.beginPath();
            ctx.roundRect(this.x + this.width / 2 - textLength / 2 - margin, this.y - 40, textLength + margin * 2, 22, 5);
            ctx.stroke();
            ctx.fill();
    
            //text itself
            ctx.fillStyle = "Black";
            ctx.font = "12px serif";
            ctx.textAlign = "center";
            ctx.fillText(this.text, this.x + this.width / 2, this.y - 25);
        }
    }
    pointIn(x, y){
        if(x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
            return true;
        }
        return false;
    }
    snapToGrid(){
        this.x = this.x - this.x % 15;
        this.y = this.y - this.y % 15;
    }
}

function loop(timestamp) {

    //Clear Screen
    ctx.clearRect(0, 0, screen.width, screen.height);
  
    for(var button of buttons) {
        button.update();
        button.draw();
        button.update();
    }
    //seperate loop for the bubbles so that they are always drawn on top.
    for(var button of buttons) {
        button.drawBubble();
    }


    document.querySelector("body > h1:nth-child(2)").innerText = mouseX + ", " + mouseY;
    
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);