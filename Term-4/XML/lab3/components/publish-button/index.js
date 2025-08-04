export class PublishButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        document
            .getElementById("publish-button")
            .addEventListener("click", listener)
    }

    getHTML() {
        return (
            `
                <button id="publish-button" class="btn btn-primary" type="button" style = "background-color: #1faee9; border-color: #1faee9;">Создать объявление</button>
            `
        )
    }

    render(listener) {
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(listener)
    }
}