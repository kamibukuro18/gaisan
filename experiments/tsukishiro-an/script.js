(() => {
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-nav');

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  navToggle?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('is-open') ?? false;
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const roomData = {
    kasumi: {
      eyebrow: 'ROOM 01 / KASUMI',
      title: '霞',
      description: '朝の光が、庭の苔と障子をゆっくり起こす。雨の間と縁側を備えた、静けさの基準になる一室です。',
      size: '67㎡',
      capacity: '2〜4名',
      view: '苔庭',
      image: '../../assets/ryokan/tsukishiro-an-room.png',
      alt: '苔庭に面した月白庵の客室'
    },
    tsuki: {
      eyebrow: 'ROOM 02 / TSUKI',
      title: '月',
      description: '深い軒と低い灯りに包まれる、夜のための客室。読書と湯上がりの余白を長く取れる設計です。',
      size: '82㎡',
      capacity: '2名',
      view: '山あい',
      image: '../../assets/ryokan/tsukishiro-an-onsen.png',
      alt: '山あいの景色を望む月白庵の湯'
    },
    ai: {
      eyebrow: 'ROOM 03 / AI',
      title: '藍',
      description: '藍色の壁と木の香りを主役にした、最も内向きな一室。季節の音に耳を澄ますための小さな書斎があります。',
      size: '74㎡',
      capacity: '2〜3名',
      view: '杉林',
      image: '../../assets/ryokan/tsukishiro-an-ritual.png',
      alt: '雨上がりの庭に面した月白庵の滞在風景'
    }
  };

  const roomImage = document.querySelector('#room-image');
  const roomEyebrow = document.querySelector('#room-eyebrow');
  const roomTitle = document.querySelector('#room-title');
  const roomDescription = document.querySelector('#room-description');
  const roomSize = document.querySelector('#room-size');
  const roomCapacity = document.querySelector('#room-capacity');
  const roomView = document.querySelector('#room-view');
  const roomSelect = document.querySelector('#room-select');

  const selectRoom = (key) => {
    const room = roomData[key];
    if (!room) return;
    document.querySelectorAll('[data-room]').forEach((tab) => {
      const active = tab.dataset.room === key;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    if (roomImage) {
      roomImage.src = room.image;
      roomImage.alt = room.alt;
    }
    if (roomEyebrow) roomEyebrow.textContent = room.eyebrow;
    if (roomTitle) roomTitle.textContent = room.title;
    if (roomDescription) roomDescription.textContent = room.description;
    if (roomSize) roomSize.textContent = room.size;
    if (roomCapacity) roomCapacity.textContent = room.capacity;
    if (roomView) roomView.textContent = room.view;
    if (roomSelect) {
      const roomName = room.eyebrow.replace(/^ROOM \d+ \/ /, '');
      const matchingOption = [...roomSelect.options].find((option) => option.value.endsWith(roomName));
      if (matchingOption) roomSelect.value = matchingOption.value;
    }
  };
  document.querySelectorAll('[data-room]').forEach((tab) => {
    tab.addEventListener('click', () => selectRoom(tab.dataset.room));
  });

  const planData = {
    seasonal: { title: '季節の夕餉', description: '客室・夕食・朝食・貸切風呂を含む、月白庵の一泊を知るための基本プラン。' },
    stay: { title: '余白の二泊', description: '二泊目から変わる庭の表情と、予定を置かない時間を味わうための滞在プラン。' },
    breakfast: { title: '朝食と湯', description: '夕食を軽く、朝の読書と貸切風呂を主役にした短い滞在のためのプラン。' }
  };
  const planSelection = document.querySelector('#plan-selection');
  const planTitle = planSelection?.querySelector('strong');
  const planDescription = planSelection?.querySelector('p');
  document.querySelectorAll('[data-plan]').forEach((card) => {
    card.addEventListener('click', () => {
      const plan = planData[card.dataset.plan];
      if (!plan) return;
      document.querySelectorAll('[data-plan]').forEach((item) => {
        const active = item === card;
        item.classList.toggle('is-selected', active);
        item.setAttribute('aria-pressed', String(active));
      });
      if (planTitle) planTitle.textContent = plan.title;
      if (planDescription) planDescription.textContent = plan.description;
    });
  });

  const bookingForm = document.querySelector('#booking-form');
  const formStatus = document.querySelector('#form-status');
  bookingForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (formStatus) {
      formStatus.textContent = '予約デモを確認しました。送信・空室照会・保存は行っていません。';
    }
  });

  const stayDate = document.querySelector('#stay-date');
  if (stayDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    stayDate.min = `${yyyy}-${mm}-${dd}`;
  }
})();
