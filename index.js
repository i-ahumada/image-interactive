
let currPopup;
/**
 * @returns {void}
 * @param {HTMLSpanElement} signal 
 * @param {Object} attr 
 */
function addSignalStyles(signal, { color, signalsize, border, shape, coords, icon }) {
    // cursor
    signal.style.cursor = "pointer";
    // background
    if (icon === "") {
        signal.style.backgroundColor = color;
    } else {
        signal.style.backgroundImage = "url(\"" + icon + "\")";
        signal.style.backgroundSize = "cover";
        signal.style.backgroundRepeat = "no-repeat";
    }
    // padding
    signal.style.padding = signalsize + "px";
    // border
    signal.style.border = border === "false" ? "none" : "4px solid black";
    // shape
    signal.style.borderRadius = shape === "circle" ? "100%" : "";
    signal.style.transform = shape === "rohmbus" ? "rotate(67.5deg) skewX(45deg) scaleY(cos(45deg))" : "";
    // position
    signal.style.position = "absolute";
    signal.style.left = coords[0] + "%";
    signal.style.top = coords[1] + "%";
}
/**
 * @returns {void}
 * @param {HTMLDivElement} popup
 * @param {HTMLSpanElement} signal 
 * @param {Object} attr
 * @param {HTMLImageElement} parentImage 
 */
function addPopupStyles(popup, parentImage, { coords, position, shape, font, padding, signalsize }) {
    const imageWidth = parseFloat(parentImage.width);
    const imageHeight = parseFloat(parentImage.height);
    // position
    popup.style.transform = "translateX(-50%)";
    const popUpLeft = parseFloat(coords[0]) + parseInt(signalsize) * 200 / imageWidth;

    // rohmbus requires more space between itself and the popup
    let popUpTop;
    if (position === "bottom") {
        const offset = shape === "rohmbus" ? parseInt(signalsize) * 3 : parseInt(signalsize) * 2;
        popUpTop = parseFloat(coords[1]) + (20 + offset) * 100 / imageHeight;
        popup.style.top = popUpTop + "%";
    } else {
        popUpTop = (imageHeight + parseInt(signalsize) * 2) * 100 / imageHeight - parseFloat(coords[1]);
        popup.style.bottom = popUpTop + "%";
    }
    // position
    popup.style.zIndex = "999";
    popup.style.position = "absolute";
    popup.style.left = popUpLeft + "%";

    // font
    popup.style.fontFamily = font;

    // display
    popup.style.display = "none";

    // border
    popup.style.borderRadius = "5%";
    popup.style.border = "4px solid black";

    // color
    popup.style.backgroundColor = "white";

    // padding
    popup.style.padding = padding + "px";
}
/**
 * @returns {HTMLIFrameElement}
 * @param {HTMLElement} container 
 * @param {Object} attr
 */
function setUpImage360({ image, height, width }) {
    const iframe360 = document.createElement("iframe");
    iframe360.setAttribute("src", image);
    iframe360.setAttribute("height", height);
    iframe360.setAttribute("width", width);
    iframe360.setAttribute("allowfullscreen", "true");
    return iframe360;
}
class SignalPopup extends HTMLElement {
    constructor() {
        super();

        // Object attribute | attribute value pairs
        const attrPredefined = {
            shape: "",
            color: "grey",
            border: "true",
            signalsize: "5",
            coords: "0,0",
            title: "",
            description: "",
            image: "",
            is360: "false",
            height: "",
            width: "",
            textwidth: "",
            font: "Sans-serif",
            position: "bottom",
            padding: "5",
            icon: ""
        };
        const attributeNames = Object.getOwnPropertyNames(attrPredefined);
        // I was hoping this made passing parameters to functions easier
        const attr =
            attributeNames.reduce((ac, attrName) =>
                ({ ...ac, [attrName]: this.getAttribute(attrName) || attrPredefined[attrName] }), {});
        attr.coords = attr.coords?.split(",");

        // POPUP
        const popup = document.createElement("div");
        popup.classList.add("popup");

        if (this.childNodes.length !== 0) {
            popup.innerHTML = this.innerHTML;
            this.innerHTML = "";
        } else if (attr.is360 === "true") {
            popup.style.height = attr.height + "px";
            popup.style.width = attr.width + "px";
            popup.style.overflow = "hidden";
            popup.append(setUpImage360(attr));
        } else {
            // Text elements of popup
            const title = document.createElement("h4");
            title.innerText = attr.title;
            title.style.marginTop = "0px"

            const description = document.createElement("p");
            description.innerText = attr.description;
            description.style.marginBottom = "0px";

            const text = document.createElement("div");
            text.style.display = "flex";
            text.style.flexDirection = "column";
            attr.textwidth !== "" ? text.style.maxWidth = attr.textwidth + "px" : null;
            attr.textwidth !== "" ? text.style.width = attr.textwidth + "px" : null;
            text.append(title, description);

            // Image
            const image = document.createElement("img");
            attr.image !== "" ? image.setAttribute("src", attr.image) : null;
            attr.width !== "" ? image.setAttribute("width", attr.width) : null;
            attr.height !== "" ? image.setAttribute("height", attr.height) : null;

            // Container
            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.flexDirection = "row";
            container.style.gap = "10px";
            container.append(text, image);

            // Append all to popup
            popup.append(container);
        }

        // SIGNAL
        const signal = document.createElement("span");
        signal.classList.add("signal");

        signal.addEventListener("click", (e) => { this.togglePopup(e) });
        addSignalStyles(signal, attr);

        this.appendChild(signal);
        addPopupStyles(popup, this.parentElement.children[0], attr);
        this.appendChild(popup);
    }

    /**
     * @returns {void}
     * @param {MouseEvent} e 
     */
    togglePopup(e) {
        const relatedPopup = this.querySelector("div");
        // Hide current
        if (typeof (currPopup) === typeof (relatedPopup)) {
            currPopup.style.display = "none";
        }

        // If its different signal show it
        if (relatedPopup !== currPopup) {
            relatedPopup.style.display = "block";
            currPopup = relatedPopup;
        } else {
            currPopup = undefined;
        }
    }
}

class ImageInteractive extends HTMLElement {
    constructor() {
        super();

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
        image.setAttribute("draggable", false);
        image.style.userSelect = "none";

        const signals = Array.from(this.getElementsByTagName("signal-popup"));
        imageWrapper.append(image, ...signals);

        this.appendChild(imageWrapper);
    }
}

customElements.define("image-interactive", ImageInteractive);
customElements.define("signal-popup", SignalPopup);