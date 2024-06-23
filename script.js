document.addEventListener("DOMContentLoaded", function () {
    const habitForm = document.getElementById("habit-form");
    const habitInput = document.getElementById("habit-input");
    const habitsContainer = document.getElementById("habits");
    const mainPage = document.getElementById("main-page");
    const habitPage = document.getElementById("habit-page");
    const backButton = document.getElementById("back-button");
    const habitContent = document.getElementById("habit-content");
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    habitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const habitName = habitInput.value.trim();
        if (habitName) {
            addHabit(habitName);
            habitInput.value = '';
        }
    });

    backButton.addEventListener("click", function () {
        mainPage.style.display = 'block';
        habitPage.style.display = 'none';
    });

    function loadHabits() {
        const habits = JSON.parse(localStorage.getItem('habits')) || [];
        habits.forEach(habit => {
            addHabit(habit.name, habit.id);
        });
    }

    function saveHabits() {
        const habits = [];
        document.querySelectorAll('.habit').forEach(habit => {
            habits.push({
                name: habit.querySelector('h2').textContent,
                id: habit.dataset.id
            });
        });
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    function addHabit(name, id = Date.now().toString()) {
        const habitElement = document.createElement('div');
        habitElement.classList.add('habit');
        habitElement.dataset.id = id;
        habitElement.innerHTML = `
            <h2>${name}</h2>
            <button onclick="deleteHabit('${id}')">Delete</button>
        `;
        habitElement.addEventListener('click', function () {
            viewHabit(id, name);
        });
        habitsContainer.appendChild(habitElement);
        saveHabits();
    }

    function deleteHabit(id) {
        document.querySelector(`.habit[data-id="${id}"]`).remove();
        for (let month = 0; month < 12; month++) {
            const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${id}-${currentYear}-${month + 1}-${day}`;
                localStorage.removeItem(dateKey);
            }
        }
        saveHabits();
    }

    function viewHabit(id, name) {
        mainPage.style.display = 'none';
        habitPage.style.display = 'block';
        habitContent.innerHTML = `<h2>${name}</h2><div id="year-${id}" class="year"></div>`;
        createYearCalendar(`year-${id}`, id);
    }

    function createYearCalendar(containerId, habitId) {
        const yearContainer = document.getElementById(containerId);
        yearContainer.innerHTML = '';
        for (let month = 0; month < 12; month++) {
            const monthContainer = document.createElement("div");
            monthContainer.classList.add("month");

            const monthName = document.createElement("div");
            monthName.classList.add("month-name");
            monthName.textContent = monthNames[month];
            monthContainer.appendChild(monthName);

            const calendar = document.createElement("div");
            calendar.classList.add("calendar");

            const daysInMonth = new Date(currentYear, month + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement("div");
                dayElement.classList.add("day");
                dayElement.textContent = day;

                const dateKey = `${habitId}-${currentYear}-${month + 1}-${day}`;
                if (localStorage.getItem(dateKey) === "completed") {
                    dayElement.classList.add("completed");
                }

                dayElement.addEventListener("click", function () {
                    if (dayElement.classList.contains("completed")) {
                        dayElement.classList.remove("completed");
                        localStorage.removeItem(dateKey);
                    } else {
                        dayElement.classList.add("completed");
                        localStorage.setItem(dateKey, "completed");
                    }
                });

                calendar.appendChild(dayElement);
            }

            monthContainer.appendChild(calendar);
            yearContainer.appendChild(monthContainer);
        }
    }

    loadHabits();
});

function deleteHabit(id) {
    document.querySelector(`.habit[data-id="${id}"]`).remove();
    for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${id}-${currentYear}-${month + 1}-${day}`;
            localStorage.removeItem(dateKey);
        }
    }
    saveHabits();
    // Hide habit page and show main page after deletion
    document.getElementById('main-page').style.display = 'block';
    document.getElementById('habit-page').style.display = 'none';
    saveHabits();
}
