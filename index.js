import "./styles.scss";

const DEFAULT_PROPS = {
    SPEED: 3,
    MODE: "MODE_ALTERNATE",
}
let index = 0;
class CarouselComponent extends HTMLElement {
    constructor() {
        super();
        this.options = {};
        this.direction = 1;
        window.onfocus = () => {
            this.startCarousel();
        }

        window.onblur = () => {
            this.stopCarousel();
        }
    }

    extractOptions() {
        this.options.mode = this.getAttribute("mode") || DEFAULT_PROPS.MODE;
        this.options.speed = (+this.getAttribute("speed") || DEFAULT_PROPS.SPEED) * 1000;
        this.options.templateId = this.getAttribute("template-id");
    }
    infinite() {
        index = index % this.numberOfCarouselItems;
        let childToMove = this.carouselContainerElement.querySelectorAll(`.carouselItem`)[index];
        childToMove.style.order = childToMove.style.order && childToMove.style.order === 0 ? 1 : +childToMove.style.order + 1;
        index++;
    }
    alternate() {
        if (
            this.carouselContainerElement.scrollWidth - this.carouselContainerElement.scrollLeft <
            2 * this.carouselItemWidth
        ) {
            this.direction = -1;
        }
        if (this.carouselContainerElement.scrollLeft === 0) {
            this.direction = 1;
        }
    }

    restart() {
        if (
            this.carouselContainerElement.scrollWidth - this.carouselContainerElement.scrollLeft <
            2 * this.carouselItemWidth
        ) {
            setTimeout(() => {
                this.carouselContainerElement.scrollTo(0, 0);
            }, this.speed / 2);
        }
    }

    startCarousel() {
        if (this.numberOfCarouselItems <= 1) {
            return;
        }
        this.carouselIntervalId = setInterval(() => {
            this.carouselItemWidth =
                this.carouselContainerElement.scrollWidth / this.numberOfCarouselItems;
            this.carouselContainerElement.scrollBy(this.direction * this.carouselItemWidth, 0);
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
        }, this.options.speed);
    }

    stopCarousel() {
        clearInterval(this.carouselIntervalId);
    }

    connectedCallback() {
        this.extractOptions();
        this.numberOfCarouselItems = this.children.length;
        const childNodes = [...this.childNodes];
        this.innerHTML = `
            <div class="carouselWrapper">
                <button
                    aria-label="Show previous"
                    class="button is-text carouselControl carouselControlPrev"
                ></button>
                <button
                    aria-label="Show next"
                    class="button is-text carouselControl carouselControlNext"
                ></button>
                <div class="carouselContainer">
                </div>
            </div>
        `;
        this.carouselWrapperElement = this.querySelector('.carouselWrapper');
        this.carouselContainerElement = this.querySelector('.carouselContainer');
        this.appendChild(this.carouselWrapperElement);
        this.querySelector(".carouselControlNext").addEventListener("click", () => {
            this.carouselContainerElement.scrollBy(this.carouselItemWidth, 0);
        });
        this.querySelector(".carouselControlPrev").addEventListener("click", () => {
            this.carouselContainerElement.scrollBy(-this.carouselItemWidth, 0);
        });
        for (var i = 0; i < childNodes.length; i++) {
            this.carouselContainerElement.appendChild(childNodes[i])
        }
        this.startCarousel();
    }
}

customElements.define("carousel-component", CarouselComponent)