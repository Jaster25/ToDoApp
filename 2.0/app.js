const form = document.querySelector(".formAdder");
const input = form.querySelector("input");
const list = document.querySelector(".list");
const spanCount = document.querySelector(".itemsCount");
const btnAll = document.querySelector(".btnAll");
const btnActive = document.querySelector(".btnActive");
const btnCompleted = document.querySelector(".btnCompleted");
const btnClearCompleted = document.querySelector(".btnClear");
const btnFold = document.querySelector(".btnFold");

const TODOS_LS = "toDos";
let MODE = "";
let FOLD = true;
let toDos = [];

const saveToDos = () => {
  localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
};

const updateCount = () => {
  if (toDos.length === 0) {
    spanCount.innerText = "Empty";
  } else if (toDos.length == 1) {
    spanCount.innerText = "1 item left";
  } else {
    spanCount.innerText = toDos.length + " items left";
  }
};

const allowDrop = event => {
  event.preventDefault();
};

const drag = event => {
  event.dataTransfer.setData("text", event.target.id);
};

const drop = event => {
  event.preventDefault();
  const dragId = parseInt(event.dataTransfer.getData("text"));
  let dropId;
  let dropZone = event.target;
  while (dropZone.tagName !== "LI") {
    dropZone = dropZone.parentNode;
  }
  dropId = parseInt(dropZone.id);
  if (dragId === dropId) return;

  const dragToDo = toDos.splice(dragId, 1)[0];
  toDos.splice(dropId, 0, dragToDo);
  if (dragId < dropId) {
    for (let i = dragId; i < dropId; ++i) {
      toDos[i].id = parseInt(toDos[i].id) - 1;
    }
  } else {
    for (let i = dragId; i > dropId; --i) {
      toDos[i].id = parseInt(toDos[i].id) + 1;
    }
  }
  toDos[dropId].id = dropId;

  changeMode(MODE, MODE);
  saveToDos();
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
  li.addEventListener("mouseenter", handleBtnDelAppear);
  li.addEventListener("mouseleave", handleBtnDelDisappear);

  li.draggable = true;
  li.ondrop = drop;
  li.ondragover = allowDrop;
  li.ondragstart = drag;
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
  updateCount();
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
  for (let i = id; i < toDos.length; ++i) toDos[i].id--;
  for (let i = 0; i < list.childNodes.length; ++i) {
    if (id <= list.childNodes[i].id) {
      list.childNodes[i].id--;
    }
  }

  saveToDos();
  updateCount();
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

const handleBtnClear = event => {
  event.preventDefault();

  const cleanedToDos = toDos.filter(toDo => {
    return !toDo.check;
  });
  toDos = cleanedToDos;
  for (let i = 0; i < toDos.length; ++i) toDos[i].id = i;

  changeMode(MODE);
  saveToDos();
  updateCount();
};

const handleBtnFold = event => {
  event.preventDefault();
  const contents = document.querySelector("#contents-list-wrap");
  FOLD = !FOLD;

  if (!FOLD) {
    contents.style.height = "0px";
    contents.style.visibility = "hidden";
    btnFold.style.background = 'url("images/close.png")';
    btnFold.style.backgroundSize = "100%,100%";
  } else {
    contents.style.height = "auto";
    contents.style.visibility = "visible";
    btnFold.style.background = 'url("images/open.png")';
    btnFold.style.backgroundSize = "100%,100%";
  }
};

const handleBtnDelAppear = event => {
  const id = parseInt(event.target.id);
  list.childNodes.forEach(li => {
    if (id === parseInt(li.id)) {
      var btnDel = li.querySelector(".btnDelete");
      btnDel.style.visibility = "visible";
    }
  });
};
const handleBtnDelDisappear = event => {
  const id = parseInt(event.target.id);
  list.childNodes.forEach(li => {
    if (id === parseInt(li.id)) {
      var btnDel = li.querySelector(".btnDelete");
      btnDel.style.visibility = "hidden";
    }
  });
};

form.addEventListener("submit", handleSubmit);
btnAll.addEventListener("click", handleBtnAll);
btnActive.addEventListener("click", handleBtnActive);
btnCompleted.addEventListener("click", handleBtnCompleted);
btnClearCompleted.addEventListener("click", handleBtnClear);
btnFold.addEventListener("click", handleBtnFold);

function init() {
  loadToDos();
  updateCount();
  modeOn("All");
  FOLD = true;
}

init();
