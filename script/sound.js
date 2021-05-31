'use strict';
const scaleAll = document.querySelectorAll('.scale');
const controlAll = document.querySelectorAll('.vControl');
const chbxAll = document.querySelectorAll('.chbx');

const eventDrag = {
    begin: 'mousedown',
    run: 'mousemove',
    end: 'mouseup',
};

let { begin, run, end } = eventDrag;


if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    begin = 'touchstart';
    run = 'touchmove';
    end = 'touchend';
}
controlAll.forEach(control => {
    if (control.dataset.s === 'sound') {
        control.style.left = stepSound.volume + 'px'
    }
    scaleAll.forEach(scale => {
        let volume;
        control.addEventListener(begin, function(e) {
            let centerX = this.offsetWidth / 2;

            function moveAt(e) {
                let pX = run === 'touchmove' ? e.touches[0].pageX : e.pageX;
                volume = pX - scale.getBoundingClientRect().x - centerX;
                if (volume >= scale.offsetWidth - control.offsetWidth) {
                    volume = scale.offsetWidth - control.offsetWidth;
                }
                if (volume <= 0) {
                    volume = 0;
                }
    
                control.style.left = `${ volume }px`;

                if (control.dataset.s === 'sound') {
                    stepSound.volume = volume / 100;
                }
                if (control.dataset.s === 'music') {
                    music.volume = volume / 100;
                }

            }
            document.addEventListener(run, moveAt)
            window.addEventListener(end, (e) => document.removeEventListener(run, moveAt));
        });
    });

});

chbxAll.forEach(chbx => {
    chbx.addEventListener('change', () => {
        if (chbx.id === 'toggleMusic') {
            music.loop = true;
            chbx.checked ? playSound(music) : music.pause();
        }
        if (chbx.id === 'toggleSound') {
            music.loop = true;
            chbx.checked ? stepSound.muted = true : stepSound.muted = false;
        }
    })
})