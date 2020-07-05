import "./styles.scss";

const DEFAULT_PROPS = {
    SPEED: 3,
    MODE: "MODE_ALTERNATE",
}
class CarouselComponent extends HTMLElement {
    constructor() {
        super();
        this.options = {};
        this.direction = 1;
    }

    extractOptions() {
        this.options.mode = this.getAttribute("mode") || DEFAULT_PROPS.MODE;
        this.options.speed = (+this.getAttribute("speed") || DEFAULT_PROPS.SPEED) * 1000;
        this.options.templateId = this.getAttribute("template-id");
    }
    infinite() {
        const firstCarouselItem = this.carouselContainerElement.querySelector('.carouselItem');
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
        let template = document.getElementById(this.options.templateId);
        let templateContent = template.content.cloneNode(true);
        this.numberOfCarouselItems = templateContent.children.length;
        this.innerHTML = `
            <div class="carouselWrapper">
                <div class="carouselContainer">
                    <button
                        aria-label="Show previous"
                        class="button is-text carouselControl carouselControlPrev"
                    ></button>
                    <button
                        aria-label="Show next"
                        class="button is-text carouselControl carouselControlNext"
                    ></button>
                </div>
            </div>
        `;
        this.carouselWrapperElement = this.querySelector('.carouselWrapper');
        this.carouselContainerElement = this.querySelector('.carouselContainer');
        this.carouselContainerElement.prepend(templateContent);
        this.appendChild(this.carouselWrapperElement);
        if (this.numberOfCarouselItems > 1) {
            setInterval(() => {
                this.carouselItemWidth =
                    this.carouselContainerElement.scrollWidth / this.numberOfCarouselItems;
                this.carouselContainerElement.scrollBy(this.direction * this.carouselItemWidth, 0);
                const timeoutId = setTimeout(() => {
                    switch (this.options.mode) {
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
                }, this.options.speed / 2);
            }, this.options.speed);
        }
    }
}

customElements.define("carousel-component", CarouselComponent)