import { data, interactiveCanvas, lockonPoint } from "./declarations.js";
import { generateDiskWithVel } from "./generators.js";
import { settings } from "./settings.js";
import { createDiskMenu, ctrlPressed, taskbar, icon, createNumberInput } from "./UI.js";
import { Quadtree } from "./Quadtree.js";
import { DropMenuButton, ExpandMenu, ToggleButton } from "./UIElements.js";

const physicsSettings = new DropMenuButton();
physicsSettings.button.textContent = "physics settings";
taskbar.appendChild(physicsSettings);

const toggleCollisions = new ToggleButton();
toggleCollisions.textContent = "toggle collisions";
toggleCollisions.addEventListener("click", () => { settings.collisions = !settings.collisions });
physicsSettings.panel.appendChild(toggleCollisions);

const deleteDistanceControl = createNumberInput("delete distance", "delete-distance-control");
deleteDistanceControl.children[0].setAttribute("value", settings.distanceLimit);
physicsSettings.panel.appendChild(deleteDistanceControl);
deleteDistanceControl.children[0].addEventListener("input", (e) => {
    const value = e.target.valueAsNumber;
    settings.distanceLimit = (isNaN(value)) ? settings.distanceLimit : value;
});

const thetaControl = createNumberInput("theta", "theta-control");
thetaControl.children[0].setAttribute("value", settings.theta);
physicsSettings.panel.appendChild(thetaControl);
thetaControl.children[0].addEventListener("input", (e) => {
    const value = e.target.valueAsNumber;
    settings.theta = (isNaN(value)) ? settings.theta : value;
});


export { physicsSettings };