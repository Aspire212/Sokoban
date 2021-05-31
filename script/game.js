"use strict";
//sound

const playerScores = document.querySelector('.playerScores');
const restart = document.getElementById('restart');
const infoBlock = document.querySelector('.info');
const infoSteps = infoBlock.querySelector('.steps');
const infoLife = document.querySelector('.life');
const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
cvs.width = document.documentElement.clientWidth;
cvs.height = document.documentElement.clientHeight;

//звуки
const stepSound = new Audio('./sound/step.mp3');
const music = new Audio('./sound/lvlmus.mp3');
stepSound.muted = true;
stepSound.volume = 0.05

///src картинок
const srcImgData = {
    pD1: './img/Player/player_06.png',
    pD2: './img/Player/player_07.png',
    pU1: './img/Player/player_09.png',
    pU2: './img/Player/player_10.png',
    pR1: './img/Player/player_17.png',
    pR2: './img/Player/player_18.png',
    pL1: './img/Player/player_20.png',
    pL2: './img/Player/player_21.png',
    box: './img/Crates/crate_04.png',
    brick: './img/Blocks/block_01.png',
    floor: './img/Ground/ground_06.png',
    place: './img/Environment/environment_09.png',
    success: './img/Crates/crate_05.png'
};
//info
let steps = 0;
//номер уровня n+1
let n = 0;
let scores = 0;
playerScores.textContent = scores;
// колтчество  ящиков уровне
const boxLvlInfo = [1, 2, 3, 4, 6, 8, 9, 10, 11, 1];
//размер одног блока
let sz = cvs.height / 14;

infoBlock.style.height = sz + 'px';
//p - player данные о персе
const p = {
    name: '',
    x: 0,
    y: 0,
    life: 3,
    view: {
        right: true,
        left: false,
        up: false,
        down: false,
    },
};
infoLife.textContent = p.life;

const imgSprite = {};
loadImage(imgSprite, srcImgData);

//деструктуризирую ключи к картинкам для доступности
const {
    pD1,
    pD2,
    pU1,
    pU2,
    pR1,
    pR2,
    pL1,
    pL2,
    brick,
    box,
    floor,
    place,
    success,
} = imgSprite;
//запускаю игру по загрузки ресурсов
let pers = pR1;

let triggerGame = 'keydown'
let objEvent = window;

const dataLvl = [

    [
        "......................",
        "......................",
        "..........########....",
        "..........#     x#....",
        "..........# @  * #....",
        "..........#      #....",
        "..........########....",
        "......................",
    ],

    [
        "......................",
        "......................",
        "..........###########.",
        "..........#   #x    #.",
        "..........#*  @ *   #.",
        "..........#x #      #.",
        "..........###########.",
        "......................",
    ],

    [
        "......................",
        "......................",
        "..........########....",
        "..........#     x#....",
        "..........# * **x#....",
        "..........#x  # @#....",
        "..........########....",
        "......................",
    ],
    [
        "......................",
        "......................",
        "..........###########.",
        "..........#         #.",
        "..........# *       #.",
        "..........# @  *## ##.",
        "..........#     #   #.",
        "..........# **  #  x#.",
        "..........#     #xxx#.",
        "..........###########.",
        ".......................",
    ],

    [
        "..........................",
        "..........#####...........",
        "..........#   #...........",
        "..........#*  #...........",
        "........###  *##..........",
        "........#  * * #..........",
        "......### # ## #...######.",
        "......#   # ## #####  xx#.",
        "......# *  *          xx#.",
        "......##### ### #@##  xx#.",
        "..........#     #########.",
        "..........#######.........",
        "..........................",
    ],
    [
        "...........................",
        "........##########.........",
        "........#  #### @#.........",
        "........#     *  #.........",
        "........#   *## *#.........",
        "........##*#xxx# #.........",
        "........## *xxx  #.........",
        "........## #x x# ##........",
        "........##   # #* #........",
        "........# *  *    #........",
        "........#         #........",
        "........###########.........",
        "............................",
    ],
    [
        "...........................",
        ".............#######.......",
        ".........#####  #  ####....",
        ".........#   #   *    #....",
        "......#### #** ##  #  #....",
        ".....##      # #  ## ###...",
        ".....#  ### *#*  *  *  #...",
        ".....#xxx    # ##  #   #...",
        ".....#xxx#    @ # ### ##...",
        ".....#xxx        *  *  #...",
        ".....###########   #   #...",
        "...............#########...",
        "...........................",
    ],


    [
        "........................",
        ".....############........",
        ".....#xx  #     ####.....",
        ".....#xx  # *  *   #.....",
        ".....#xx  #*####   #.....",
        ".....#xx    @ ##   #.....",
        ".....#xx  # #  *  ##.....",
        ".....###### ##* *  #.....",
        ".......# *  * * *  #.....",
        ".......#    #      #.....",
        ".......#############....",
        "........................",
    ],
    [
        ".........................",
        "...........#########.....",
        "...........#   #  @#.....",
        "...........# * #* ##.....",
        "...........# *   *##.....",
        "..........##*  *  ##.....",
        "..######### *  ## ###....",
        "..#xxxx  ## *   *  ##....",
        "..###xxx    *       #....",
        "..##xxxx * ##########....",
        "..#########..............",
        ".........................",
    ],


    [
        "......................",
        "......................",
        "..........########....",
        "..........#     x#....",
        "..........# @  * #....",
        "..........#      #....",
        "..........########....",
        "......................",
    ],


];


//делаю многомерный массив
let currentLvl = dataLvl[n].map(str => [...str]);

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    triggerGame = 'touchstart';
    objEvent = cvs;
}


//ресайз
window.addEventListener('resize', resizeScreen);

//первый запускu
window.addEventListener('load', () => {
    start(n, currentLvl)

});

//restart
restart.addEventListener('click', restartLvl);

function game(lvl) {
    infoSteps.textContent = ` ${steps}`;
    render(lvl);
    objEvent.addEventListener(triggerGame, logic);
};


//основная логика игры
function logic(e) {
    let lvl = currentLvl;
    //сохроняю данные кнопки для будущего изменения динамичесеих координат
    const route = e.key;
    //динамические координаты
    let dx = 0;
    let dy = 0;
    //переменная для хранение данных о возможности передвижения
    let move = 0;
    //переменная для храненияя
    let nextLvl = false;

    let clientX;
    let clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }
    //проверяю кнопку и меняю координаты

    if (route === 'ArrowRight' ||
        clientX >= cvs.width - 100 &&
        clientX <= cvs.width &&
        clientY >= 100 &&
        clientY <= cvs.width - 100) {
        dx = 1
        dy = 0
        steps++
        steps % 2 ? pers = pR1 : pers = pR2;
    };
    if (route === 'ArrowLeft' ||
        clientX >= 0 &&
        clientX <= 100 &&
        clientY >= 100 &&
        clientY <= cvs.width - 100) {
        dx = -1;
        dy = 0
        steps++
        steps % 2 ? pers = pL1 : pers = pL2;
    };
    if (route === 'ArrowUp' ||
        clientY >= 30 &&
        clientY <= 130) {

        dx = 0;
        dy = -1;
        steps++
        steps % 2 ? pers = pU1 : pers = pU2;
    };
    if (route === 'ArrowDown' ||
        clientY >= cvs.height - 70 &&
        clientY <= cvs.height) {
        dx = 0;
        dy = 1;
        steps++
        steps % 2 ? pers = pD1 : pers = pD2;
    };
    //получаю данные о передвижении
    move = canMove(dx, dy, lvl);
    //если перс сдвинуся перерисоваю его предыдущую позицию
    if (move) {
        let oX = p.x;
        let oY = p.y;
        //координата изменялась, добавляю шаг
        infoSteps.textContent = ` ${steps}`;
        //заново отрисовываю пол за персом
        if (lvl[p.y][p.x] === ' ' || lvl[p.y][p.x] === '@') {
            ctx.clearRect(p.x * sz, p.y * sz, sz, sz);
            ctx.drawImage(floor, p.x * sz, p.y * sz, sz, sz);
        };
        if (lvl[p.y][p.x] === 'x') {
            ctx.clearRect(p.x * sz, p.y * sz, sz, sz);
            ctx.drawImage(floor, p.x * sz, p.y * sz, sz, sz);
            ctx.drawImage(place, p.x * sz, p.y * sz, sz, sz);
        };
        //меняю координаты перса
        p.x += dx;
        p.y += dy;

        if (oX < p.x || oY < p.y ||
            oX > p.x || oY > p.y) playSound(stepSound);
        //playSound(stepSound)

        //заново отрисовываю элемент под персом
        draw(lvl[p.y][p.x], p.x, p.y, sz);
        //отрисовываю перса в новом месте
        ctx.drawImage(pers, p.x * sz, p.y * sz, sz, sz);
    };

    nextLvl = winOrNo(lvl);

    if (nextLvl) {
        playerData.scores += ((boxLvlInfo[n] + 1) * 200 - steps);
        playerScores.textContent = playerData.scores;
        setData(cmd, {
            [playerData.name]: playerData.scores
        })
        playerData.scores = 0
        n++;
        if (n === boxLvlInfo.length) {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            cvsMess('Вы прошли игру!')
            setTimeout(() => {
                changeScreen(mainScreen, gameScreen, false);
                n = 0;
                scores = 0
                clearLvl()
            }, 2000);
        } else {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            cvsMess('Уровень пройден')
            setTimeout(() => clearLvl(), 1000);
        }
    };

};

// Проверка на возможность сдвинуться
function canMove(dx, dy, lvl) {
    // Проверяю что впереди
    let res = lvl[p.y + dy][p.x + dx];
    // Если впереди стена, то не двигаюсь
    if (res === '#') return 0;
    // Есть ящик, проверить возможности сдвинуть его
    if (res === '*' || res === '%') {
        let res1 = lvl[p.y + 2 * dy][p.x + 2 * dx];
        // Впереди ящика стена или другой ящик, нельзя двинуться
        if (['#', '%', '*'].includes(res1)) return 0;
        // Иначе сдвигаю ящик
        lvl[p.y + dy][p.x + dx] = (res == '%' ? 'x' : ' ');
        //занимаюсь перерисовками
        ctx.clearRect((p.x + dx) * sz, (p.y + dy) * sz, sz, sz);
        //если ящик на конечной позиции то, меняю его на  succes
        lvl[p.y + 2 * dy][p.x + 2 * dx] = (res1 == 'x' ? '%' : '*');
        let sym;
        //ящик вышел наконечную позицию?
        res === '%' ? sym = 'x' : sym = ' ';
        //ящик попал на конечную позицию?
        res1 === 'x' ? sym = '%' : sym = '*';
        //отрисовываю результат
        draw(sym, (p.x + 2 * dx), (p.y + 2 * dy), sz);
        return 2;
    }
    return 1;
}
//по вызову перебираю lvl и отрисовываю его в канвас
function render(lvl) {
    for (let y = 0; y < lvl.length; y++) {
        for (let x = 0; x < lvl[y].length; x++) {
            ///отрисовываю  пол по всему полю
            if (lvl[y][x] !== '.') {
                ctx.drawImage(floor, x * sz, y * sz, sz, sz);

            }
            //получаю координаты перса его координаты
            if (lvl[y][x] === '@') {
                p.x = x;
                p.y = y;
            };
            draw(lvl[y][x], x, y, sz);
        };
    };
};

function start(n, lvl) {
    splashScreen(n);
    setTimeout(() => {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        game(lvl);
    }, 500);
}
//Заставка
function splashScreen(n) {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    cvsMess(`Уровень ${n + 1}`);
};

function cvsMess(mess) {
    ctx.font = "22px  Dosis, Source Sans Pro, Helvetica Neue, Arial, sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = 'yellowgreen';
    ctx.fillText(mess, cvs.width / 2, cvs.height / 2 - 30);
}

function resizeScreen() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    cvs.width = document.documentElement.clientWidth;
    cvs.height = document.documentElement.clientHeight;
    sz = cvs.height / 14;
    infoBlock.style.height = sz + 'px';
    game(currentLvl);
};

//функция отрисовки одного элемента
function draw(sym, x, y, sz) {
    let img;
    switch (sym) {
        case '*':
            img = box;
            break;
        case '#':
            img = brick;
            break;
        case ' ':
            img = floor;
            break;
        case '%':
            img = success;
            break;
        case 'x':
            img = place;
            break;
        case '@':
            img = pers;
            break;
        default:
            return;
    }
    return ctx.drawImage(img, x * sz, y * sz, sz, sz);
}

//проверка выйграл ли игроркs
function winOrNo(lvl) {
    //количество площадок на уровне
    let xPlace = 0;
    lvl.forEach(lvlArr => lvlArr.forEach(
        el => {
            el === '%' && xPlace++
        }));
    if (xPlace === boxLvlInfo[n]) {

        return true;
    }
    return false;
}

function restartLvl() {
    p.life -= 1;
    infoLife.textContent = p.life;
    if (!p.life) {
        restart.textContent = 'Закончить'
    }
    if (p.life < 0) {
        infoLife.textContent = 0;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        cvsMess('Вы проиграли');
        p.x = 0;
        p.y = 0;
        p.life = 3;
        n = 0;

        restart.textContent = 'Заново'
        currentLvl = dataLvl[n].map(str => [...str]);
        setTimeout(() => {
            changeScreen(mainScreen, gameScreen, false);
            infoLife.textContent = p.life;
            start(n, currentLvl);
        }, 1000);
    } else {
        clearLvl();
    }
}

function clearLvl() {
    window.removeEventListener('keydown', logic);
    steps = 0;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    p.x = 0;
    p.y = 0;
    currentLvl = dataLvl[n].map(str => [...str]);
    start(n, currentLvl);
}


function loadImage(coll, data) {
    for (let name in data) {
        let img = new Image();
        img.src = data[name];
        coll[name] = img;
    }
};

function playSound(sound) {
    sound.load();
    sound.addEventListener('canplaythrough', () => sound.play())
}

function mutedStep() {
    stepSound.muted = !stepSound.muted
}