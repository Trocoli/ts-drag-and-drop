// autobind decorator

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// Validation
interface Validatable {
  value?: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function Validate(validatable: Validatable) {
  let isValid = true;
  if (validatable.required) {
    isValid = isValid && validatable.value?.toString().trim().length !== 0;
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

// Project list Class
class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLElement;
  constructor(private type: "active" | "finished") {
    this.templateEl = <HTMLTemplateElement>(
      document.getElementById("project-list")!
    );
    this.hostEl = <HTMLDivElement>document.getElementById("app")!;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = <HTMLElement>importedNode.firstElementChild;
    this.element.id = `${this.type}-projects`;
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + "PROJECTS";
  }

  private attach() {
    this.hostEl.insertAdjacentElement("beforeend", this.element);
  }
}

class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  titleInputField: HTMLInputElement;
  descriptionInputField: HTMLInputElement;
  peopleInputField: HTMLInputElement;

  constructor() {
    this.templateEl = <HTMLTemplateElement>(
      document.getElementById("project-input")!
    );
    this.hostEl = <HTMLDivElement>document.getElementById("app")!;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = <HTMLFormElement>importedNode.firstElementChild;

    this.element.id = "user-input";
    this.titleInputField = <HTMLInputElement>(
      this.element.querySelector("#title")
    );
    this.descriptionInputField = <HTMLInputElement>(
      this.element.querySelector("#description")
    );
    this.peopleInputField = <HTMLInputElement>(
      this.element.querySelector("#people")
    );

    this.configure();
    this.attach();
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element);
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputField.value;
    const enteredDescription = this.descriptionInputField.value;
    const enteredPeople = this.peopleInputField.value;

    if (
      !Validate({
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
      !Validate({ value: +enteredPeople, required: true, min: 0, max: 5 })
    ) {
      alert("Invalid input please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputField.value = "";
    this.descriptionInputField.value = "";
    this.peopleInputField.value = "";
  }

  @autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
}

const prjInpt = new ProjectInput();
const activePrjList = new  ProjectList('active')
const finishedPrjList = new ProjectList('finished')
