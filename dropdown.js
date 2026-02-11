class DropMenuButton extends HTMLDivElement {
    constructor() {
        super();

        this.style.display = "flex";
        this.style.flexDirection = "column";


        this.placementDiv = document.createElement("div");

        this.style.width = "max-content";
        this.parent = null;
        this.button = document.createElement("button");

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
    constructor(){
        super();
        this.style.display = "flex";
        this.style.flex = "1";
        this.style.width = "max-content";
        this.style.flexDirection = "column";
        this.button = document.createElement("button");
        this.appendChild(this.button);
        this.panel = document.createElement("div");
        this.panel.style.display = "none";
        //this.panel.style.justifyContent = "center";
        this.appendChild(this.panel);
        
        this.panel.style.flexDirection = "column";

        this.button.addEventListener("click",()=>{
            if (this.panel.style.display === "none") {

                this.panel.style.display = "flex";
            }
            else {
                this.panel.style.display = "none";
            }

        });


    }


}

customElements.define("expand-menu", ExpandMenu, { extends: "div" });

export{DropMenuButton,ExpandMenu};




