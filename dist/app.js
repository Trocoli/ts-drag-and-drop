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
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, prople, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.prople = prople;
        this.status = status;
    }
}
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addProject(title, description, people) {
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
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
class Component {
    constructor(templateId, hostElId, insertAtStart, newElementId) {
        this.templateEl = document.getElementById(templateId);
        this.hostEl = document.getElementById(hostElId);
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtStart) {
        this.hostEl.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
    }
}
class ProjectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.element.id = `${this.type}-projects`;
        this.configure();
        this.renderContent();
    }
    renderProjects() {
        const listEl = (document.getElementById(`${this.type}-projects-list`));
        listEl.innerHTML = "";
        for (const prjItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = prjItem.title;
            listEl === null || listEl === void 0 ? void 0 : listEl.appendChild(listItem);
        }
    }
    configure() {
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter((prj) => {
                if (this.type === "active") {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + "PROJECTS";
    }
}
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.titleInputField = (this.element.querySelector("#title"));
        this.descriptionInputField = (this.element.querySelector("#description"));
        this.peopleInputField = (this.element.querySelector("#people"));
        this.configure();
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    renderContent() { }
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
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const prjInpt = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
//# sourceMappingURL=app.js.map