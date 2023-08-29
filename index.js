let currPopup = null;

/**
 * @returns {void}
 * @param {HTMLSpanElement} signal 
 * @param {Object} attr 
 */
function addSignalStyles(signal, attr) {
    // cursor
    signal.style.cursor = "pointer";
    // color
    signal.style.backgroundColor = attr.color;
    // padding
    signal.style.padding = attr.padding + "px";
    // border
    signal.style.border = attr.border === "false"? "none": "4px solid black";
    // shape
    signal.style.borderRadius = attr.shape === "circle"? "100%":"";
    signal.style.transform = attr.shape === "rhombus"? "rotate(67.5deg) skewX(45deg) scaleY(cos(45deg))": "";
    // position
    signal.style.position = "absolute";
    signal.style.left = attr?.coords[0] + "%";
    signal.style.top = attr?.coords[1] + "%";
}

class SignalPopup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});        
        
        const attributeNames = ["shape", "border", "padding", "coords", "color", "image", "is360"];
        // Object attribute | attribute value pairs
        const attrPredefined = {
            color: "grey",
            border: "4px solid black",
            padding: "5",
            coords: "0,0",
            image: "",
            is360: "false"
        };
        // I was hoping this made passing parameters to functions easier
        const attr =
        attributeNames.reduce((ac, attrName) =>
        ({...ac, [attrName] : this.getAttribute(attrName) || attrPredefined[attrName]}),{});
        attr.coords = attr.coords.split(",");
        
        // SIGNAL
        const signal = document.createElement("span");
        signal.addEventListener("click", (e) => {this.togglePopup(e)});
        addSignalStyles(signal, attr);


        // POPUP
        const popup = document.createElement("div");
        

        this.shadowRoot.append(signal); //popup
    }

    /**
     * @returns {void}
     * @param {MouseEvent} e 
     */
    togglePopup(e) {
        // Hide current
        currPopup?.classList.remove("active");
        const relatedPopup = this.shadowRoot.querySelector("div");
        console.log(currPopup, relatedPopup)
        // If its different signal show it
        if(relatedPopup !== currPopup) {
            relatedPopup?.classList.add("active");
        }
        currPopup = relatedPopup;
    }
}

class ImageInteractive extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});


        const imageWrapper = document.createElement("div");
        imageWrapper.style.position = "relative";
        imageWrapper.style.width = "fit-content";

        // Image
        const image = document.createElement("img");
        // Relative because signal pairs will have position absolute
        image.setAttribute("src", this.getAttribute("src"));
        // Set dimensions
        if (this.hasAttribute("width")) {
            image.setAttribute("width", this.getAttribute("width"));
        }
        if (this.hasAttribute("height")) {
            image.setAttribute("height", this.getAttribute("height"));
        }
        const signals = Array.from(this.getElementsByTagName("signal-popup"));

        imageWrapper.append(image, ...signals);
        this.shadowRoot.append(imageWrapper);
    }
}

customElements.define("signal-popup", SignalPopup);
customElements.define("image-interactive", ImageInteractive);