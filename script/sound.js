'use strict'
const scale = document.querySelector('.scale');
const control = document.querySelector('.control');

const eventAction = {
  begin: 'mousedown',
  run:   'mousemove',
  end:   'mouseup'
}

let {begin, run, end} = eventAction

//ориентация экрпна телефона
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
  begin = 'touchstart'
  run = 'touchmove'
  end = 'touchend'
}



let volume;
control.addEventListener(begin, function(e) {
  let centerX = this.offsetWidth / 2;

  function moveAt(e) {
    let pX = run === 'mousemove' ? e.pageX : e.touches[0].pageX
    volume = pX - scale.getBoundingClientRect().x - centerX;
    if (volume >= scale.offsetWidth - control.offsetWidth) {
      volume = scale.offsetWidth - control.offsetWidth;
    }
    if (volume <= 0) {
      volume = 0;
    }
    //mus.volume = volume / 180;
    control.style.left = `${volume}px`;
  }
  document.addEventListener(run, moveAt)
  this.addEventListener(end, (e) => {
    console.log(e)
    document.removeEventListener(run, moveAt)
  });
  //square.addEventListener('touchcancel')
});
