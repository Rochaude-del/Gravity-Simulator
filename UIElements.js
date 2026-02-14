class DropMenuButton extends HTMLDivElement {
    constructor() {
        super();

        this.style.display = "flex";
        this.style.flexDirection = "column";


        this.placementDiv = document.createElement("div");

        this.style.width = "max-content";
        this.parent = null;
        this.button = new ToggleButton();

        this.appendChild(this.button);
        this.button.style.flex = "1";

        this.appendChild(this.placementDiv);

        this.classList.add("dropdown-menu");
        this.panel = document.createElement("div");
        this.panel.classList.add("dropdown-panel");
        this.panel.style.display = "none";
        this.placementDiv.appendChild(this.panel);
        this.button.addEventListener("click", () => {





            if (this.panel.style.display === "none") {

                if (this.parent) {
                    for (const child of this.parent.children) {
                        if (child instanceof DropMenuButton) {
                            if (child.panel.style.display != "none") {
                                child.panel.style.display = "none";
                                child.button.classList.remove("toggle-button");
                            }
                        }
                    }
                }
                this.panel.style.display = "flex";
            }
            else {
                this.panel.style.display = "none";
            }





        });


    }

    setParent(parent) {
        this.parent = parent;
        this.style.boxSizing = "border-box";
        this.style.width = "100%";
    }

    changePanelPlacement() {
        if (this.style.flexDirection === "column") { this.style.flexDirection = "row"; }
        else {
            this.style.flexDirection = "column";
        }
    }



}

customElements.define("dropdown-menu", DropMenuButton, { extends: "div" });

class ExpandMenu extends HTMLDivElement {
    constructor() {
        super();
        this.style.display = "flex";
        this.style.flex = "1";

        this.style.flexDirection = "column";
        this.button = document.createElement("button");
        this.button.classList.add("expand-menu-button");


        this.appendChild(this.button);
        this.panel = document.createElement("div");
        this.panel.style.display = "none";
        //this.panel.style.justifyContent = "center";
        this.appendChild(this.panel);

        this.panel.style.flexDirection = "column";

        this.button.addEventListener("click", () => {
            if (this.panel.style.display === "none") {
                this.querySelector(".expand-menu-button .expand-icon").classList.add("rotate-90");
                this.panel.style.display = "flex";
            }
            else {
                this.panel.style.display = "none";
                this.querySelector(".expand-menu-button .expand-icon").classList.remove("rotate-90");
            }

        });


    }


}
customElements.define("expand-menu", ExpandMenu, { extends: "div" });

class ToggleButton extends HTMLButtonElement { //having the settings these buttons control be added in the constructor would make things easier so I may do that at some point
    constructor() {
        super();
        this.addEventListener("click", this.toggle);
        this.pair = null;
    }

    toggle() {
        if (this.classList.contains("toggle-button")) {
            this.classList.remove("toggle-button");
        }
        else {
            this.classList.add("toggle-button")
            if (this.pair) {
                this.pair.classList.remove("toggle-button");
            }
        };
    }

    untoggle() {
        this.classList.remove("toggle-button");
    }

    addPair(pair) {
        this.pair = pair;
        pair.pair = this;
   
    }
}
customElements.define("toggle-button", ToggleButton, { extends: "button" });


export { DropMenuButton, ExpandMenu, ToggleButton };




