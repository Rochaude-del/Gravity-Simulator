import { interactiveCanvas } from "./declarations.js";
import { taskbar, animationControls } from "./UI.js";
import { finalDraw } from "./animation.js";

class GravitySimulator {
    constructor(id) {
        this.div = document.querySelector(id);
        this.div.style.position = "relative";
        this.div.appendChild(taskbar);
        this.div.appendChild(interactiveCanvas);
        this.div.appendChild(animationControls);
    }

    start() {
        interactiveCanvas.drawFunction = finalDraw;
        interactiveCanvas.animate();
    }
}



export { GravitySimulator };