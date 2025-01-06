document.addEventListener("DOMContentLoaded", () => { 
const homeScreen = document.getElementById("homeScreen");
    const gratitudeList = document.getElementById("gratitudeList");
    const gratitudeInput = document.getElementById("gratitudeInput");
    const saveButton = document.getElementById("saveGratitude");
    const gratitude1 = document.getElementById("gratitude1");
    const gratitude2 = document.getElementById("gratitude2");
    const gratitude3 = document.getElementById("gratitude3");
    const bibleVerse = document.getElementById("bibleVerse");
    const progressBarDays = document.querySelectorAll(".day");

const randomBibleVerses = [
    "Благодарите Господа, ибо Он благ, ибо вовек милость Его. (Псалом 106:1)",
    "Всё могу в укрепляющем меня Иисусе Христе. (Филиппийцам 4:13)",
    "Всякое даяние доброе и всякий дар совершенный нисходят свыше от Отца Света. (Иаков 1:17)",
    "Благодарите Господа за Его великую любовь и верность. (Псалом 136:1)",
    "Слава Богу за Его бесконечное милосердие. (Лука 1:50)",
    "Давайте благодарить Господа за Его чудеса и чудотворные дела. (Псалом 105:1)",
    "Благодарите Бога за Его неизмеримую благодать. (2 Коринфянам 9:15)",
    "Благодарим Тебя, Господи, за мир, который Ты даешь. (Иоанна 14:27)",
    "Господь мой и Бог мой! Я благодарю Тебя за жизнь и спасение. (Иоанна 20:28)",
    "Благодарите Бога за Его защиту и помощь во время бед. (Псалом 34:7)",
    "Каждый день, о Господи, благодарю Тебя за Твою верность и любовь. (Псалом 92:1)",
    "За каждую милость Твою, о Господь, я благодарю Тебя. (Псалом 116:12)",
    "Давайте благодарить Бога за Его творение и за весь этот мир. (Бытие 1:31)",
    "Благодарите Господа за Его постоянное присутствие в нашей жизни. (Матфея 28:20)",
    "Благодарю Тебя, Господи, за Твою силу, которая всегда со мной. (Псалом 18:2)",
    "Благодарим Господа за откровение и свет, который Он посылает. (Псалом 119:105)",
    "Благодарю Тебя, Господи, за Твою любовь и прощение. (1 Иоанна 1:9)",
    "Благодарим Тебя, Господи, за Твое руководство и мудрость. (Притчи 3:5-6)",
    "Слава Тебе, Господи, за Твою неизменную верность и защиту. (Псалом 18:30)",
    "Давайте будем благодарны Богу за каждый день и каждую возможность. (Псалом 118:24)",
    "Господь — моя сила и мое спасение, благодарю Тебя за Твою помощь. (Псалом 27:1)",
    "Благодарю Тебя, Господи, за мир, который Ты даешь, в сердце моем. (Иоанна 14:27)",
    "Благодарю Тебя, Господи, за Твое терпение и прощение. (2 Петра 3:9)",
    "Благодарите Господа за Его любовь, которая не прекращается. (Иеремия 31:3)",
    "Слава Тебе, Господи, за Твои чудеса, которые Ты творишь в нашей жизни. (Псалом 77:14)",
    "Благодарю Тебя, Господи, за каждый шаг в Твоем свете. (Псалом 119:105)",
    "Благодарю Тебя, Господи, за силу, которую Ты мне даешь каждый день. (Филиппийцам 4:13)",
    "Благодарим Бога за Его обетования, которые всегда исполняются. (Исаия 55:11)",
    "Слава Тебе, Господи, за Твое чудесное творение и мир. (Псалом 19:1)",
    "Благодарю Тебя, Господи, за мир, который Ты даешь в трудные моменты. (Филиппийцам 4:7)",
    "Господь, благодарю Тебя за поддержку и покой, которые Ты мне даешь. (Матфея 11:28)",
    "Благодарю Тебя, Господи, за чудеса, которые Ты творишь в моей жизни. (Псалом 77:14)",
    "Благодарю Тебя, Господи, за Твои обетования и надежду на будущее. (Иеремия 29:11)"
];

    // Функция для получения случайного стиха
    const getRandomBibleVerse = () => {
        const randomIndex = Math.floor(Math.random() * randomBibleVerses.length);
        bibleVerse.innerText = randomBibleVerses[randomIndex];
    };

    // Функция для обновления прогресс-бара
    const updateProgressBar = () => {
        const savedWeekProgress = JSON.parse(localStorage.getItem("weekProgress")) || {};
        progressBarDays.forEach((dayElement, index) => {
            if (savedWeekProgress[index]) {
                dayElement.classList.add('completed');
                dayElement.classList.remove('incomplete');
            } else {
                dayElement.classList.add('incomplete');
                dayElement.classList.remove('completed');
            }
        });
    };

    // Функция для отображения группы благодарностей
    const displayGratitudeGroup = (gratitudeGroup) => {
        if (gratitudeGroup && Array.isArray(gratitudeGroup.items)) {
            const groupContainer = document.createElement("div");
            groupContainer.classList.add("gratitude-group");

            const groupDate = document.createElement("span");
            groupDate.classList.add("gratitude-date");
            groupDate.innerText = gratitudeGroup.date;
            groupContainer.appendChild(groupDate);

            const gratitudeItems = document.createElement("div");
            gratitudeItems.classList.add("gratitude-items");

            gratitudeGroup.items.forEach(text => {
                const gratitudeCard = document.createElement("p");
                gratitudeCard.classList.add("gratitude-card");
                gratitudeCard.innerText = text;
                gratitudeItems.appendChild(gratitudeCard);
            });

            groupContainer.appendChild(gratitudeItems);
            gratitudeList.appendChild(groupContainer);
        } else {
            console.error("Ошибка: gratitudeGroup.items не определён или не является массивом");
        }
    };

    // Функция для получения индекса дня недели (неделя начинается с понедельника)
    const getCurrentDayIndex = () => {
        const today = new Date().getDay();
        return today === 0 ? 6 : today - 1; // Воскресенье (0) -> 6, остальные дни сдвигаются на -1
    };

    // Функция для сохранения благодарности
    const saveGratitude = () => {
        const gratitudeTexts = [
            gratitude1.value.trim(),
            gratitude2.value.trim(),
            gratitude3.value.trim()
        ];

        if (gratitudeTexts.some(text => text !== "")) {
            const gratitudeGroup = {
                date: new Date().toLocaleDateString(),
                items: gratitudeTexts.filter(text => text !== "")
            };

            const savedGratitudes = JSON.parse(localStorage.getItem("gratitudes")) || [];
            savedGratitudes.push(gratitudeGroup);
            localStorage.setItem("gratitudes", JSON.stringify(savedGratitudes));

            // Отображаем благодарность на экране
            displayGratitudeGroup(gratitudeGroup);

            // Очищаем поля ввода
            gratitude1.value = "";
            gratitude2.value = "";
            gratitude3.value = "";

            // Скрываем форму и показываем список
            gratitudeInput.style.display = "none";
            gratitudeList.style.display = "block";

            // Обновляем прогресс недели
            const currentDay = getCurrentDayIndex(); // Считаем по индексу дня недели
            const savedWeekProgress = JSON.parse(localStorage.getItem("weekProgress")) || {};
            savedWeekProgress[currentDay] = true; // Отмечаем текущий день как выполненный
            localStorage.setItem("weekProgress", JSON.stringify(savedWeekProgress));

            // Обновляем прогресс-бар
            updateProgressBar();

            // Сохраняем дату добавления благодарности
            localStorage.setItem("gratitudeAddedDate", gratitudeGroup.date); 
        }
    };

    // Загрузка данных из LocalStorage при загрузке страницы
    const loadSavedGratitudes = () => {
        const savedGratitudes = JSON.parse(localStorage.getItem("gratitudes")) || [];

        // Фильтруем только те благодарности, которые добавлены сегодня
        const currentDate = new Date().toLocaleDateString();
        const todaysGratitudes = savedGratitudes.filter(gratitude => gratitude.date === currentDate);

        // Отображаем благодарности за сегодня
        todaysGratitudes.forEach(displayGratitudeGroup);
    };

    // Логика отображения формы благодарности в зависимости от времени суток и добавления благодарности
    const showGratitudeInput = () => {
        const currentHour = new Date().getHours(); // Получаем текущий час
        const currentDate = new Date().toLocaleDateString(); // Получаем текущую дату

        // Проверяем, была ли уже добавлена благодарность сегодня
        const gratitudeAddedToday = localStorage.getItem("gratitudeAddedDate") === currentDate;

        const infoMessage = document.createElement("div");
        infoMessage.innerText = "Ежедневную благодарность Богу можно добавить с 19:00, оставляйте 3 благодарности, так же вы сможете просматривать свои благодарности в дальнейшем, Слава Иисусу!";
        infoMessage.classList.add("info-message");

        if (!document.querySelector(".info-message")) {
            homeScreen.appendChild(infoMessage);
        }

        // Если благодарность уже добавлена, скрываем форму
        if (gratitudeAddedToday) {
            gratitudeInput.style.display = "none";
            infoMessage.style.display = "none";  // Прячем информационное сообщение
        } else {
            if (currentHour >= 13 && currentHour < 24) {
                gratitudeInput.style.display = "flex";
                infoMessage.style.display = "none";
            } else {
                gratitudeInput.style.display = "none";
                infoMessage.style.display = "block";
            }
        }

        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        if (currentHour === 13 && !gratitudeAddedToday) {
            if (Notification.permission === 'granted') {
                new Notification("Не забудьте добавить свою благодарность!", {
                    body: "Каждый день - это новый шанс быть благодарным.",
                    icon: "https://cdn-icons-png.freepik.com/256/9982/9982934.png?ga=GA1.1.469636009.1732164694&semt=ais_hybrid"
                });
            }
        }
    };

    // Переключение между экранами
    const homeIcon = document.getElementById("homeIcon");
    const savedIcon = document.getElementById("savedIcon");

    homeIcon.addEventListener("click", () => {
        homeScreen.style.display = "block";
        gratitudeList.style.display = "none";
        gratitudeInput.style.display = "flex";  // Показ формы, если ещё не добавлена благодарность
        showGratitudeInput();  // Проверяем, нужно ли показывать форму
    });

    savedIcon.addEventListener("click", () => {
        homeScreen.style.display = "none";
        gratitudeList.style.display = "block";
        gratitudeInput.style.display = "none"; // Скрываем форму на странице сохранённых
    });

    // Инициализация
    getRandomBibleVerse();
    loadSavedGratitudes(); // Загружаем только сегодняшние благодарности
    updateProgressBar();
    showGratitudeInput();

    saveButton.addEventListener("click", saveGratitude);
});



// Смена иконки при наведении
const homeIcon = document.getElementById("homeIcon");
const savedIcon = document.getElementById("savedIcon");
const anotherIcon = document.getElementById("anotherIcon");

const images = {
    homeIcon: [
        "https://cdn-icons-png.freepik.com/256/738/738873.png?ga=GA1.1.469636009.1732164694",
        "https://cdn-icons-png.freepik.com/256/738/738822.png?semt=ais_hybrid"
    ],
    savedIcon: [
        "https://cdn-icons-png.freepik.com/256/15129/15129049.png?ga=GA1.1.469636009.1732164694",
        "https://cdn-icons-png.freepik.com/256/15129/15129170.png?semt=ais_hybrid"
    ],
    anotherIcon: [
        "https://cdn-icons-png.freepik.com/256/786/786672.png?ga=GA1.1.469636009.1732164694&semt=ais_hybrid",
        "https://cdn-icons-png.freepik.com/256/786/786723.png?ga=GA1.1.469636009.1732164694&semt=ais_hybrid"
    ]
};

function changeIconImage(iconId, isHovered) {
    const icon = document.getElementById(iconId);
    const img = icon.querySelector("img");

    img.src = isHovered ? images[iconId][0] : images[iconId][1];
}

homeIcon.addEventListener("mouseenter", () => changeIconImage("homeIcon", true));
homeIcon.addEventListener("mouseleave", () => changeIconImage("homeIcon", false));

savedIcon.addEventListener("mouseenter", () => changeIconImage("savedIcon", true));
savedIcon.addEventListener("mouseleave", () => changeIconImage("savedIcon", false));

anotherIcon.addEventListener("mouseenter", () => changeIconImage("anotherIcon", true));
anotherIcon.addEventListener("mouseleave", () => changeIconImage("anotherIcon", false));

const shareIcon = document.getElementById("anotherIcon");

shareIcon.addEventListener("click", () => {
    const appLink = "https://example.com"; // Ссылка на приложение или сайт

    if (navigator.share) {
        navigator.share({
            title: "Поделись этим приложением, несите благую весть!",
            text: "Присоединяйся к ежедневной благодарности Господу Богу в web-приложении Thank You God!",
            url: appLink
        }).catch(error => {
            console.error("Ошибка при использовании Web Share API:", error);
        });
    } else {
        navigator.clipboard.writeText(appLink)
            .then(() => {
                alert("Ссылка на приложение скопирована в буфер обмена!");
            })
            .catch(error => {
                console.error("Ошибка при копировании ссылки:", error);
                alert("Не удалось скопировать ссылку. Попробуйте снова.");
            });
    }
});

// Таймер для исчезновения блока счетчика
// Функция для скрытия счетчика
function hideCounter() {
    const counterContainer = document.getElementById('counter-container');
    if (counterContainer) {
        counterContainer.style.opacity = '0'; // Плавное исчезновение
        setTimeout(() => counterContainer.style.display = 'none', 1000); // Удаление из потока через 1 секунду
    }
}

// Таймер для исчезновения через 10 секунд
setTimeout(hideCounter, 12000);

// Скрытие счетчика при клике на экран
document.body.addEventListener('click', () => {
    const counterContainer = document.getElementById('counter-container');
    if (counterContainer && counterContainer.style.opacity !== '0') {
        hideCounter();
    }
});

// Функция для сброса прогресса при начале новой недели
const resetProgressIfNewWeek = () => {
    const lastResetWeek = localStorage.getItem("lastResetWeek");
    const currentWeek = Math.floor(new Date().getTime() / (7 * 24 * 60 * 60 * 1000)); // Номер текущей недели

    if (lastResetWeek === null || parseInt(lastResetWeek) < currentWeek) {
        // Сбрасываем прогресс
        localStorage.removeItem("weekProgress");
        localStorage.setItem("lastResetWeek", currentWeek); // Обновляем метку недели
    }
};

    // Инициализация
    resetProgressIfNewWeek(); // Сбрасываем прогресс, если началась новая неделя
