"use strict";
const btnBlock = document.querySelector('.btnBlock');
const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
cvs.width = document.documentElement.clientWidth;
cvs.height = document.documentElement.clientHeight

console.log(document.documentElement.clientWidth)

const srcImgData = {
    marioR: './img/marioR.png',
    box: './img/box.png',
    brick: './img/brick.png',
    stone: './img/stone.jpg',
}
const player = {
    x: 0,
    y: 0,
    view: false, //true лево false право
}

const bSz = 40;

const imgSprite = {};
loadImage(imgSprite, srcImgData);
const dataLvl = {
    lvl3: [
        ".....................",
        ".....#####...........",
        ".....#   #...........",
        ".....#*  #...........",
        "...###  *##..........",
        "...#  * * #..........",
        ".### # ## #...######.",
        ".#   # ## #####  xx#.",
        ".# *  *  @        xx#.",
        ".##### ### # ##  xx#.",
        ".....#     #########.",
        ".....#######.........",
        ".....................",
    ],
    lvl1: [
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

    ]
}
const {
    lvl1
} = dataLvl;
let tempLvl = lvl1.map(str => [...str]);
const {
    marioR,
    marioL,
    box,
    brick,
    stone,
} = imgSprite;

window.addEventListener('load', () => game());

function game() {
    render(tempLvl);
    window.addEventListener('keydown', (e) => {
        console.log(e)
        let route = e.key;
        let dx = 0;
        let dy = 0;
        let [px, py] = [player.x, player.y];
        let move;
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
        move = doMove(dx, dy);
        //добавить транспортировку ящика
        console.log(move)

        if (move) {
            ctx.clearRect(player.x * bSz, player.y * bSz, bSz, bSz);
            player.x += dx
            player.y += dy
            ctx.drawImage(player.view ? marioL : marioR, player.x * bSz, player.y * bSz, 40, 40)
                //отрисовываем ящик
            if (move === 2) {

            }
            //console.log(px+dx*move, py+dy*move, "coord")



            e.target.addEventListener('touchend', () => clearInterval(move));
        }



    });
}
//переделать
// Проверка на возможность сдвинуться
function doMove(dx, dy) {
    // Текущее положение игрока
    let [px, py] = [player.x, player.y];
    // Проверить что впереди
    let b0 = tempLvl[py + dy][px + dx];
    // Если впереди стена, то  нельзя
    if (b0 === '#') return 0;
    // Есть ящик, проверить возможности сдвинуть его
    if (b0 === '*' || b0 === '%') {
        let b1 = tempLvl[py + 2 * dy][px + 2 * dx];

        // Впереди ящика стена или другой ящик, нельзя двинуться
        if (['#', '%', '*'].includes(b1)) return 0;
        // Иначе сдвинуть ящик
        tempLvl[py + dy][px + dx] = (b0 == '%' ? 'x' : ' ');

        ctx.clearRect((px + dx) * bSz, (py + dy) * bSz, bSz, bSz);

        tempLvl[py + 2 * dy][px + 2 * dx] = (b1 == 'x' ? '%' : '*');
        ctx.drawImage(box, (px + 2 * dx) * bSz, (py + 2 * dy) * bSz, bSz, bSz)
        return 2;
    }
    return 1;
}
//переделать
function paintElem(x, y, lvl) {
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
}

function render(lvl) {
    for (let y = 0; y < lvl.length; y++) {
        for (let x = 0; x < lvl[y].length; x++) {
            switch (lvl[y][x]) {
                case "#":
                    ctx.drawImage(brick, x * bSz, y * bSz, bSz, bSz)
                    break;
                case '@':
                    ctx.drawImage(player.view ? marioL : marioR, x * bSz, y * bSz, bSz, bSz)
                    player.x = x;
                    player.y = y;
                    break;
                case '*':
                    ctx.drawImage(box, x * bSz, y * bSz, bSz, bSz)
                    break;
                case '.':
                    ctx.drawImage(stone, x * bSz, y * bSz, bSz, bSz)
                    break;
            }
        }
    }
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


function draw(el, x, y, sz) {
    if (typeof el === "string") {
        el === '*' ? el = box : ''
        el === ''
        return ctx.drawImage(el, x * sz, y * sz, sz, sz);
    } else {
        return ctx.drawImage(el, x * sz, y * sz, sz, sz);
    }
}

console.log(draw('*'))
    /*const data = {
      boxes: [],
      sides: [],
      pers: {},
      dots: [],
    }
    let sz = 50;
    for (let y = 0; y < lvl.length; y++) {
      for (let x = 0; x < lvl[y].length; x++) {
        if (lvl[y][x] === 1) {
          let side = new Block(x * sz, y * sz);
          data.sides.push(side);
          ctx.fillStyle = 'darkblue';
          draw(x * sz, y * sz, sz)
        }
        if (lvl[y][x] === 2) {
          data.pers.x = x * sz;
          data.pers.y = y * sz;
          ctx.fillStyle = 'green';
          draw(x * sz, y * sz, sz);
        }
        if (lvl[y][x] === 3) {
          let box = new Block(x * sz, y * sz);
          data.boxes.push(box);
          ctx.fillStyle = 'brown';
          draw(x * sz, y * sz, sz);
        }
        if (lvl[y][x] === 4) {
          let dot = new Block(x * sz, y * sz);
          data.dots.push(dot);
          ctx.fillStyle = 'rgba(0, 150, 150, 0.4)';
          draw(x * sz, y * sz, sz)
        }
      }
    }
    const move = [data.pers]
    let run;
    btnBlock.addEventListener('touchstart', (e) => {
      if (e.target.dataset.key) {
        let route = e.target.dataset.key;
        run = setInterval(() => movement(move, lvl, route), 200)
      }
      e.target.addEventListener('touchend', () => stopMovement(run));
    })

    function movement(mv, lvl, key) {
      mv.forEach(p => {
        clear(p.x, p.y, sz);
        if (key === 'r')  p.x += 50;
        if (key === 'l')  p.x -= 50;
        if (key === 'u')  p.y -= 50;
        if (key === 'd')  p.y += 50;
        ctx.fillStyle = 'green'
        draw(p.x, p.y, sz);
        lvl.forEach((arrY, y) => {
          arrY.forEach((elX, x) => {
            if (elX === 1) {
              if (key === 'r' &&
                y * sz === p.y &&
                x * sz - sz === p.x) {
                stopMovement(run);
              }
              if (key === 'l' &&
                y * sz === p.y &&
                p.x - sz === x * sz) {
                stopMovement(run)
              }
              if (key === 'd' &&
                x * sz === p.x &&
                y * sz - sz === p.y) {
                stopMovement(run);
              }
              if (key === 'u' &&
                x * sz === p.x &&
                p.y - sz === y * sz) {
                stopMovement(run)
              }
            }
          });
        });
      });
    }

    function stopMovement(t) {
      clearInterval(t);
    }

    function draw(x, y, sz) {
      return ctx.fillRect(x, y, sz, sz);
    }

    function clear(x, y, sz) {
      return ctx.clearRect(x, y, sz, sz);
    }*/