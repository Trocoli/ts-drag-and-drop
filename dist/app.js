"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
function Validate(validatable) {
    var _a;
    let isValid = true;
    if (validatable.required) {
        isValid = isValid && ((_a = validatable.value) === null || _a === void 0 ? void 0 : _a.toString().trim().length) !== 0;
    }
    if (validatable.minLength != null && typeof validatable.value === "string") {
        isValid = isValid && validatable.value.length > validatable.minLength;
    }
    if (validatable.maxLength != null && typeof validatable.value === "string") {
        isValid = isValid && validatable.value.length < validatable.maxLength;
    }
    if (validatable.min != null && typeof validatable.value === "number") {
        isValid = isValid && validatable.value > validatable.min;
    }
    if (validatable.max != null && typeof validatable.value === "number") {
        isValid = isValid && validatable.value < validatable.max;
    }
    return isValid;
}
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateEl = (document.getElementById("project-list"));
        this.hostEl = document.getElementById("app");
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        this.attach();
        this.renderContent();
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + "PROJECTS";
    }
    attach() {
        this.hostEl.insertAdjacentElement("beforeend", this.element);
    }
}
class ProjectInput {
    constructor() {
        this.templateEl = (document.getElementById("project-input"));
        this.hostEl = document.getElementById("app");
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        this.titleInputField = (this.element.querySelector("#title"));
        this.descriptionInputField = (this.element.querySelector("#description"));
        this.peopleInputField = (this.element.querySelector("#people"));
        this.configure();
        this.attach();
    }
    attach() {
        this.hostEl.insertAdjacentElement("afterbegin", this.element);
    }
    gatherUserInput() {
        const enteredTitle = this.titleInputField.value;
        const enteredDescription = this.descriptionInputField.value;
        const enteredPeople = this.peopleInputField.value;
        if (!Validate({
            value: enteredTitle,
            required: true,
            minLength: 5,
            maxLength: 15,
        }) ||
            !Validate({
                value: enteredDescription,
                required: true,
                minLength: 5,
                maxLength: 15,
            }) ||
            !Validate({ value: +enteredPeople, required: true, min: 0, max: 5 })) {
            alert("Invalid input please try again!");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    clearInputs() {
        this.titleInputField.value = "";
        this.descriptionInputField.value = "";
        this.peopleInputField.value = "";
    }
    submitHandler(e) {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const prjInpt = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
//# sourceMappingURL=app.js.map