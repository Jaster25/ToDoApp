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
  const btnCheck = document.createElement("button");
  const btnDelete = document.createElement("button");
  const span = document.createElement("span");

  span.className = "span";
  span.innerText = TEXT;
  btnCheck.className = "btnCheck";
  btnDelete.className = "btnDelete";

  if (CHECK) {
    btnCheck.style.background = 'url("images/checked.png")';
    span.style.color = "rgb(201, 202, 202)";
    span.style.textDecoration = "line-through";
  } else {
    btnCheck.style.background = 'url("images/noChecked.png")';
  }
  btnCheck.style.backgroundSize = "100%,100%";

  btnCheck.addEventListener("click", handleCheck);
  btnDelete.addEventListener("click", handleDelete);

  li.id = toDos.length + 1;
  li.appendChild(btnCheck);
  li.appendChild(span);
  li.appendChild(btnDelete);

  const toDoObj = {
    text: TEXT,
    check: CHECK,
    id: toDos.length + 1
  };

  list.appendChild(li);
  toDos.push(toDoObj);
};

const loadToDos = () => {
  const loadedToDos = JSON.parse(localStorage.getItem(TODOS_LS));
  if (loadedToDos !== null && loadedToDos.length !== 0) {
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

const handleDelete = event => {
  event.preventDefault();
  const li = event.target.parentNode;
  list.removeChild(li);

  const cleanedToDos = toDos.filter(toDo => {
    return parseInt(li.id) !== toDo.id;
  });
  toDos = cleanedToDos;
  for (let i = parseInt(li.id) - 1; i < toDos.length; ++i) {
    toDos[i].id--;
    list.childNodes[i].id--;
  }

  saveToDos();
};

const handleCheck = event => {
  event.preventDefault();
  const li = event.target.parentNode;
  const span = li.querySelector("span");
  const btnCheck = li.querySelector(".btnCheck");

  const newCheck = !toDos[parseInt(li.id) - 1].check;
  toDos[parseInt(li.id) - 1].check = newCheck;

  if (newCheck) {
    btnCheck.style.background = 'url("images/checked.png")';
    span.style.color = "rgb(201, 202, 202)";
    span.style.textDecoration = "line-through";
  } else {
    btnCheck.style.background = 'url("images/noChecked.png")';
    span.style.color = "rgb(142,142,142)";
    span.style.textDecoration = "none";
  }
  btnCheck.style.backgroundSize = "100%,100%";

  saveToDos();
};

function init() {
  loadToDos();
  // console.log(list);
  // console.log(list.childNodes[2]);
  // console.log(list.childNodes.length);

  form.addEventListener("submit", handleSubmit);
}

init();
