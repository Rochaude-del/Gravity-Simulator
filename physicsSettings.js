import { data, interactiveCanvas } from "./declarations.js";
import { generateDiskWithVel } from "./generators.js";
import { settings } from "./settings.js";
import { createDiskMenu, ctrlPressed, taskbar } from "./UI.js";
import { Quadtree } from "./Quadtree.js";
import { lockonPoint } from "./lockon.js";
import { DropMenuButton, ExpandMenu } from "./dropdown.js";

const physicsSettings = new DropMenuButton();
physicsSettings.button.textContent = "physics settings";
taskbar.appendChild(physicsSettings);

const toggleCollisions = document.createElement("button");
toggleCollisions.textContent = "toggle collisions";
toggleCollisions.addEventListener("click",()=>{settings.collisions = !settings.collisions});
physicsSettings.panel.appendChild(toggleCollisions);

physicsSettings.parent = taskbar;

export{physicsSettings};