// 古典作曲家完整資料庫
const COMPOSERS_ARCHIVE = [
  {
    id: 'chopin',
    name: 'Frédéric Chopin',
    title: '鋼琴詩人 • 蕭邦',
    era: 'romantic',
    eraLabel: 'Romanticism',
    lifespan: '1810 – 1849',
    quote: '「簡約是成熟的最終形式；在歷經一切繁複之後，藝術回歸於極致的純粹。」',
    bio: '將浪漫主義鋼琴表現力推至詩意巔峰的大師。其作品深刻融合了夜曲的細緻織體、馬厝卡舞曲的鄉愁，以及練習曲中革命性的觸鍵哲學。',
    masterpieces: [
      { name: 'Ballade No. 1 in G minor', key: 'Op. 23' },
      { name: 'Nocturne in C-sharp minor', key: 'Op. posth.' },
      { name: 'Polonaise "Heroic" in A-flat major', key: 'Op. 53' },
      { name: 'Piano Concerto No. 1 in E minor', key: 'Op. 11' }
    ]
  },
  {
    id: 'bach',
    name: 'J.S. Bach',
    title: '音樂之父 • 巴哈',
    era: 'baroque',
    eraLabel: 'Baroque',
    lifespan: '1685 – 1750',
    quote: '「所有的音樂的目的，皆在於榮耀神，並撫慰人的心靈。」',
    bio: '對位法與多聲部賦格的至高建築師。《十二平均律鍵盤曲集》與《郭德堡變奏曲》不僅奠定了近代鍵盤樂器的美學典範，更被後世譽為音樂的舊約聖經。',
    masterpieces: [
      { name: 'The Well-Tempered Clavier', key: 'BWV 846–893' },
      { name: 'Goldberg Variations', key: 'BWV 988' },
      { name: 'Partita No. 2 in C minor', key: 'BWV 826' },
      { name: 'Chromatic Fantasia and Fugue', key: 'BWV 903' }
    ]
  },
  {
    id: 'beethoven',
    name: 'Ludwig van Beethoven',
    title: '樂聖 • 貝多芬',
    era: 'classical',
    eraLabel: 'Classical / Romantic',
    lifespan: '1770 – 1827',
    quote: '「扼住命運的咽喉；它絕不能使我屈服。」',
    bio: '以 32 首鋼琴奏鳴曲拓展了鋼琴的動態極限與交響思維。他打破了古典時期的平穩均衡，以澎湃的力度對比與哲思，開拓通往浪漫主義的道路。',
    masterpieces: [
      { name: 'Piano Sonata No. 14 "Moonlight"', key: 'Op. 27 No. 2' },
      { name: 'Piano Sonata No. 23 "Appassionata"', key: 'Op. 57' },
      { name: 'Piano Concerto No. 5 "Emperor"', key: 'Op. 73' },
      { name: 'Piano Sonata No. 8 "Pathétique"', key: 'Op. 13' }
    ]
  },
  {
    id: 'debussy',
    name: 'Claude Debussy',
    title: '印象樂派奠基者 • 德布西',
    era: 'impressionism',
    eraLabel: 'Impressionism',
    lifespan: '1862 – 1918',
    quote: '「音樂存在於音符之間的寧靜之中。」',
    bio: '開創了近代鋼琴音色（Timbre）的新維度。擺脫傳統調性牽絆，大量運用五聲音階、全音階與踏板泛音色彩，將月光、微風與水波的幻影化作琴聲。',
    masterpieces: [
      { name: 'Clair de Lune (Suite bergamasque)', key: 'L. 75' },
      { name: 'Deux Arabesques', key: 'L. 66' },
      { name: 'Préludes: "La fille aux cheveux de lin"', key: 'L. 117' },
      { name: "Reflets dans l'eau (Images I)", key: 'L. 110' }
    ]
  },
  {
    id: 'mozart',
    name: 'W.A. Mozart',
    title: '音樂神童 • 莫札特',
    era: 'classical',
    eraLabel: 'Classical',
    lifespan: '1756 – 1791',
    quote: '「音樂不在於音符本身，而在於兩音之間的留白。」',
    bio: '古典主義清晰度、平衡感與天籟旋律的極致化身。其鋼琴奏鳴曲與鋼琴協奏曲結構晶瑩剔透，看似簡潔，卻對演奏者的觸鍵均勻度提出最高考驗。',
    masterpieces: [
      { name: 'Piano Sonata No. 11 in A major', key: 'K. 331' },
      { name: 'Piano Concerto No. 21 in C major', key: 'K. 467' },
      { name: 'Fantasia in D minor', key: 'K. 397' },
      { name: 'Piano Sonata No. 16 in C major', key: 'K. 545' }
    ]
  }
];

// 高效背景飄浮音符 Canvas (修復旋轉螢幕與疊加渲染 Bug)
class AmbientNotesBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.symbols = ['♩', '♪', '♫', '♬', '𝄞', '𝄢', '♯', '♭'];
    this.particles = [];
    this.animationId = null;

    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);

    this.resize();
    window.addEventListener('resize', this.resize);
    this.init();
    this.start();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // 重新調整越界粒子
    this.particles.forEach((p) => {
      if (p.x > this.canvas.width) p.x = Math.random() * this.canvas.width;
      if (p.y > this.canvas.height) p.y = Math.random() * this.canvas.height;
    });
  }

  init() {
    const count = Math.floor(window.innerWidth / 32);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        symbol: this.symbols[Math.floor(Math.random() * this.symbols.length)],
        size: Math.random() * 12 + 13,
        speedY: Math.random() * 0.35 + 0.15,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.35 + 0.1
      });
    }
  }

  start() {
    if (!this.animationId) {
      this.render();
    }
  }

  render() {
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

    this.animationId = requestAnimationFrame(this.render);
  }
}

// 頁面主控
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('ambient-canvas');
  new AmbientNotesBackground(canvas);

  let currentMaestro = COMPOSERS_ARCHIVE[0];
  let currentEra = 'all';

  // DOM 節點快取
  const showcaseCard = document.getElementById('composer-showcase');
  const eraTag = document.getElementById('composer-era-tag');
  const lifespanTag = document.getElementById('composer-lifespan');
  const composerName = document.getElementById('composer-name');
  const composerTitle = document.getElementById('composer-title');
  const composerQuote = document.getElementById('composer-quote');
  const composerBio = document.getElementById('composer-bio');
  const piecesList = document.getElementById('pieces-list');
  const maestroGrid = document.getElementById('maestro-grid');
  const eraPills = document.querySelectorAll('.era-pill');

  // 切換與呈現作曲家卡片 (修復 XSS 風險，改採標準 DOM 構建)
  function updateShowcase(composer) {
    currentMaestro = composer;

    showcaseCard.style.opacity = '0';
    showcaseCard.style.transform = 'translateY(6px)';

    setTimeout(() => {
      eraTag.textContent = composer.eraLabel;
      lifespanTag.textContent = composer.lifespan;
      composerName.textContent = composer.name;
      composerTitle.textContent = composer.title;
      composerQuote.textContent = composer.quote;
      composerBio.textContent = composer.bio;

      // 安全清空並組裝作品 DOM
      piecesList.innerHTML = '';
      const fragment = document.createDocumentFragment();

      composer.masterpieces.forEach((piece) => {
        const li = document.createElement('li');
        li.className = 'piece-row';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'piece-title';
        titleSpan.textContent = piece.name;

        const keySpan = document.createElement('span');
        keySpan.className = 'piece-key';
        keySpan.textContent = piece.key;

        li.appendChild(titleSpan);
        li.appendChild(keySpan);
        fragment.appendChild(li);
      });

      piecesList.appendChild(fragment);

      showcaseCard.style.opacity = '1';
      showcaseCard.style.transform = 'translateY(0)';
      syncActiveState();
    }, 180);
  }

  // 渲染名錄卡片
  function renderGallery(filterEra = 'all') {
    maestroGrid.innerHTML = '';
    const filtered = filterEra === 'all'
      ? COMPOSERS_ARCHIVE
      : COMPOSERS_ARCHIVE.filter((c) => c.era === filterEra);

    filtered.forEach((c) => {
      const card = document.createElement('div');
      card.className = `maestro-card ${c.id === currentMaestro.id ? 'active' : ''}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('data-id', c.id);
      card.setAttribute('aria-label', `${c.name}, ${c.eraLabel}`);

      const nameSpan = document.createElement('span');
      nameSpan.className = 'maestro-name';
      nameSpan.textContent = c.name;

      const eraSpan = document.createElement('span');
      eraSpan.className = 'maestro-era';
      eraSpan.textContent = c.eraLabel;

      card.appendChild(nameSpan);
      card.appendChild(eraSpan);

      const handleSelect = () => updateShowcase(c);
      card.addEventListener('click', handleSelect);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      });

      maestroGrid.appendChild(card);
    });
  }

  // 同步卡片選中樣式
  function syncActiveState() {
    document.querySelectorAll('.maestro-card').forEach((card) => {
      const isSelected = card.getAttribute('data-id') === currentMaestro.id;
      if (isSelected) {
        card.classList.add('active');
        card.setAttribute('aria-pressed', 'true');
      } else {
        card.classList.remove('active');
        card.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // 樂派標籤切換（修正狀態連動與 A11y 標記）
  eraPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      eraPills.forEach((p) => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });

      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      currentEra = pill.getAttribute('data-era');
      renderGallery(currentEra);

      // 若目前選中的作曲家不屬於新選的樂派，自動平滑切換至新樂派的第一位作曲家
      if (currentEra !== 'all' && currentMaestro.era !== currentEra) {
        const nextMaestro = COMPOSERS_ARCHIVE.find((c) => c.era === currentEra);
        if (nextMaestro) {
          updateShowcase(nextMaestro);
        }
      }
    });
  });

  // 初次掛載
  updateShowcase(COMPOSERS_ARCHIVE[0]);
  renderGallery('all');
});
