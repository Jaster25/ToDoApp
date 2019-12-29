const form = document.querySelector(".formAdder");
const input = form.querySelector("input");
const list = document.querySelector(".list");

const TODOS_LS = "toDos";
let toDos = [];

const saveToDos = () => {
  localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
};

const paintToDo = (TEXT, CHECK) => {
  const li = document.createElement("li");
  const divBtnCheck = document.createElement("div");
  const divBtnDelete = document.createElement("div");
  const divSpan = document.createElement("div");
  const btnCheck = document.createElement("button");
  const btnDelete = document.createElement("button");
  const span = document.createElement("span");

  divBtnCheck.className = "divBtn";
  divBtnDelete.className = "divBtn";
  divSpan.className = "divSpan";
  btnCheck.className = "btnCheck";
  btnDelete.className = "btnDelete";
  span.innerText = TEXT;

  divBtnCheck.appendChild(btnCheck);
  divSpan.appendChild(span);
  divBtnDelete.appendChild(btnDelete);
  li.appendChild(divBtnCheck);
  li.appendChild(divSpan);
  li.appendChild(divBtnDelete);

  const toDoObj = {
    text: TEXT,
    check: CHECK,
    id: toDos.length + 1
  };

  list.insertBefore(li, list.childNodes[0]);
  toDos.push(toDoObj);
};

const loadToDos = () => {
  const loadedToDos = JSON.parse(localStorage.getItem(TODOS_LS));
  if (loadedToDos === null || loadedToDos.length === 0) {
  } else {
    loadedToDos.forEach(toDo => {
      paintToDo(toDo.text, toDo.check);
    });
  }
};

const handleSubmit = event => {
  event.preventDefault();
  const currentValue = input.value;
  if (currentValue !== "") {
    paintToDo(currentValue, false);
    saveToDos();
  }
  input.value = "";
};

function init() {
  loadToDos();
  form.addEventListener("submit", handleSubmit);
}

init();
