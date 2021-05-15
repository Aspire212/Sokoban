"use strict";
const btnBlock = document.querySelector('.btnBlock');
const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
cvs.width = document.documentElement.clientWidth;
cvs.height = document.documentElement.clientHeight

//Данные о картинках
const srcImgData = {
    marioR: './img/Player/player_11.png',
    box: './img/Crates/crate_44.png',
    brick: './img/Blocks/block_04.png',
    stone: './img/Blocks/block_06.png',
    place: './img/Crates/crate_31.png',
    succes: './img/Crates/crate_40.png'
};

//данные о персонаже
const player = {
    x: 0,
    y: 0,
    view: false, //true лево false право
}

//размер одного блока
const bSz = 40;

//картинки
const imgSprite = {};

//уровень
let n = 0;

//загружаем картинки 
loadImage(imgSprite, srcImgData);

//карта уровней
const dataLvl = [
        [
            ".....................",
            ".....#####...........",
            ".....#   #...........",
            ".....#*  #...........",
            "...###  *##..........",
            "...#  * * #..........",
            ".### # ## #...######.",
            ".#   # ## #####  xx#.",
            ".# *  *  @       xx#.",
            ".##### ### # ##  xx#.",
            ".....#     #########.",
            ".....#######.........",
            ".....................",
        ],
        [
            "#####################",
            "#                   #",
            "#                   #",
            "#                   #",
            "#                   #",
            "#                   #",
            "#        @          #",
            "#        *          #",
            "#                   #",
            "#                   #",
            "#                   #",
            "#                   #",
            "#####################",

        ],
    ]
    //заменяю смтроки на массивы текущем уровне
const currentLvl = dataLvl[n].map(str => [...str]);

//деструктуризирую ключи картинок для доступности
const {
    marioR,
    place,
    box,
    brick,
    stone,
    succes,
} = imgSprite;


//запуск игыры по загрузке данных
window.addEventListener('load', () => game(currentLvl));


//сама игра
function game(lvl) {
    render(lvl);
    window.addEventListener('keydown', (e) => {
        const route = e.key;
        let dx = 0;
        let dy = 0;
        let move;
        let [px, py] = [player.x, player.y];
        if (route === 'ArrowRight') {
            dx = 1
            dy = 0
        };
        if (route === 'ArrowLeft') {
            dx = -1;
            dy = 0

        };

        if (route === 'ArrowUp') {
            dx = 0;
            dy = -1;
        };

        if (route === 'ArrowDown') {
            dx = 0;
            dy = 1;
        };
        move = doMove(dx, dy, currentLvl);
        if (move) {
            //стираю персонаж
            ctx.clearRect(player.x * bSz, player.y * bSz, bSz, bSz);
            //меняю его координаты
            player.x += dx;
            player.y += dy;
            //отрисовываю персонажа
            ctx.drawImage(player.view ? marioL : marioR, player.x * bSz, player.y * bSz, bSz, bSz)
        };
    });
};

//логика игры

//переделать
// Проверка на возможность сдвинуться
function doMove(dx, dy, lvl) {
    // Текущее положение игрока
    let [px, py] = [player.x, player.y];
    // Проверить что впереди
    let res0 = lvl[player.y + dy][px + dx];
    // Если впереди стена, то  стоп
    if (res0 === '#') return 0;
    // Есть ящик, проверить возможности сдвинуть его
    if (res0 === '*' || res0 === '%') {
        let res1 = lvl[py + 2 * dy][px + 2 * dx];

        // Впереди ящика стена или другой ящик, нельзя двинуться
        if (['#', '%', '*'].includes(res1)) {
            return 0;
        }
        // Иначе сдвинуть ящик
        lvl[py + dy][px + dx] = (res0 == '%' ? 'x' : ' ');
        ctx.clearRect((px + dx) * bSz, (py + dy) * bSz, bSz, bSz, bSz);
        lvl[py + 2 * dy][px + 2 * dx] = (res1 == 'x' ? '%' : '*');
        let img;
        //доделать отрисовку
        res0 == '%' ? img = place : ' '
        res1 == 'x' ? img = succes : img = box
        console.log(img)
        ctx.drawImage(img, (px + 2 * dx) * bSz, (py + 2 * dy) * bSz, bSz, bSz);
        return 2;
    }
    return 1;
};

//рендер функция
function render(lvl) {
    for (let y = 0; y < lvl.length; y++) {
        for (let x = 0; x < lvl[y].length; x++) {
            draw(lvl[y][x], x, y, bSz);
        }
    }
};


//отрисовка для рендера
function draw(el, x, y, sz) {
    switch (el) {
        case "#":
            ctx.drawImage(brick, x * sz, y * sz, sz, sz);
            break;
        case '@':
            ctx.drawImage(player.view ? marioL : marioR, x * sz, y * sz, sz, sz);
            player.x = x;
            player.y = y;
            break;
        case '*':
            ctx.drawImage(box, x * sz, y * sz, sz, sz);
            break;
        case '%':
            ctx.drawImage(succes, x * sz, y * sz, sz, sz);
            break;
        case 'x':
            ctx.drawImage(place, x * sz, y * sz, sz, sz);
            break;
    }
};



///загрузка картинок ========= переделаьть
function loadImage(coll, data) {
    for (let name in data) {
        let img = new Image();
        img.src = data[name];
        coll[name] = img;
    }
};

//будущая загрузка всех ресурсов
function loadedResourse() {
    /*возврщаем замкнутую переменную переменную  со значением true после загрузки всех ресурсов*/
}

function loadedLvl(v) {
    fetch('./maps.json')
        .then(response => response.json())
        .then(data => data);
}

//функция собирающая и выводящая информационные данные
function gameInfo() {};


//рестарт
function restart() {};

//загрузка карт из json
/*

    function startGame(){

        $.getJSON("maps.json", function(data) {
            mapsObject = data;
            console.log(data);
            myGameCanvas = new Game(mapsObject);
            myGameCanvas.start(0);
        });
    }
*/
/*function paintElem(x, y, lvl) {
    let temp = lvl[y][x];
    switch (temp) {
        case '#':
            t = 'brick';
            break;
        case '.':
            t = 'stone';
            break; // Кирпичи
        case '*':
            t = 'box';
            break; // Ящик
        case '%':
            t = 'box';
            break; // Ящик на полу
        case 'x':
            t = 'place';
            break;
        default:
            t = '';
    }
}*/