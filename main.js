"use strict";
const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
cvs.width = document.documentElement.clientWidth;
cvs.height = document.documentElement.clientHeight;



const sound = {
    step: new Audio('./sound/step.mp3'),
    lvlmus: new Audio('./sound/lvlmus.mp3'),
}



const srcImgData = {
    pD1: './img/Player/player_06.png',
    pD2: './img/Player/player_07.png',
    pU1: './img/Player/player_03.png',
    pU2: './img/Player/player_04.png',
    pR1: './img/Player/player_11.png',
    pR2: './img/Player/player_12.png',
    pL1: './img/Player/player_14.png',
    pL2: './img/Player/player_15.png',
    box: './img/Crates/crate_04.png',
    brick: './img/Blocks/block_01.png',
    //floor: './img/Ground/ground_06.png',
    place: './img/Environment/environment_09.png',
    success: './img/Crates/crate_05.png'
};
//info
let steps = 0;
//номер уровня n+1
let n = 0;

// колтчество  ящиков уровне
const boxLvlInfo = [1, 3, 4, 6]
    //размер одног блока
let sz = cvs.width / 26;
//p - player данные о персе
const p = {
    name: '',
    x: 0,
    y: 0,
    view: {
        right: true,
        left: false,
        up: false,
        down: false,
    }
};



const imgSprite = {};
loadImage(imgSprite, srcImgData);
const dataLvl = [
        [
            ".............",
            "....########.",
            "....#     x#.",
            "....# @  * #.",
            "....#      #.",
            "....########.",
            "............."
        ],

        [
            ".............",
            "....########.",
            "....#     x#.",
            "....# * **x#.",
            "....#x  # @#.",
            "....########.",
            "............."
        ],

        [
            ".............",
            "....##########.",
            "....#        #.",
            "....#*       #.",
            "....#@  *## ##.",
            "....#    #   #.",
            "....#**  #  x#.",
            "....#    #xxx#.",
            "....##########.",
            "...............",
        ],

        [
            ".....................",
            ".....#####...........",
            ".....#   #...........",
            ".....#*  #...........",
            "...###  *##..........",
            "...#  * * #..........",
            ".### # ## #...######.",
            ".#   # ## #####  xx#.",
            ".# *  *          xx#.",
            ".##### ### #@##  xx#.",
            ".....#     #########.",
            ".....#######.........",
            ".....................",
        ],

    ]
    //size = clienwidth/32

//деструктуризирую ключи к картинкам для доступности
const {
    pD1,
    pD2,
    pU1,
    pU2,
    pR1,
    pR2,
    pL1,
    pL2, //достать всеч персов
    box,
    brick,
    //floor,
    place,
    success,
} = imgSprite;
//запускаю игру по загрузки ресурсов
let pers = pR1;

let currentLvl = dataLvl[n].map(str => [...str]);


window.addEventListener('load', () => game(currentLvl));

function game(lvl) {
    render(lvl);
    window.addEventListener('keydown', (e) => logic(e, lvl));
};

function logic(e, lvl) {
    {
        //сохроняю данные кнопки для будущего изменения динамичесеих координат
        const route = e.key;
        //динамические координаты
        let dx = 0;
        let dy = 0;
        //переменная для хранение данных о возможности передвижения
        let move = 0;
        //роверяю кнопку и меняю координаты
        if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {

            //audio step
        }
        if (route === 'ArrowRight') {
            dx = 1
            dy = 0
            steps % 2 ? pers = pR1 : pers = pR2;
        };
        if (route === 'ArrowLeft') {
            dx = -1;
            dy = 0
            steps % 2 ? pers = pL1 : pers = pL2;
        };
        if (route === 'ArrowUp') {
            dx = 0;
            dy = -1;
            steps % 2 ? pers = pU1 : pers = pU2;
        };
        if (route === 'ArrowDown') {
            dx = 0;
            dy = 1;
            steps % 2 ? pers = pD1 : pers = pD2;
        };
        console.log(lvl)
            //получаю данные о передвижении
        move = canMove(dx, dy, lvl);
        //если перс сдвинуся перерисоваю его предыдущую позицию
        if (move) {
            //координата изменялась, добавляю шаг
            steps++;
            //заново отрисовываю пол за персом
            if (lvl[p.y][p.x] === ' ' || lvl[p.y][p.x] === '@') {
                ctx.clearRect(p.x * sz, p.y * sz, sz, sz);
                // ctx.drawImage(floor, p.x * sz, p.y * sz, sz, sz);
            }
            if (lvl[p.y][p.x] === 'x') {
                ctx.clearRect(p.x * sz, p.y * sz, sz, sz);
                ctx.drawImage(place, p.x * sz, p.y * sz, sz, sz);
            }
            //меняю координаты перса
            p.x += dx;
            p.y += dy;
            //заново отрисовываю элемент под персом
            draw(lvl[p.y][p.x], p.x, p.y, sz);
            //отрисовываю перса в новом месте
            ctx.drawImage(pers, p.x * sz, p.y * sz, sz, sz);
        }
        let b = winOrNo(lvl)

        if (b) {
            console.log(222)
            window.removeEventListener('keydown', (e) => logic(e, lvl))

        }
    }
}

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
            //отрисовываю пол под персом и получаю его координаты
            if (lvl[y][x] === '@') {
                //ctx.drawImage(floor, x * sz, y * sz, sz, sz);
                p.x = x;
                p.y = y;
            }
            draw(lvl[y][x], x, y, sz);
        }
    }
};

//проверка выйграл ли игрорк

function winOrNo(lvl) {
    //количество площадок на уровне
    let xPlace = 0;
    lvl.forEach(lvlArr => lvlArr.forEach(
        el => {
            el === '%' && xPlace++
        }));
    if (xPlace === boxLvlInfo[n]) {
        return 1
    }
    return 0
}





next.onclick = () => {
    steps = 0;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    p.x = 0;
    p.y = 0;
    n++
    game(dataLvl[n].map(str => [...str]))
}

function loadImage(coll, data) {
    for (let name in data) {
        let img = new Image();
        img.src = data[name];
        coll[name] = img;
    }
};

function loadedResourse() {
    /*возврщаем замкнутую переменную переменную  со значением true после загрузки всех ресурсов*/
}
let obj;

function loadedLvl(v) {
    fetch('./maps.json')
        .then(response => response.json())
        .then(data => data);
}

function gameInfo() {}
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
            return
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