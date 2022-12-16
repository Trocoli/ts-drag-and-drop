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

// project type

enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public prople: number,
    public status: ProjectStatus
  ) {}
}
// Project State management

type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

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

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateId: string,
    hostElId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateEl = <HTMLTemplateElement>document.getElementById(templateId)!;
    this.hostEl = <T>document.getElementById(hostElId)!;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = <U>importedNode.firstElementChild;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }
  private attach(insertAtStart: boolean) {
    this.hostEl.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

// Project list Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.element.id = `${this.type}-projects`;

    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = <HTMLUListElement>(
      document.getElementById(`${this.type}-projects-list`)
    );
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl?.appendChild(listItem);
    }
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
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
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + "PROJECTS";
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputField: HTMLInputElement;
  descriptionInputField: HTMLInputElement;
  peopleInputField: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

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
  }
  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

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
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}

const prjInpt = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
