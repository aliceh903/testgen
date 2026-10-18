const btn = document.getElementById('play');
let playing = false;
btn.addEventListener('click', () => {
  playing = !playing;
  btn.textContent = playing ? '❚❚ 暫停' : '▶ 播放';
  document.querySelectorAll('.note').forEach(n =>
    n.style.animationPlayState = playing ? 'running' : 'paused');
});
