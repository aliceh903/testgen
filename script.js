// Web Audio API 合成器與古典音樂音符模擬
class MusicSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 播放具古典鋼琴泛音質感的和弦琶音
  playArpeggio(frequencies, duration = 0.6) {
    this.init();
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, duration);
      }, index * 140); // 模擬優雅的琶音節奏 (Arpeggio)
    });
  }

  playTone(freq, duration) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // 採用 Triangle 波形模擬溫潤的撥弦/琴鍵音質
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // 古典音效的指數衰減 (Decay & Release)
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}

// 飄浮音符 Canvas 背景動畫
class FloatingNotesBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.notes = ['♩', '♪', '♫', '♬', '𝄞', '𝄢'];
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initParticles() {
    const count = Math.floor(window.innerWidth / 28);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        symbol: this.notes[Math.floor(Math.random() * this.notes.length)],
        size: Math.random() * 14 + 12,
        speedY: Math.random() * 0.4 + 0.2,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.45 + 0.15
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#d4af37';

    this.particles.forEach((p) => {
      this.ctx.globalAlpha = p.opacity;
      this.ctx.font = `${p.size}px serif`;
      this.ctx.fillText(p.symbol, p.x, p.y);

      p.y -= p.speedY;
      p.x += p.speedX;

      // 超出邊界時重置到底部
      if (p.y < -20) {
        p.y = this.canvas.height + 20;
        p.x = Math.random() * this.canvas.width;
      }
      if (p.x < -20) p.x = this.canvas.width + 20;
      if (p.x > this.canvas.width + 20) p.x = -20;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// 頁面互動掛載
document.addEventListener('DOMContentLoaded', () => {
  const synth = new MusicSynthesizer();
  const canvas = document.getElementById('music-canvas');
  new FloatingNotesBackground(canvas);

  const generateBtn = document.getElementById('generate-btn');
  const visualizer = document.getElementById('visualizer');
  const trackItems = document.querySelectorAll('.track-item');

  // 古典自然音階頻率池 (C Minor / Pentatonic)
  const classicalScales = [
    [261.63, 311.13, 392.0, 523.25, 622.25], // C Minor
    [220.0, 261.63, 329.63, 440.0, 523.25],  // A Minor
    [196.0, 246.94, 293.66, 392.0, 493.88]   // G Major
  ];

  generateBtn.addEventListener('click', () => {
    // 視覺回饋
    visualizer.classList.add('active');
    generateBtn.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.4)';

    // 隨機選取一組古典和弦進行
    const scale = classicalScales[Math.floor(Math.random() * classicalScales.length)];
    synth.playArpeggio(scale, 1.2);

    setTimeout(() => {
      visualizer.classList.remove('active');
      generateBtn.style.boxShadow = '';
    }, scale.length * 140 + 800);
  });

  // 樂章卡片點擊試聽
  trackItems.forEach((item) => {
    item.addEventListener('click', () => {
      const notesAttr = item.getAttribute('data-notes');
      if (notesAttr) {
        const notes = notesAttr.split(',').map(Number);
        synth.playArpeggio(notes, 0.8);
      }
    });
  });
});
