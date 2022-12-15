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

  private submitHandler(e: Event) {
    e.preventDefault();
    console.log(this.titleInputField.value);
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler.bind(this));
  }
}

const prjInpt = new ProjectInput();
