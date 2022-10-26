const taskInput = document.querySelector(".task-input input"),
taskBox = document.querySelector(".task-box");

let muokkaaID;
let muokattuTehtava = false;

// Listan tiedot tallennetaan localstorageen
let todos = JSON.parse(localStorage.getItem("todo-list"));

function showTodo(filter) {
    let li = "";
    if(todos) {
        todos.forEach((todo, id) => {
            //jos todo status on valmis, boksi on ruksattu
            let isCompleted = todo.status == "valmis" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                li += `<li class="task">
                        <label for= "${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}">
                            <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <ul class="task-menu">
                                <li onclick="muokkaaTehtavaa(${id},'${todo.name}')"><i class="uil uil-pen">Muokkaa</i></li>
                                <li onclick="poistaTehtava(${id})"><i class="uil uil-trash">Poista</i></li>
                            </ul>
                        </div>
                    </li >`;
            }
        });
    }
    taskBox.innerHTML = li || `<span>Sinulla ei ole uusia tehtäviä</span>`;
}
showTodo("all");

function muokkaaTehtavaa(taskId, taskName) {
    muokkaaID = taskId;
    muokattuTehtava = true;
    taskInput.value = taskName;
}

function poistaTehtava(deleteId) {
      //poistetaan valittu tehtävä listalta
    todos.splice(deleteId, 1)
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

function updateStatus(selectedTask) {
    //muokkaa tehtävien status valmiiksi
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked")
        //muutetaan tehdyn tehtävän status valmiiksi
        todos[selectedTask.id].status = "valmis";
    } else {
        taskName.classList.remove("checked");
        //tekemätön tehtävä, status on odottaa
        todos[selectedTask.id].status = "odottaa";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (taskInput.value.length < 4) {
            alert("Tehtävä on liian lyhyt. Muokkaa se!")
            lyhytTeksti();
        }
        else {
            sopivaTeksti();
        }
        if(!muokattuTehtava) { 
            if (!todos) { 
                todos = [];
            }
            let taskInfo = { name: userTask, status: "odottaa" };
            todos.push(taskInfo); //lisätään uusi tehtävä todos-listaan
        } else {
            muokattuTehtava = false;
            todos[muokkaaID].name = userTask;
        }
        taskInput.value = ""
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");
    }
});

function lyhytTeksti() {
    document.body.style.color = 'red';
}

function sopivaTeksti() {
    document.body.style.color = 'black';
}