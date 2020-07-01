
const DEFAULT_PROPS = {
    SPEED: 3,
    MODE: "MODE_ALTERNATE"
}
class CarouselComponent extends HTMLElement {
    constructor() {
        super();
        const style = document.createElement('style');
        this.direction = 1;
        style.innerHTML = `
            .carouselWrapper {
                display: flex;
                margin: 0 auto;
                flex-wrap: nowrap;
                overflow-x: auto;
                scrollbar-width: 0;
                -ms-scroll-snap-type: x mandatory;
                scroll-snap-type: x mandatory;
                scroll-behavior: smooth;
                -ms-overflow-style: none;
                overflow: -moz-scrollbars-none;
                scrollbar-color: transparent transparent;
            }
            .carouselWrapper::-webkit-scrollbar {
                display: none
            }
            .carouselWrapper div {
                flex: 0 0 100%;
                scroll-snap-align: center;
                width: 100vw;
            }
        `;
        document.head.appendChild(style);
    }

    extractOptions() {
        this.mode = this.getAttribute("mode") || DEFAULT_PROPS.MODE;
        this.speed = (+this.getAttribute("speed") || DEFAULT_PROPS.SPEED) * 1000;
        this.templateId = this.getAttribute("template-id");
    }
    infinite() {
        const firstCarouselItem = this.carouselContainerElement.children[0];
        if (
            this.carouselContainerElement.scrollLeft >=
            (this.numberOfCarouselItems - 1) * this.carouselItemWidth
        ) {
            firstCarouselItem.style.order =
                +firstCarouselItem.style.order === 0 ? 1 : 0;
        }
    }
    alternate() {
        if (this.carouselContainerElement.scrollLeft >= (this.numberOfCarouselItems - 1) * this.carouselItemWidth) {
            this.direction = -1;
        }
        if (this.carouselContainerElement.scrollLeft === 0) {
            this.direction = 1;
        }
    }

    restart() {
        if (this.carouselContainerElement.scrollLeft >= (this.numberOfCarouselItems - 1) * this.carouselItemWidth) {
            setTimeout(() => {
                this.carouselContainerElement.scrollTo(0, 0);
            }, this.speed / 2);
        }
    }
    connectedCallback() {
        this.extractOptions();
        let template = document.getElementById(this.templateId);
        let templateContent = template.content.cloneNode(true);
        this.numberOfCarouselItems = templateContent.children.length;
        this.innerHTML = `
        <div class="carouselWrapper"></div>
        `;
        this.carouselContainerElement = this.querySelector('.carouselWrapper');
        this.carouselContainerElement.append(templateContent);
        this.appendChild(this.carouselContainerElement);
        if (this.numberOfCarouselItems > 1) {
            setInterval(() => {
                this.carouselItemWidth =
                    this.carouselContainerElement.scrollWidth / this.numberOfCarouselItems;
                this.carouselContainerElement.scrollBy(this.direction * this.carouselItemWidth, 0);
                const timeoutId = setTimeout(() => {
                    switch (this.mode) {
                        case "MODE_INFINITE":
                            this.infinite();
                            break;
                        case "MODE_ALTERNATE":
                            this.alternate();
                            break;
                        case "MODE_RESTART":
                            this.restart();
                            break;
                    }
                    clearTimeout(timeoutId);
                }, this.speed / 2);
            }, this.speed);
        }
    }
}

customElements.define("carousel-component", CarouselComponent)