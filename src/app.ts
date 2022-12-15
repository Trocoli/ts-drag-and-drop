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

  private gatherUserInput(): [string, string, number] | void{
    const enteredTitle = this.titleInputField.value;
    const enteredDescription = this.descriptionInputField.value;
    const enteredPeople = this.peopleInputField.value;

    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
    ) {
      alert('Invalid input please try again!');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() { 
    this.titleInputField.value = '';
    this.descriptionInputField.value = '';
    this.peopleInputField.value = '';
  }

  @autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people)
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
}

const prjInpt = new ProjectInput();
