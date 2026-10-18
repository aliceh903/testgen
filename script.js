// 古典鋼琴琴音合成器 (使用 Web Audio API，帶溫潤衰減)
class PianoAcousticEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 播放經典主題動機的琶音
  playMotif(notes) {
    this.init();
    notes.forEach((item, index) => {
      setTimeout(() => {
        this.triggerPianoKey(item.freq, item.duration || 0.8);
      }, item.delay || index * 220);
    });
  }

  triggerPianoKey(freq, duration) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // 採用三角波並混和微幅泛音質感
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // 琴槌打擊起音 (Attack) 與鋼琴延音踏板衰減 (Decay & Release)
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }
}

// 飄浮音符 Canvas 背景
class SheetNotesBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.symbols = ['♩', '♪', '♫', '♬', '𝄞', '𝄢', '♯', '♭'];
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.init();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    const count = Math.floor(window.innerWidth / 30);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        symbol: this.symbols[Math.floor(Math.random() * this.symbols.length)],
        size: Math.random() * 12 + 12,
        speedY: Math.random() * 0.35 + 0.15,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.35 + 0.1
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

// 古典作曲家資料庫
const COMPOSERS_DATA = [
  {
    id: 'chopin',
    name: 'Frédéric Chopin',
    subname: '鋼琴詩人 • 蕭邦',
    era: 'romantic',
    eraLabel: 'Romanticism',
    years: '1810 – 1849',
    bio: '將浪漫主義鋼琴技術推向詩意巔峰，作品中飽含夜曲的靜謐、圓舞曲的高雅與波蘭舞曲的沉痛鄉愁。',
    works: [
      'Nocturne in E-flat major, Op. 9 No. 2',
      'Ballade No. 1 in G minor, Op. 23',
      'Fantaisie-Impromptu, Op. 66'
    ],
    motifName: 'Listen to Nocturne Motif',
    motifNotes: [
      { freq: 311.13, delay: 0, duration: 0.6 },    // Eb4
      { freq: 392.00, delay: 200, duration: 0.6 },  // G4
      { freq: 466.16, delay: 400, duration: 0.6 },  // Bb4
      { freq: 622.25, delay: 600, duration: 1.0 },  // Eb5
      { freq: 587.33, delay: 900, duration: 1.2 }   // D5
    ]
  },
  {
    id: 'bach',
    name: 'J.S. Bach',
    subname: '音樂之父 • 巴哈',
    era: 'baroque',
    eraLabel: 'Baroque',
    years: '1685 – 1750',
    bio: '對位法與賦格的至高建築師，《十二平均律鍵盤曲集》奠定了近代鍵盤樂器的調性基礎與演奏聖經。',
    works: [
      'The Well-Tempered Clavier, BWV 846-893',
      'Goldberg Variations, BWV 988',
      'Italian Concerto in F major, BWV 971'
    ],
    motifName: 'Listen to Prelude Motif',
    motifNotes: [
      { freq: 261.63, delay: 0, duration: 0.5 },    // C4
      { freq: 329.63, delay: 180, duration: 0.5 },  // E4
      { freq: 392.00, delay: 360, duration: 0.5 },  // G4
      { freq: 523.25, delay: 540, duration: 0.8 },  // C5
      { freq: 659.25, delay: 720, duration: 1.0 }   // E5
    ]
  },
  {
    id: 'beethoven',
    name: 'Ludwig van Beethoven',
    subname: '樂聖 • 貝多芬',
    era: 'classical',
    eraLabel: 'Classical / Romantic',
    years: '1770 – 1827',
    bio: '以 32 首鋼琴奏鳴曲開拓了鋼琴的動態張力與哲思深度，從古典典範走向浪漫狂瀾的偉大開創者。',
    works: [
      'Piano Sonata No. 14 "Moonlight", Op. 27 No. 2',
      'Piano Sonata No. 8 "Pathétique", Op. 13',
      'Piano Sonata No. 23 "Appassionata", Op. 57'
    ],
    motifName: 'Listen to Moonlight Motif',
    motifNotes: [
      { freq: 220.00, delay: 0, duration: 0.6 },    // A3
      { freq: 277.18, delay: 240, duration: 0.6 },  // C#4
      { freq: 329.63, delay: 480, duration: 0.6 },  // E4
      { freq: 440.00, delay: 720, duration: 1.2 }   // A4
    ]
  },
  {
    id: 'debussy',
    name: 'Claude Debussy',
    subname: '印象樂派奠基者 • 德布西',
    era: 'romantic',
    eraLabel: 'Impressionism',
    years: '1862 – 1918',
    bio: '打破傳統功能和聲，使用全音階、五聲音階與泛音踏板色彩，營造光影流動與月色水漾的琴音仙境。',
    works: [
      'Clair de Lune (Suite bergamasque)',
      'Deux Arabesques, L. 66',
      'Préludes, Book 1 & 2'
    ],
    motifName: 'Listen to Clair de Lune Motif',
    motifNotes: [
      { freq: 415.30, delay: 0, duration: 0.7 },    // Ab4
      { freq: 554.37, delay: 260, duration: 0.7 },  // Db5
      { freq: 622.25, delay: 520, duration: 0.8 },  // Eb5
      { freq: 830.61, delay: 780, duration: 1.4 }   // Ab5
    ]
  }
];

// 頁面渲染與互動控制
document.addEventListener('DOMContentLoaded', () => {
  const piano = new PianoAcousticEngine();
  const canvas = document.getElementById('notes-canvas');
  new SheetNotesBackground(canvas);

  let currentComposer = COMPOSERS_DATA[0];

  // DOM 元素快取
  const eraBadge = document.getElementById('composer-era');
  const yearsLabel = document.getElementById('composer-years');
  const composerName = document.getElementById('composer-name');
  const composerSubname = document.getElementById('composer-subname');
  const composerBio = document.getElementById('composer-bio');
  const worksList = document.getElementById('works-list');
  const motifBtn = document.getElementById('play-motif-btn');
  const motifBtnText = document.getElementById('motif-btn-text');
  const composersGrid = document.getElementById('composers-grid');
  const eraTabs = document.querySelectorAll('.era-tab');
  const heroCard = document.getElementById('composer-card');

  // 渲染作曲家卡片
  function renderComposer(composer) {
    currentComposer = composer;

    heroCard.style.opacity = '0';
    heroCard.style.transform = 'translateY(6px)';

    setTimeout(() => {
      eraBadge.textContent = composer.eraLabel;
      yearsLabel.textContent = composer.years;
      composerName.textContent = composer.name;
      composerSubname.textContent = composer.subname;
      composerBio.textContent = composer.bio;
      motifBtnText.textContent = composer.motifName;
      motifBtn.setAttribute('aria-label', `聆聽 ${composer.name} 的主題動機音符`);

      // 渲染曲目
      worksList.innerHTML = '';
      composer.works.forEach((w) => {
        const li = document.createElement('li');
        li.textContent = w;
        worksList.appendChild(li);
      });

      heroCard.style.opacity = '1';
      heroCard.style.transform = 'translateY(0)';
      updateChipActiveState();
    }, 180);
  }

  // 渲染底部選擇清單
  function renderGrid(filterEra = 'all') {
    composersGrid.innerHTML = '';
    const filtered = filterEra === 'all' 
      ? COMPOSERS_DATA 
      : COMPOSERS_DATA.filter((c) => c.era === filterEra);

    filtered.forEach((c) => {
      const chip = document.createElement('div');
      chip.className = `composer-chip ${c.id === currentComposer.id ? 'active' : ''}`;
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');
      chip.setAttribute('data-id', c.id);
      chip.innerHTML = `
        <span class="chip-name">${c.name}</span>
        <span class="chip-era">${c.eraLabel}</span>
      `;

      chip.addEventListener('click', () => renderComposer(c));
      composersGrid.appendChild(chip);
    });
  }

  function updateChipActiveState() {
    document.querySelectorAll('.composer-chip').forEach((chip) => {
      if (chip.getAttribute('data-id') === currentComposer.id) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // 試聽按鈕點擊
  motifBtn.addEventListener('click', () => {
    piano.playMotif(currentComposer.motifNotes);
    motifBtn.style.boxShadow = '0 0 18px rgba(212, 175, 55, 0.45)';
    setTimeout(() => {
      motifBtn.style.boxShadow = '';
    }, 1400);
  });

  // 樂派標籤篩選
  eraTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      eraTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const era = tab.getAttribute('data-era');
      renderGrid(era);
    });
  });

  // 初始化
  renderComposer(COMPOSERS_DATA[0]);
  renderGrid('all');
});
