class imageInteractive extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});

        const signalPairWrapper = document.createElement("div");
        const signalStyle = document.createElement("style");
        signalStyle.textContent = `
        .signal {
            
        }
        `


    }
}

customElements.define("image-interactive", imageInteractive);


const imagesInteractive = document.getElementsByClassName("image-interactive");
