"use strict";
class ProjectInput {
    constructor() {
        this.templateEl = (document.getElementById("project-input"));
        this.hostEl = document.getElementById("app");
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        this.titleInputField = (this.element.querySelector("#title"));
        this.descriptionInputField = (this.element.querySelector("#description"));
        this.peopleInputField = (this.element.querySelector("#people"));
        this.configure();
        this.attach();
    }
    attach() {
        this.hostEl.insertAdjacentElement("afterbegin", this.element);
    }
    submitHandler(e) {
        e.preventDefault();
        console.log(this.titleInputField.value);
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    }
}
const prjInpt = new ProjectInput();
//# sourceMappingURL=app.js.map