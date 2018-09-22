var userName = prompt('Username??'); // Имя пользователя
const TABLE = document.getElementById('calendar'); // Адресуемся к календарю ( вся таблица )
const TODOLIST = document.getElementById('toDoList'); // Адремуемся к секции где будем выводить наши делишки
const ADDBUTTON = document.getElementById('add'); // Адресуемся к кнопке, которая показывает нам 2 инпута, которые добавляют новые делишки
const REMOVEICON = `<img id="delete" class="icon" src="img/delete.png" alt="S">`; // Иконка удаления
const STATUSICON = `<img id="status" class="icon" src="img/status.png" alt="S">`; // Иконка смены статуса ( клик - смена )
const TIMERICON = `<img id="timer" class="icon" src="img/timer.png" alt="S">`; // Иконка таймера, клик - появляется инпут, в него ввести время в милисекундах через сколько задачу считать просроченой
const STATUS_DONE = `<img src="img/status_done.png" alt="S">`; // Иконка если задача сделана
const STATUS_IN_PROCESS = `<img src="img/status_in_progress.png" alt="S">`; // Иконка если задача в процессе
const STATUS_FAILED = `<img src="img/status_losed.png" alt="S">`; // Иконка если задача провалена
const ADDEVENTBUTTON = document.getElementById('add_event'); // Кнопка добавления новой задачи в ToDoList
var dataToggle = ''; // Переключатель, указывающий на какую дату мы клацнули, по умолчанию пуст, при клике - принимает значение (число на которое нажали)
var daysArray = JSON.parse(localStorage.getItem(userName)) || daysArr(); // Берем данные из LocalStorage, в случае если нет такого никнейма то генерируем стандартный месяц
var dataToggle2 = ''; // Еще один переключатель, только он показывает не только число на которое мы нажали а весь outerHTML
var buffer = 0; // Буффер для переключения статусов, функция ниже
var selected_Array = []; // Массив, контроллирующий нажатие на даты, не даёт выделить больше одного элемента


function divFactory() { // Функция создания наших дел, если они присутствуют

    for (var i = 0; i < daysArray.length; i++) {
        if (dataToggle2.innerHTML === daysArray[i].date) {
            for (var y = 0; y < daysArray[i].events.length; y++) {
                TODOLIST.innerHTML += `
                <div id="${y}">
                <h1>
                ${daysArray[i].events[y].name}
                </h1>
                <h2>
                ${daysArray[i].events[y].desc}
                </h2>
                <div>
                ${daysArray[i].events[y].status}
                </div>
                <span>
                ${STATUSICON}
                ${REMOVEICON}
                ${TIMERICON}
                </span>
                
                </div>
                `
            }
        }
    }
}

function daysArr() { // Функция генерации массива стандартного месяца, если у пользователя его нет
    var array = [];
    for (var i = 0; i < 30; i++) {
        array.push({
            date: `${i + 1}`,
            events: [{
                name: 'Event Name',
                desc: 'Event Description',
                status: `${STATUS_IN_PROCESS}`,
            }]
        })
    }
    return array;
}





ADDEVENTBUTTON.addEventListener('click', function() {
    // При клике на кнопку "DONE", когда в оба инпута уже введены значения (Имя) и (Описание) - пушит в массив с делами новое дело
    // Сохраняет изменения в LocalStorage
    // И снова призызвает функцию divFactory() чтобы она перегенерировала список дел, уже с новым, появившимся
    daysArray[dataToggle - 1].events.push({
        name: document.getElementById('name').value,
        desc: document.getElementById('description').value,
        status: STATUS_IN_PROCESS,
        timer: ''
    })
    TODOLIST.innerHTML = '';
    divFactory();
    localStorage.setItem(userName, JSON.stringify(daysArray));
})
ADDBUTTON.addEventListener('click', () => {
    // Секция с инпутами для добавления новых задач теперь видна
    document.getElementById('new_event').classList.remove('hidden');
})
TABLE.addEventListener('click', function(e) {
    if (selected_Array.length > 0) {
        selected_Array[0].classList.remove('selected');
        selected_Array.pop();
        selected_Array.push(e.target);
        selected_Array[0].classList.add('selected');
    } else {
        selected_Array.push(e.target);
        selected_Array[0].classList.add('selected');
    }
    // Сверху проверка на то, выделен один элемент или больше
    // Не позволяющая выбрать больше одного элемента, при клике на календарь
    TODOLIST.innerHTML = '';
    // Обнуление списка дел, чтоб не показывать список дел из другой даты
    dataToggle = e.target.innerHTML; // Переключатель дат принимает значение текущей даты
    dataToggle2 = e.target; // Еще один переключатель принимает значения нажатого элемента
    if (dataToggle) {
        // Если наш переключатель не пустая строка - позволит добавить на страницу новые дела
        // Защита, если пользователь нажмет на окошко без даты и захочет добавить туда дело
        ADDBUTTON.classList.add('button17');
        ADDBUTTON.classList.remove('hidden');
    } else {
        // В ином случае, если dataToggle = '', он добавляет класс hidden и скрывает кнопочку
        document.getElementById('new_event').classList.add('hidden');
        ADDBUTTON.classList.remove('button17');
        ADDBUTTON.classList.add('hidden');
    }
    divFactory(); // После чего, в зависимости от дня на который мы нажали он генерирует список дел по этому дню функцией divFactory()
})

document.querySelector('#toDoList').addEventListener('click', e => {
    // Событие проверяющее клики на иконки, первая иконка - delete, при нажатии на нее спрашивает, действительно ли
    // я хочу удалить элемент, если ок - то элемент удаляется, ищется в массиве объектов, и там тоже удаляется
    // если не ок - то ничего не происходит, изменения сохраняются в localStorage
    if (e.target.outerHTML.indexOf('id="delete"') >= 0) {
        var conf = confirm("Are u sure to delete this element??");
        if (conf) {
            for (var i = 0; i < daysArray[dataToggle - 1].events.length; i++) {
                var index = e.target.parentElement.parentElement.children[0].innerHTML.indexOf(daysArray[dataToggle - 1].events[i].name);
                // Внутри элемента на который мы клацнули (хотим удаалить), ищет родителей, потом возвращается к первому ребенку
                // тоесть h1 который содержит в себе название элемента, и ищет в нем по циклу соответствующий объект, в котором object.name 
                // совпадает с h1.innerHTML
                if (index >= 0) {
                    daysArray[dataToggle - 1].events.splice(i, 1);
                    // Удаление элемента из массива, посредством его поиска
                    e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                    // Визуальное удаление элемента со страницы
                    localStorage.setItem(userName, JSON.stringify(daysArray));
                    // Сохранение изменений в Storage
                }
            }
        } else {
            return;
        }
    } else if (e.target.outerHTML.indexOf('id="status"') >= 0) {
        // Если клик был на иконку, с id = status, тоесть на иконку, меняющую статус задания - задействуется буфферный переключатель
        // статусов данной задачи, если 1 - иконка меняется у задачи на иконку "в процессе", а так же ищется ее статус в массиве
        // объектов и там тоже меняется на соответствующий, изменения сохраняются в localStorage
        buffer++;
        if (buffer === 1) {
            for (var i = 0; i < daysArray[dataToggle - 1].events.length; i++) {
                var index = e.target.parentElement.parentElement.children[0].innerHTML.indexOf(daysArray[dataToggle - 1].events[i].name);
                // Внутри элемента на который мы клацнули (хотим изменить его статус), ищет родителей, потом возвращается к первому ребенку
                // тоесть h1 который содержит в себе название элемента, и ищет в нем по циклу соответствующий объект, в котором object.name 
                // совпадает с h1.innerHTML
                if (index >= 0) {
                    daysArray[dataToggle - 1].events[i].status = STATUS_IN_PROCESS;
                    // Когда нашли соответствующее свойство объекта, изменили его на новое
                    e.target.parentElement.parentElement.children[2].innerHTML = `${STATUS_IN_PROCESS}`;
                    // Обновили картинку на странице
                    localStorage.setItem(userName, JSON.stringify(daysArray));
                    // Сохранили значения в LocalStorage
                }
            }
        } else if (buffer === 2) {
            for (var i = 0; i < daysArray[dataToggle - 1].events.length; i++) {
                var index = e.target.parentElement.parentElement.children[0].innerHTML.indexOf(daysArray[dataToggle - 1].events[i].name);
                // То же самое)
                if (index >= 0) {
                    daysArray[dataToggle - 1].events[i].status = STATUS_DONE;
                    e.target.parentElement.parentElement.children[2].innerHTML = `${STATUS_DONE}`;
                    localStorage.setItem(userName, JSON.stringify(daysArray));
                }
            }
        } else if (buffer === 3) {
            for (var i = 0; i < daysArray[dataToggle - 1].events.length; i++) {
                var index = e.target.parentElement.parentElement.children[0].innerHTML.indexOf(daysArray[dataToggle - 1].events[i].name);
                // То же самое
                if (index >= 0) {
                    daysArray[dataToggle - 1].events[i].status = STATUS_FAILED;
                    e.target.parentElement.parentElement.children[2].innerHTML = `${STATUS_FAILED}`;
                    localStorage.setItem(userName, JSON.stringify(daysArray));
                }
            }
            buffer = 0; // Обнулили буффер для зацикленности
        }
    } else if (e.target.outerHTML.indexOf('id="timer"') >= 0) {
        // Если пользователь клацнул на иконку таймера, то...
        timer = 0;
        var div = e.target;
        // Переменная которая нужна мне чтобы в более глубокой функции получить картинку на которую кликнул (там где e.target уже 
        // не равняется картинке, а равняется кнопке установки таймера)
        document.getElementById('set_timer').classList.remove('hidden');
        // Секция с инпутом для введения времени таймера теперь не скрыта
        document.getElementById('timer_button').addEventListener('click', function(e) {
            // Когда мы ввели значение в инпут, через сколько секунд ( милисекунд ) наша задача станет проваленной
            // вызываем событие нажатия на кнопку "установить таймер"
            var timer = parseInt(document.getElementById('input_timer').value);
            // Таймер принимает значение инпута, куда мы вводим время
            div.parentElement.parentElement.style.transition = `all ${timer/1000}s linear`;
            div.parentElement.parentElement.style.background = `#d4d8f9`;
            // Смена цвета блока просто для красоты и наглядности
            setTimeout(function() {
                // Сама функция, которая скрывает инпут таймера, после чего через заданное пользователем время
                // устанавливает на задачу метку "провалена", а так же сохраняет результаты в массиве объектов,
                // и в LocalStorage
                document.getElementById('set_timer').classList.add('hidden');
                for (var i = 0; i < daysArray[dataToggle - 1].events.length; i++) {
                    var index = div.parentElement.parentElement.children[0].innerHTML.indexOf(daysArray[dataToggle - 1].events[i].name);
                    if (index >= 0) {
                        daysArray[dataToggle - 1].events[i].status = STATUS_FAILED;
                        div.parentElement.parentElement.children[2].innerHTML = `${STATUS_FAILED}`;
                        localStorage.setItem(userName, JSON.stringify(daysArray));
                    }
                }
            }, timer);
        })
    }
})