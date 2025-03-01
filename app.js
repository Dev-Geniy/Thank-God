document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("gratitudeForm");
  const gratitudeList = document.getElementById("gratitudeList");
  const clearHistoryBtn = document.getElementById("clearHistory");
  const navButtons = document.querySelectorAll(".nav-btn");

  let db;
  
  // Инициализация базы данных IndexedDB
  function initDB() {
    const request = indexedDB.open("gratitudeDB", 2); // Обновляем версию базы данных

    request.onupgradeneeded = function (e) {
      db = e.target.result;

      // Проверяем наличие объекта Store и индекса
      if (!db.objectStoreNames.contains("gratitudes")) {
        const store = db.createObjectStore("gratitudes", { keyPath: "id", autoIncrement: true });
        // Создаем индекс для поля "date"
        store.createIndex("date", "date", { unique: false });
      } else {
        // Если база уже существует, просто добавляем индекс
        const store = e.target.transaction.objectStore("gratitudes");
        if (!store.indexNames.contains("date")) {
          store.createIndex("date", "date", { unique: false });
        }
      }
    };

    request.onerror = function () {
      alert("Ошибка при открытии базы данных.");
    };

    request.onsuccess = function (e) {
      db = e.target.result;
      displayHistory(); // Загружаем историю благодарностей при успешном открытии базы
      updateProgressBar(); // Обновляем прогресс-бар
    };
  }

  // Проверка на существование благодарности за сегодняшний день
  function checkIfGratitudeExists(todayDate, callback) {
    const transaction = db.transaction(["gratitudes"], "readonly");
    const store = transaction.objectStore("gratitudes");
    const index = store.index("date");
    const request = index.get(todayDate);

    request.onsuccess = function () {
      callback(!!request.result);
    };

    request.onerror = function () {
      console.error("Ошибка при проверке существования благодарности.");
      callback(false);
    };
  }

  // Сохранение благодарности
  function saveGratitude(event) {
    event.preventDefault();

    const gratitude1 = document.getElementById("gratitude1").value;
    const gratitude2 = document.getElementById("gratitude2").value;
    const gratitude3 = document.getElementById("gratitude3").value;
    const todayDate = new Date().toLocaleDateString();

    if (!gratitude1 || !gratitude2 || !gratitude3) {
      alert("Заполните все поля!");
      return;
    }

    // Проверка на существование благодарности за сегодня
    checkIfGratitudeExists(todayDate, (exists) => {
      if (exists) {
        alert("Благодарности Богу за этот день уже сохранены!");
        return;
      }

      const gratitudeEntry = {
        date: todayDate,
        items: [gratitude1, gratitude2, gratitude3],
      };

      const transaction = db.transaction(["gratitudes"], "readwrite");
      const store = transaction.objectStore("gratitudes");
      store.add(gratitudeEntry);

      transaction.oncomplete = function () {
        form.reset();
        switchScreen("screen2");
        displayHistory();
        updateProgressBar(); // Обновляем прогресс-бар
      };

      transaction.onerror = function () {
        alert("Ошибка при сохранении благодарности.");
      };
    });
  }

  // Отображение истории благодарностей
  function displayHistory() {
    gratitudeList.innerHTML = "";
    const transaction = db.transaction(["gratitudes"], "readonly");
    const store = transaction.objectStore("gratitudes");

    const request = store.getAll();
    request.onsuccess = function () {
      const history = request.result;
      history.forEach((entry) => {
        const card = document.createElement("div");
        card.classList.add("history-entry");
        card.innerHTML = `<strong>${entry.date}</strong><br>${entry.items.join("<br>")}`;
        gratitudeList.appendChild(card);
      });
    };
    request.onerror = function () {
      alert("Ошибка при загрузке истории.");
    };
  }

  // Очистка истории
  clearHistoryBtn.addEventListener("click", () => {
    const transaction = db.transaction(["gratitudes"], "readwrite");
    const store = transaction.objectStore("gratitudes");
    store.clear();

    transaction.oncomplete = function () {
      displayHistory();
      updateProgressBar(); // Обновление прогресс-бара после очистки
    };
  });

  // Переключение экранов
  function switchScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.style.display = "none";
    });
    document.getElementById(screenId).style.display = "block";
  }

  // Переключение экранов с кнопок
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const screenId = button.getAttribute("data-screen");
      switchScreen(screenId);
    });
  });

  // Функция для обновления прогресс-бара
  function updateProgressBar() {
    const days = document.querySelectorAll(".day");
    const gratitudeDays = new Set(); // Сет для хранения дней с благодарностями

    const transaction = db.transaction(["gratitudes"], "readonly");
    const store = transaction.objectStore("gratitudes");
    const request = store.getAll();
    
    request.onsuccess = function () {
      const history = request.result;

      // Собираем все дни недели, в которые были добавлены благодарности
      history.forEach((entry) => {
        const entryDate = new Date(entry.date);
        const dayOfWeek = entryDate.getDay(); // Получаем день недели (0 - воскресенье, 6 - суббота)
        gratitudeDays.add(dayOfWeek);
      });

      // Обновление прогресс-бара
      days.forEach((dayElement) => {
        const dayNumber = parseInt(dayElement.getAttribute("data-day"));
        if (gratitudeDays.has(dayNumber)) {
          dayElement.classList.add("completed");  // День с благодарностью
        } else {
          dayElement.classList.add("incomplete"); // День без благодарности
        }
      });
    };

    request.onerror = function () {
      alert("Ошибка при обновлении прогресс-бара.");
    };
  }

  // Инициализация базы данных и истории
  initDB();

  form.addEventListener("submit", saveGratitude);
});


// ПРОКРУТКА ДОП. ПРИЛОЖЕНИЙ
let isMouseDown = false;
let startX;
let scrollLeft;

const recommendations = document.getElementById("recommendations");

recommendations.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    startX = e.pageX - recommendations.offsetLeft;
    scrollLeft = recommendations.scrollLeft;
});

recommendations.addEventListener("mouseleave", () => {
    isMouseDown = false;
});

recommendations.addEventListener("mouseup", () => {
    isMouseDown = false;
});

recommendations.addEventListener("mousemove", (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - recommendations.offsetLeft;
    const walk = (x - startX) * 2; // скорость прокрутки
    recommendations.scrollLeft = scrollLeft - walk;
});

// - - - - - - - З А П О В Е Д И - - - - - - -

 document.addEventListener("DOMContentLoaded", () => {
    const bibleVerseElement = document.getElementById("bibleVerse");
    const refreshVerseButton = document.getElementById("refreshVerse");

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

    // Функция для выбора случайного стиха
    function getRandomBibleVerse() {
        const randomIndex = Math.floor(Math.random() * randomBibleVerses.length);
        const newVerse = randomBibleVerses[randomIndex];

        // Прячем текст (устанавливаем opacity: 0)
        bibleVerseElement.classList.remove('visible');

        // Задержка, чтобы текст успел исчезнуть
        setTimeout(function() {
            // Обновляем текст
            bibleVerseElement.innerText = newVerse;
            // После обновления текста снова показываем его с плавной анимацией
            bibleVerseElement.classList.add('visible');
        }, 600); // Задержка, чтобы текст успел исчезнуть перед обновлением
    }

    // Отображаем случайный стих при загрузке страницы
    getRandomBibleVerse();

    // Обновляем стих при нажатии на кнопку
    refreshVerseButton.addEventListener("click", function() {
        this.classList.add('rotate'); // Анимация вращения кнопки
        
        // Убираем класс через 1.5 секунды (по времени анимации вращения), чтобы можно было снова кликать
        setTimeout(() => {
            this.classList.remove('rotate');
        }, 500);

        // Обновляем стих
        getRandomBibleVerse();
    });
});

// НИЖНЯЯ ПАНЕЛЬ УПРАВЛЕНИЯ
document.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll('.icon');
    const screens = document.querySelectorAll('.screen');

    // Функция скрытия всех экранов
    function hideAllScreens() {
        screens.forEach(screen => {
            screen.style.display = 'none';
        });
    }

    // Обработчик кликов по иконкам
    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            if (icon.id !== "anotherIcon") { // Исключаем кнопку "Поделиться"
                hideAllScreens();
                const targetScreen = document.getElementById(icon.dataset.screen);
                if (targetScreen) {
                    targetScreen.style.display = 'block';
                }
            }
        });
    });

    // Иконки и их смена при наведении
    const images = {
        screen1: [
            "https://cdn-icons-png.freepik.com/256/738/738873.png",
            "https://cdn-icons-png.freepik.com/256/738/738822.png"
        ],
        screen2: [
            "https://cdn-icons-png.freepik.com/256/15129/15129049.png",
            "https://cdn-icons-png.freepik.com/256/15129/15129170.png"
        ],
        screen3: [
            "https://cdn-icons-png.flaticon.com/128/7298/7298943.png",
            "https://cdn-icons-png.flaticon.com/128/7298/7298928.png"
        ],
        screenShare: [
            "https://cdn-icons-png.freepik.com/256/786/786672.png",
            "https://cdn-icons-png.freepik.com/256/786/786723.png"
        ]
    };

    function changeIconImage(iconElement, isHovered) {
        const img = iconElement.querySelector("img");
        const screen = iconElement.dataset.screen;
        if (images[screen]) {
            img.src = isHovered ? images[screen][0] : images[screen][1];
        }
    }

    icons.forEach(icon => {
        icon.addEventListener("mouseenter", () => changeIconImage(icon, true));
        icon.addEventListener("mouseleave", () => changeIconImage(icon, false));
    });

    // Обработчик кнопки "Поделиться"
    const shareIcon = document.querySelector("#anotherIcon");

    shareIcon.addEventListener("click", () => {
        const appLink = "https://dev-geniy.github.io/Thank-God/";

        if (navigator.share) {
            navigator.share({
                title: "Поделитесь этим приложением",
                text: "Присоединяйтесь к ежедневной благодарности Господу Богу в web-приложении Thank You God!",
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
});

// ПЕРЕЗАГРУЗКА ХЕЙДЕРОМ
document.querySelector('header').addEventListener('click', function() {
    location.href = location.href; // Перезагружает страницу
});

// С Ч Ё Т Ч И К
// Функция для скрытия счетчика и затемнения
function hideCounter() {
    const counterContainer = document.getElementById('counter-container');
    const overlay = document.getElementById('overlay');

    // Скрываем счетчик с плавным исчезновением
    if (counterContainer) {
        counterContainer.classList.add('hidden');
    }

    // Скрываем затемнение с плавным исчезновением
    if (overlay) {
        overlay.classList.add('hidden');
    }

    // Убираем элементы из потока через 1 секунду
    setTimeout(() => {
        if (counterContainer) {
            counterContainer.style.display = 'none';
        }
        if (overlay) {
            overlay.style.display = 'none';
        }
    }, 1000); // Убираем элементы через 1 секунду
}

// Таймер для исчезновения через 10 секунд
setTimeout(hideCounter, 8000); // Через 10 секунд скрываем счетчик и затемнение

// Скрытие при клике на экран
document.body.addEventListener('click', () => {
    hideCounter();
});

// Регистрация сервис-воркера
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker зарегистрирован:', registration);
      })
      .catch((error) => {
        console.log('Ошибка при регистрации Service Worker:', error);
      });
  });
}

// КНОПКА СКАЧИВАНИЯ
document.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('downloadButton');

  // Проверяем, поддерживает ли браузер установку PWA
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (event) => {
    // Браузер поддерживает установку PWA
    event.preventDefault();
    deferredPrompt = event;

    // Показать кнопку установки
    downloadButton.style.display = 'block';

    // Когда пользователь нажимает на кнопку установки
    downloadButton.addEventListener('click', () => {
      // Показываем системное окно установки
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Пользователь установил PWA');
        } else {
          console.log('Пользователь отклонил установку PWA');
        }
        deferredPrompt = null;
      });
    });
  });
});
