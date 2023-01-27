var igrade = 0, idays = 0, iscore = 0;

// Автор: Тамбиев Ислам
function pointsCalculator() {    
    // Number.parseInt() - отвечает за перевод из строки в число
    igrade = Number.parseInt(document.form1.grade.value);
    idays = Number.parseInt(document.form1.days.value);
    iscore = Number.parseInt(document.form1.score.value);
    // Высчитываем 
    if (igrade < 3 || igrade > 5) {
        alert("Введите верную оценку");
    }
    else if (iscore < 1) {
        alert("Введите верное количество баллов");
    }
    else if (idays < 1) {
        alert("Введите верное количетво дней");
    }
    else if (idays < 15) {
        var sum1 = 0;
        sum1 = (igrade / 5) * iscore
        document.form1.screen.value = sum1;
    }
    else {
        var sum1 = 0;
        sum1 = ((3 + (igrade - 3) * (14 / idays)) * iscore) / 5
        document.form1.screen.value = sum1;
    }
}

const mq = window.matchMedia('(max-width: 500px)')
if (mq.matches) {
    // ширина окна меньше, чем 500px
    // Максимальное количество снежинок на экране
    var snowmax = 150;
    // Максимальный размер снежков
    var snowmaxsize = 20;
    // Минимальный размер снежков
    var snowminsize = 6;
} else {
    // ширина окна больше, чем 500px
    // Максимальное количество снежинок на экране
    var snowmax = 350;
    // Максимальный размер снежков
    var snowmaxsize = 40;
    // Минимальный размер снежков
    var snowminsize = 8;
}

// Флаг снежинки
var flag = 0;
// Массив цветов снежинок
var snowcolor = new Array("#AAAACC", "#DDDDFF", "#CCCCDD", "#F3F3F3", "#F0FFFF", "#FFFFFF", "#EFF5FF");
// Массив шрифты для снежков
var snowtype = new Array("Arial Black", "Arial Narrow", "Times", "Comic Sans MS");
// Знак для снежков
var snowletter = "*";
// Скорость падение
var sinkspeed = 0.3;
// Массив снежков (их id)
var snow = new Array();
// Отступы с низу
var marginbottom;
// Отступы с права
var marginright;
// Таймер
var timer;
var i_snow = 0;
// размер шага по движению вдоль оси OX
var x_mv = new Array();
// массив суммарного отступа для снежинки, зависит от
// скорости и величины смещения
var crds = new Array();
// массив, который содержит отклонение для снежинки влево и вправо
// определяется в initsnow()
var lftrght = new Array();
// Данные о браузере
// получаем строку о браузере (параметры среды),
// но она будет одна и содержать много информации

/*
Пример:
Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2;
.NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729;
Media Center PC 6.0; MASM; .NET4.0C; .NET4.0E; rv:11.0)
like Gecko
*/
var browserinfos = navigator.userAgent;
// Далее для более подробной информации обычно парсят эту строчку
// с помощью регулярных выражений для более подробного извлечения
// информации
// Следующие три строчки - это получение трёх булевых переменных,
// если переменная true - значит это именно тот браузер
var ie5 = document && document.getElementById && !browserinfos.match(/Opera/);
var ns6 = document.getElementById && !document;
var opera = browserinfos.match(/Opera/);
// Переменная примет значение true, если наш браузер - один из данных трёх
var browserok = ie5 || ns6 || opera;
/*
 Примечание. Получать тип браузера нам нужно для того, чтобы
 гарантировано правильно отобразить работу скрипта. DOM имеет свои
 особенности в разных браузерах.
 ie5 - это не обязательно именно этот тип браузера, это может быть
 целое семейство.
 */
// скрипт запустится, если наш браузер - один из трёх допустимых
if (browserok) {
    // метод onload() объекта window будет ассоциирован с initsnow()
    window.onload = initsnow;
}
// Вспомогательная функция для определения целого числа из диапазона range
function randommaker(range) {
    rand = Math.floor(range * Math.random());
    return rand;
}

// Смена снежинки
function checkCheckbox(){
    if (flag == 0){
        flag = 1;
        snowletter = "❆";
        snowmaxsize = 40;
        lettersChange()
    }
    else{
        flag = 0;
        snowletter = "❅"
        snowmaxsize = 40;
        lettersChange()
    }
}

function lettersChange(){
    for (i = 0; i <= snowmax; i++) {
    document.getElementById("s" + i).innerHTML="<span id='s" + i + "' style='position:absolute;top:-" + snowmaxsize + "px;'>" + snowletter + "</span>";
    //document.getElementById("s" + i).textContent=snowletter;
    }
}

// устанавливаем параметры для прорисовки снежинок
function initsnow() {
    // В зависимости от типа браузера мы по-разному
    // получаем параметры области для прорисовки снежинок.
    if (ie5 || opera) {
        // высота
        marginbottom = document.body.clientHeight;
        // ширина рабочей области
        marginright = document.body.clientWidth;
    }
    else if (ns6) {
        marginbottom = window.innerHeight;
        marginright = window.innerWidth;
    }
    // разница между минимальным и максимальным размером снежинок
    var snowsizerange = snowmaxsize - snowminsize;
    // цикл по всем снежинкам
    for (i = 0; i <= snowmax; i++) {
        // первоначальный суммарный отступ равен 0, т.к.
        // это накопительная переменная
        crds[i] = 0;
        // отклонение снежинки, если, например, поставить значение
        // Math.random() * 100, то эффект будет больше поход на снежную
        // бурю
        lftrght[i] = Math.random() * 15;
        // определяем размер шага с которым снежинка будет двигаться
        // влево и вправо, преодолевая значение lftrght[i]
        x_mv[i] = 0.03 + Math.random() / 10;
        // Снежинка - это текстовый символ, самый простой способ
        // нарисовать снежинку с собственным стилем - это использовать тег span
        // http://htmlbook.ru/html/span <-- вот тут написано про этот тег
        // присвоив id этому тегу, мы можем индивидуально обратиться к нему,
        // т.е. snow[] содержит id снежинок (тегов <span>)
        snow[i] = document.getElementById("s" + i);
        // Далее определяем особенности прорисовки снежинок
        // Выбираем тип шрифта, которым будем отображать снежинку, для
        // этого используем функцию (её мы определили выше) randommaker() - получает целое случайное число
        // из определённого диапазона.
        // Возможные шрифты мы заранее поместили в массив, их можно расширить, как и цвета
        snow[i].style.fontFamily = snowtype[randommaker(snowtype / length)];
        // выбираем размер снежинки, маленькие снежинки будут
        // восприниматься пользователем как находящиеся на заднем плане,
        // большие - на переднем
        // Для тех, кому интересно, рекомендую книгу "Разумный гла"
        // Р. Л. Грегори. В книге описаны различные оптические субъективные эффекты,
        // психология зрения
        snow[i].size = randommaker(snowsizerange) + snowminsize;
        snow[i].style.fontSize = snow[i].size + "px";
        // Определяем цвет
        snow[i].style.color = snowcolor[randommaker(snowcolor.length)];
        // Определяем скорость снежинки, обратите внимание, что скорость
        // зависит от размера
        snow[i].sink = sinkspeed * snow[i].size / 5;
        // Теперь определяем X и Y снежинки        
        snow[i].posx = randommaker(marginright - snow[i].size);        
        // Определяем y
        snow[i].posy = randommaker(2 * marginbottom - marginbottom - 2 * snow[i].size);
        // переводим относительные величины в конкретные, в нашем случае -
        // в пиксели
        snow[i].style.left = snow[i].posx + "px";
        snow[i].style.top = snow[i].posy + "px";
    }
    // начинаем прорисовку снега
    movesnow();
}

// функция реализует динамику снега
function movesnow() {
    
    if (ie5 || opera) {
        // высота
        marginbottom = document.body.clientHeight;
        // ширина рабочей области
        marginright = document.body.clientWidth;
    }
    else if (ns6) {
        marginbottom = window.innerHeight;
        marginright = window.innerWidth;
    }
    // цикл по снежинкам
    for (i = 0; i <= snowmax; i++) {
        // пусть снежинка переместиться немного влево или вправо
        crds[i] += x_mv[i];
        // перемещение снежинки вниз
        snow[i].posy += snow[i].sink;
        snow[i].style.left = snow[i].posx + lftrght[i] * Math.sin(crds[i]) + "px";
        snow[i].style.top = snow[i].posy + "px";
        // Если снежинка всё ещё в области, где её можно прорисовать
        // по оси Y она выше отступа снизу в два своих размера
        // или по оси X она правее на три своих размера
        if (snow[i].posy >= marginbottom + snow[i].size ||
            parseInt(snow[i].style.left) > (marginright - 7 * lftrght[i])) {
            // получить новые координаты X
            snow[i].posx = randommaker(marginright - snow[i].size);
            
            snow[i].posy = 0;
        }
    }
    // позволяет вызвать функцию один раз через определённый интервал времени:
    // 25 мил. сек. задержки
    var timer = setTimeout("movesnow()", 25);
}
// отображаем все снежинки в виде текста в <span>
// после каждого выполнения movesnow()
function lettersOn(){
    for (i = 0; i <= snowmax; i++) {
        document.write("<span id='s" + i + "' style='position:absolute;top:-" + snowmaxsize + "px;'>" + snowletter + "</span>");
    }
}
lettersOn()
