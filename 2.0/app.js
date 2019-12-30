const form = document.querySelector(".formAdder");
const input = form.querySelector("input");
const list = document.querySelector(".list");

// const spanItems

const btnAll = document.querySelector(".btnAll");
const btnActive = document.querySelector(".btnActive");
const btnCompleted = document.querySelector(".btnCompleted");

const btnClearCompleted = document.querySelector(".btnClearCompleted");

const TODOS_LS = "toDos";
let MODE = "";
let toDos = [];

const saveToDos = () => {
  localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
};

const paintToDo = toDo => {
  const li = document.createElement("li");
  const btnCheck = document.createElement("button");
  const btnDelete = document.createElement("button");
  const span = document.createElement("span");

  span.className = "span";
  span.innerText = toDo.text;
  btnCheck.className = "btnCheck";
  btnDelete.className = "btnDelete";

  if (toDo.check) {
    btnCheck.style.background = 'url("images/checked.png")';
    span.style.color = "rgb(201, 202, 202)";
    span.style.textDecoration = "line-through";
  } else {
    btnCheck.style.background = 'url("images/noChecked.png")';
  }
  btnCheck.style.backgroundSize = "100%,100%";

  btnCheck.addEventListener("click", handleCheck);
  btnDelete.addEventListener("click", handleDelete);

  li.id = toDo.id;
  li.appendChild(btnCheck);
  li.appendChild(span);
  li.appendChild(btnDelete);
  list.appendChild(li);
};

const modeOn = mode => {
  MODE = mode;
  let btnMode;
  if (mode === "All") {
    btnMode = btnAll;
    toDos.forEach(toDo => {
      paintToDo(toDo);
    });
  } else if (mode === "Active") {
    btnMode = btnActive;
    toDos.forEach(toDo => {
      if (!toDo.check) paintToDo(toDo);
    });
  } else {
    btnMode = btnCompleted;
    toDos.forEach(toDo => {
      if (toDo.check) paintToDo(toDo);
    });
  }
  btnMode.style.border = "1px solid #dddddd";
};

const modeOff = mode => {
  while (list.childNodes.length-- !== 0) {
    list.removeChild(list.childNodes[0]);
  }

  let btnMode;
  if (mode === "All") {
    btnMode = btnAll;
  } else if (mode === "Active") {
    btnMode = btnActive;
  } else {
    btnMode = btnCompleted;
  }

  btnMode.style.border = "0px solid #dddddd";
};

const changeMode = newMode => {
  modeOff(MODE);
  modeOn(newMode);
};

const handleBtnAll = event => {
  changeMode("All");
};
const handleBtnActive = event => {
  changeMode("Active");
};
const handleBtnCompleted = event => {
  changeMode("Completed");
};

btnAll.addEventListener("click", handleBtnAll);
btnActive.addEventListener("click", handleBtnActive);
btnCompleted.addEventListener("click", handleBtnCompleted);

const loadToDos = () => {
  const loadedToDos = JSON.parse(localStorage.getItem(TODOS_LS));
  if (loadedToDos !== null && loadedToDos.length !== 0) {
    loadedToDos.forEach(toDo => {
      const toDoObj = {
        text: toDo.text,
        check: toDo.check,
        id: toDos.length
      };
      toDos.push(toDoObj);
    });
  }
};

const handleSubmit = event => {
  event.preventDefault();
  const currentValue = input.value;
  if (currentValue !== "") {
    const toDoObj = {
      text: currentValue,
      check: false,
      id: toDos.length
    };

    if (MODE === "All" || MODE === "Active") {
      paintToDo(toDoObj);
    }
    toDos.push(toDoObj);
    saveToDos();
  }
  input.value = "";
};

const handleDelete = event => {
  event.preventDefault();
  const li = event.target.parentNode;
  const id = parseInt(li.id);
  list.removeChild(li);

  const cleanedToDos = toDos.filter(toDo => {
    return id !== toDo.id;
  });
  toDos = cleanedToDos;

  for (let i = id; i < toDos.length; ++i) {
    toDos[i].id--;
  }
  for (let i = 0; i < list.childNodes.length; ++i) {
    if (id <= list.childNodes[i].id) {
      list.childNodes[i].id--;
    }
  }

  saveToDos();
};

const handleCheck = event => {
  event.preventDefault();
  const li = event.target.parentNode;
  const id = parseInt(li.id);
  const span = li.querySelector("span");
  const btnCheck = li.querySelector(".btnCheck");

  const newCheck = !toDos[id].check;
  toDos[id].check = newCheck;
  li.id = id;

  if (MODE !== "All") {
    list.removeChild(li);
  } else if (newCheck) {
    btnCheck.style.background = 'url("images/checked.png")';
    btnCheck.style.backgroundSize = "100%,100%";
    span.style.color = "rgb(201, 202, 202)";
    span.style.textDecoration = "line-through";
  } else {
    btnCheck.style.background = 'url("images/noChecked.png")';
    btnCheck.style.backgroundSize = "100%,100%";
    span.style.color = "rgb(142,142,142)";
    span.style.textDecoration = "none";
  }

  saveToDos();
};

function init() {
  loadToDos();
  modeOn("All");
  form.addEventListener("submit", handleSubmit);
}

init();
