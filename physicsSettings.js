import { data, interactiveCanvas, lockonPoint } from "./declarations.js";
import { generateDiskWithVel } from "./generators.js";
import { settings } from "./settings.js";
import { createDiskMenu, ctrlPressed, taskbar, icon } from "./UI.js";
import { Quadtree } from "./Quadtree.js";
import { DropMenuButton, ExpandMenu, ToggleButton } from "./UIElements.js";

const physicsSettings = new DropMenuButton();
physicsSettings.button.textContent = "physics settings";
taskbar.appendChild(physicsSettings);

const toggleCollisions = new ToggleButton();
toggleCollisions.textContent = "toggle collisions";
toggleCollisions.addEventListener("click",()=>{settings.collisions = !settings.collisions});
physicsSettings.panel.appendChild(toggleCollisions);


export{physicsSettings};