class FunctionCanvas extends HTMLCanvasElement {
    constructor() {
        super();
        this.ctx = this.getContext("2d");



    }
    drawCircle(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }

    drawCircleOutline(x, y, size, color) {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, 2 * Math.PI, true);
        this.ctx.stroke();
    }

    drawLine(x0, y0, x1, y1, color) {
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
    }

    drawRing(x, y, radius1, radius2, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius1, 0, 2 * Math.PI, true);
        this.ctx.arc(x, y, radius2, 0, 2 * Math.PI, false);
        this.ctx.fill("evenodd");
    }



}

customElements.define("function-canvas", FunctionCanvas, { extends: "canvas" });

export { FunctionCanvas };
