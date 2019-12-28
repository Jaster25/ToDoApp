const toDoForm = document.querySelector(".js-toDoForm");
const toDoAddBtn = document.querySelector(".js-toDoAddBtn");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.querySelector(".js-toDoList");
const toDoInitial = document.querySelector(".js-toDoInitial");

const TODO_LS = "toDos";
let toDos = [];

function saveToDos() {
  localStorage.setItem(TODO_LS, JSON.stringify(toDos));
}

function submitHandler(event) {
  event.preventDefault();
  const currentValue = toDoInput.value;

  if (currentValue !== "") {
    paintToDo(currentValue, false);
    toDoInput.value = "";
    toDoInitial.innerText = "";
    saveToDos();
  }
}

function deleteToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  toDoList.removeChild(li);

  const cleanedToDos = toDos.filter(function(toDo) {
    return toDo.id !== parseInt(li.id);
  });

  toDos = cleanedToDos;
  saveToDos();

  if (toDos.length === 0) {
    toDoInitial.innerText = "Make your List";
  }
}

function checkToDo(event) {
  const li = event.target.parentNode;
  const btn = li.querySelector(".checkBtn");
  const id = li.id;

  let isDone = toDos[parseInt(id) - 1].done;
  isDone = isDone ? false : true;

  if (isDone) {
    btn.style.backgroundImage = "url('images/checkedBox.png')";
  } else {
    btn.style.backgroundImage = "url('images/box.png')";
  }

  toDos[parseInt(id) - 1].done = isDone;

  saveToDos();
}

function paintToDo(text, check) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const checkBtn = document.createElement("button");
  checkBtn.className = "checkBtn";
  const span = document.createElement("span");
  const newId = toDos.length + 1;

  delBtn.style.backgroundImage = "url('images/cancel.png')";
  if (check) {
    checkBtn.style.backgroundImage = "url('images/checkedBox.png')";
  } else {
    checkBtn.style.backgroundImage = "url('images/box.png')";
  }

  checkBtn.addEventListener("click", checkToDo);
  delBtn.addEventListener("click", deleteToDo);

  span.innerText = text;
  li.id = newId;
  li.done = check;
  li.appendChild(checkBtn);
  li.appendChild(span);
  li.appendChild(delBtn);
  toDoList.appendChild(li);

  const toDoObj = {
    text: text,
    done: check,
    id: newId
  };

  toDos.push(toDoObj);
  saveToDos();
}

function loadToDos() {
  const loadedToDos = localStorage.getItem(TODO_LS);
  if (loadedToDos !== null) {
    const parsedToDos = JSON.parse(loadedToDos);
    parsedToDos.forEach(function(toDo) {
      paintToDo(toDo.text, toDo.done);
    });

    if (toDos.length === 0) {
      toDoInitial.innerText = "Make your List";
    } else {
      toDoInitial.innerText = "";
    }
  } else {
    toDoInitial.innerText = "Make your List";
  }
}

function init() {
  loadToDos();
  toDoForm.addEventListener("submit", submitHandler);
  toDoAddBtn.addEventListener("submit", submitHandler);
}

init();
