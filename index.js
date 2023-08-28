/**
 * @return {string}
 * @param {string} shape
 * @param {string} color
 * @param {boolean} border
 * @param {string} padding
 */
function defineSignalStyle(shape="square", color="white", border=true, padding="5") {
    let style = `
        span {
            padding: ${padding}px;
            background-color: ${color};
    `
    switch (shape) {
        case "circle":
            style += "border-radius=100%;"
            break;
        case "rhombus":
            style += "transform: rotate(67.5deg) skewX(45deg) scaleY(cos(45deg));";
            break;
    }

    style += "}";

    return style;
}

class SignalPair extends HTMLElement {
    constructor() {
        super();
        const attributeNames = this.getAttributeNames();
        // Object attribute | attribute value pairs
        // I was hoping this made passing parameters to functions easier
        const attributeObject = attributeNames.reduce((ac, key) => ({...ac, key: this.getAttribute(key)}),{});

        this.attachShadow({mode: "open"});

        // Signal
        const signal = document.createElement("div");
        this.addEventListener("click", (e) => {
            // Hide current
            const currPopup = this.querySelector(".active");
            currPopup?.classList.remove("active");

            const relatedPopup = e.target.children[1];
            // If its different signal show it
            if(relatedPopup !== currPopup) {
                relatedPopup.classList.add("active");
            }
        })

        // style
        const signalStyle = defineSignalStyle();
        const style = document.createElement("style");

        // popup
        style.textContent = signalStyle + popupStyle;
        this.shadowRoot.append(style, signal, popup);
    }
}

class ImageInteractive extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});

        // Image
        const imageWrapper = document.createElement("img");
        // Relative because signal pairs will have position absolute
        imageWrapper.style.position = "relative";

        imageWrapper.setAttribute("src", this.getAttribute("src"));
        // Set dimensions
        if (this.hasAttribute("width")) {
            imageWrapper.setAttribute("width", this.getAttribute("width"));
        }
        if (this.hasAttribute("height")) {
            imageWrapper.setAttribute("height", this.getAttribute("height"));
        }

        this.shadowRoot.append(imageWrapper);
    }
}

customElements.define("image-interactive", ImageInteractive);
customElements.define("signal-pair", SignalPair);