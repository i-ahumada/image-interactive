
let currPopup;
/**
 * @returns {Number}
 * @param {HTMLElement} element 
 * @param {Function} cb 
 */
function measure(element, cb) {
    let elementVisibility = element.style.visibility, elementPosition = element.style.position;
        
    element.style.visibility = 'hidden';
    element.style.position = 'absolute';
    
    document.body.appendChild(element);
    const measuredValue = cb(element);
    element.parentNode.removeChild(element);
    
    element.style.visibility = elementVisibility;
    element.style.position = elementPosition;
    return measuredValue;
}
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
    signal.style.transform = attr.shape === "rohmbus"? "rotate(67.5deg) skewX(45deg) scaleY(cos(45deg))": "";
    // position
    signal.style.position = "absolute";
    signal.style.left = attr?.coords[0] + "%";
    signal.style.top = attr?.coords[1] + "%";
}
/**
 * @returns {void}
 * @param {HTMLDivElement} popup
 * @param {HTMLSpanElement} signal 
 * @param {Object} attr
 * @param {HTMLImageElement} image 
 */
function addPopupStyles(popup, signal, attr, image) {
    const imageWidth = parseFloat(image.width);
    const imageHeight = parseFloat(image.height);
    // position
    const popUpLeft =  parseFloat(attr.coords[0]) * imageWidth/ 100 - measure(popup, (element)=>element.clientWidth) / 2;

    // rohmbus requires more space between itself and the popup
    let popUpTop;
    if (attr.position === "bottom") {
        const offset = attr.shape === "rohmbus"? 50: 40;
        popUpTop = parseFloat(attr.coords[1]) * imageHeight/ 100 + offset;
        popup.style.top = popUpTop + "px";
    } else {
        popUpTop = imageHeight - parseFloat(attr.coords[1]) * imageHeight/ 100 + 10;
        popup.style.bottom = popUpTop + "px";
    }
    console.log(popUpTop, popUpLeft)
    popup.style.zIndex = "999";
    popup.style.position = "absolute";
    popup.style.left = popUpLeft + "px";

    // font
    popup.style.fontFamily = attr.font;

    // display
    popup.style.display = "none";

    // border
    popup.style.borderRadius = "5%";
    popup.style.border = "4px solid black";

    // color
    popup.style.backgroundColor = "white";

    // padding
    popup.style.padding = "5px";
}
// /**
//  * @returns {void}
//  * @param {HTMLElement} container 
//  * @param {Object} attr
//  */
// function setUpImage360(container, attr) {
//     const config = {
//         title: "Render Arquitectura",
//         type: "equirectangular",
//         panorama: attr.image,
//         autoload: true
//     };

//     pannellum.viewer(container, config);
// }
class SignalPopup extends HTMLElement {
    constructor(parentImage) {
        super();
        this.attachShadow({mode: "open"});        
        
        // Object attribute | attribute value pairs
        const attrPredefined = {
            shape: "",
            color: "grey",
            border: "true",
            padding: "5",
            coords: "0,0",
            title: "",
            description: "",
            image: "",
            is360: "false",
            height: "",
            width: "",
            textwidth: "",
            font: "Sans-serif",
            position: "bottom"
        };
        const attributeNames = Object.getOwnPropertyNames(attrPredefined);
        // I was hoping this made passing parameters to functions easier
        const attr =
        attributeNames.reduce((ac, attrName) =>
            ({...ac, [attrName] : this.getAttribute(attrName) || attrPredefined[attrName]}),{});
        attr.coords = attr.coords?.split(",");
        
        // POPUP
        const popup = document.createElement("div");
        // if (attr.is360 === "true") {
        //     popup.style.height = attr.height + "px";
        //     popup.style.width = attr.width + "px";
        // } else 
        
        if (this.innerHTML === "") {
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
            attr.textwidth !== ""? text.style.maxWidth = attr.textwidth + "px": null;
            attr.textwidth !== ""? text.style.width = attr.textwidth + "px": null;
            text.append(title, description);
            
            // Image
            const image = document.createElement("img");
            attr.image !== ""? image.setAttribute("src", attr.image): null;
            attr.width !== ""? image.setAttribute("width", attr.width): null;
            attr.height !== ""? image.setAttribute("height", attr.height): null;
            
            // Container
            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.flexDirection = "row";
            container.style.gap = "10px";
            container.append(text, image);
            
            // Append all to popup
            popup.append(container);
        } else {
            popup.innerHTML = this.innerHTML;
            this.innerHTML = "";
        }

        // SIGNAL
        const signal = document.createElement("span");
        signal.addEventListener("click", (e) => {this.togglePopup(e)});
        addSignalStyles(signal, attr);
        
        this.shadowRoot.append(signal);
        addPopupStyles(popup, signal, attr, this.parentElement.children[0]);
        this.shadowRoot.append(popup);
    }
    
    /**
     * @returns {void}
     * @param {MouseEvent} e 
     */
    togglePopup(e) {
        const relatedPopup = this.shadowRoot.querySelector("div");
        // Hide current
        if (typeof(currPopup) === typeof(relatedPopup)) {
            currPopup.style.display = "none";
        }

        // If its different signal show it
        if(relatedPopup !== currPopup) {
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

customElements.define("image-interactive", ImageInteractive);
customElements.define("signal-popup", SignalPopup);