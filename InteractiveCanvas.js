import { FunctionCanvas } from "./functionCanvas.js";
class InteractiveCanvas extends FunctionCanvas {


    constructor() {
        super();
        this.drawFunction;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.xCenter = this.width / 2; //this represents the position of the center of the drawing context relative to the canvas window, in window coordinates. It is used to keep track of the center of the drawing context as it is translated by mouse movement and zooming, so that the correct transformations can be applied to the helper canvases as well.
        this.yCenter = this.height / 2; //and will change as transforms are applied to the context.
        this.ctx.translate(this.xCenter, this.yCenter); //center of window obviously equal to heigh and width divided by 2.
        this.helperCanvases = [];
        this.mouseX = 0; // need to define this to avoid issues upon first starting
        this.mouseY = 0; // more elegant solution needed
        this.tempX;
        this.tempY;
        this.mousePressed = false;
        this.scrolling = false;
        this.deltaScroll;
        this.scaleFactor = 1.1;
        this.scale = 1;
        this.enableZoom = true;
        this.enableMove = true;
        this.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX - this.offsetLeft;
            this.mouseY = e.clientY - this.offsetTop;
            if (this.enableMove) {
                if (this.mousePressed) {
                    let deltaX = this.mouseX - this.tempX;
                    let deltaY = this.mouseY - this.tempY;
                    this.translateCenterUpdate(deltaX / this.scale, deltaY / this.scale);
                    this.fullClear();
                    for (const i of this.helperCanvases) {
                        i.translateCenterUpdate(deltaX / this.scale, deltaY / this.scale);
                        i.fullClear();
                    }
                    this.tempX = this.mouseX;
                    this.tempY = this.mouseY;
                }
            }


        });
        this.addEventListener("mousedown", (e) => {

            this.tempX = this.mouseX;
            this.tempY = this.mouseY;

            this.mousePressed = true;
        }
        );
        this.addEventListener("mouseup", (e) => {

            this.mousePressed = false;
        }
        );
        this.addEventListener("wheel", (e) => {
            if (this.enableZoom) {
                e.preventDefault();


                if (e.deltaY < 0) {

                    this.xCenter = this.mouseX + (this.xCenter - this.mouseX) * this.scaleFactor;
                    this.yCenter = this.mouseY + (this.yCenter - this.mouseY) * this.scaleFactor;
                    this.scale *= this.scaleFactor;
                    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.xCenter, this.yCenter);
                    this.fullClear();
                    for (const i of this.helperCanvases) {
                        i.xCenter = this.mouseX + (i.xCenter - this.mouseX) * this.scaleFactor;
                        i.yCenter = this.mouseY + (i.yCenter - this.mouseY) * this.scaleFactor;
                        i.scale *= this.scaleFactor;
                        i.ctx.setTransform(this.scale, 0, 0, this.scale, this.xCenter, this.yCenter);
                        i.fullClear();
                    }



                }
                else {
                    this.xCenter = this.mouseX + (this.xCenter - this.mouseX) / this.scaleFactor;
                    this.yCenter = this.mouseY + (this.yCenter - this.mouseY) / this.scaleFactor;
                    this.scale /= this.scaleFactor;
                    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.xCenter, this.yCenter);
                    this.fullClear();
                    for (const i of this.helperCanvases) {
                        i.xCenter = this.mouseX + (i.xCenter - this.mouseX) / this.scaleFactor;
                        i.yCenter = this.mouseY + (i.yCenter - this.mouseY) / this.scaleFactor;
                        i.scale /= this.scaleFactor;
                        i.ctx.setTransform(this.scale, 0, 0, this.scale, this.xCenter, this.yCenter);
                        i.fullClear();
                    }
                }
            }
        }
        );
    }
    resetCtx() {
        this.xCenter = this.width / 2;
        this.yCenter = this.height / 2;
        this.scale = 1;
        this.ctx.setTransform(1, 0, 0, 1, this.xCenter, this.yCenter);
        this.fullClear();
        for (const i of this.helperCanvases) {
            i.xCenter = this.width / 2;
            i.yCenter = this.height / 2;
            i.scale = 1;
            i.ctx.setTransform(1, 0, 0, 1, this.xCenter, this.yCenter);
            i.fullClear();
        }
    }

    xOfWindowToCanvas(x) {                    //converts window coordinates to context coordinates
        let p;
        p = (x - this.xCenter) / this.scale;
        return p;

    }

    xOfCanvasToWindow(x) {
        let p;
        p = x * this.scale + this.xCenter;
        return p;
    }

    yOfWindowToCanvas(y) {                  //conversts context coordinates to window coordinates
        let p;
        p = (y - this.yCenter) / this.scale;
        return p;

    }

    yOfCanvasToWindow(y) {
        let p;
        p = y * this.scale + this.yCenter;
        return p;
    }

    translateCenterUpdate(x, y) {
        this.ctx.translate(x, y);
        this.xCenter += this.scale * x;
        this.yCenter += this.scale * y;
    }

    fullClear() {
        this.ctx.clearRect(this.xOfWindowToCanvas(0), this.yOfWindowToCanvas(0), this.width / this.scale, this.height / this.scale);
    }

    clear() {
        this.ctx.fillStyle = `rgb(0 0 0 / 1.0)`;
        this.ctx.fillRect(this.xOfWindowToCanvas(0), this.yOfWindowToCanvas(0), this.width / this.scale, this.height / this.scale);
    }

    clearFade(num) {
        this.ctx.fillStyle = `rgb(0 0 0 / ${num})`;
        this.ctx.fillRect(this.xOfWindowToCanvas(0), this.yOfWindowToCanvas(0), this.width / this.scale, this.height / this.scale);
    }

    animate() {
        this.fullClear();
        this.drawFunction();
        requestAnimationFrame(this.animate.bind(this));



    }

    animateFade() {
        this.clearFade("#00000003");
        this.drawFunction();
        requestAnimationFrame(this.animateFade.bind(this));
    }

    changeCanvasSize(width, height) { //probably won't work if used during animation
        this.width = width;
        this.height = height;
        this.xCenter = this.width / 2;
        this.yCenter = this.height / 2;
        this.ctx.translate(this.xCenter, this.yCenter);
    }

    centerOnPoint(x, y) {
        const xWindowDiff = this.xOfCanvasToWindow(x) - this.width / 2;
        const yWindowDiff = this.yOfCanvasToWindow(y) - this.height / 2;
        this.translateCenterUpdate(-xWindowDiff / this.scale, -yWindowDiff / this.scale);
        for (const i of this.helperCanvases) {
            i.translateCenterUpdate(-xWindowDiff / this.scale, -yWindowDiff / this.scale);
        }
    }
}

customElements.define("interactive-canvas", InteractiveCanvas, { extends: "canvas" });

export { InteractiveCanvas };