(() => {
  const body = document.body;
  const stage = document.getElementById('signal');
  const canvas = document.getElementById('signal-canvas');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  const seedReadout = document.getElementById('seed-readout');
  const cardSeed = document.getElementById('card-seed');
  const phaseLabel = document.getElementById('phase-label');
  const interactionStatus = document.getElementById('interaction-status');
  const recombine = document.getElementById('recombine');
  const beats = [...document.querySelectorAll('.story-beat')];
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const palette = ['#d6ff46', '#ff685c', '#8ebdff', '#f4f0e8'];
  let seed = 1;
  let pointer = { x: .52, y: .47, active: false };
  let frame = 0;
  let reducedMotion = motionQuery.matches;
  let animationId;

  const phaseCopy = {
    observe: 'フィールドをなぞって、観察の角度を変える。',
    fold: '断片を折りたたむ。意味はまだ固定しない。',
    release: '残ったものを、次の問いとして返す。',
  };

  function setPhase(phase) {
    const safePhase = phaseCopy[phase] ? phase : 'observe';
    body.dataset.phase = safePhase;
    if (stage) stage.dataset.phase = safePhase;
    beats.forEach((beat) => beat.classList.toggle('is-active', beat.dataset.phase === safePhase));
    if (phaseLabel) phaseLabel.textContent = safePhase.toUpperCase();
    if (interactionStatus && !pointer.active) interactionStatus.textContent = phaseCopy[safePhase];
  }

  function setMotion() {
    reducedMotion = motionQuery.matches;
    body.classList.toggle('reduced-motion', reducedMotion);
    if (reducedMotion) {
      cancelAnimationFrame(animationId);
      draw();
    } else {
      animate();
    }
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }

  function draw() {
    if (!canvas || !ctx) return;
    const width = canvas.clientWidth || 720;
    const height = canvas.clientHeight || 720;
    const min = Math.min(width, height);
    const t = reducedMotion ? 0 : frame * .012;
    const px = pointer.x * width;
    const py = pointer.y * height;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((pointer.x - .5) * .13 + Math.sin(t * .5) * .012);
    ctx.translate(-width / 2, -height / 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(244,240,232,.12)';
    for (let i = 1; i < 8; i += 1) {
      const x = (width / 8) * i;
      const y = (height / 8) * i;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + Math.sin(t + i) * 12, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y + Math.cos(t + i) * 12); ctx.stroke();
    }
    for (let i = 0; i < 14; i += 1) {
      const angle = i * 2.399 + seed * .6 + t * (i % 2 ? .18 : -.11);
      const radius = min * (.12 + ((i * 17 + seed * 9) % 57) / 100);
      const x = width / 2 + Math.cos(angle) * radius + (pointer.x - .5) * min * .22;
      const y = height / 2 + Math.sin(angle) * radius + (pointer.y - .5) * min * .22;
      ctx.strokeStyle = palette[i % palette.length];
      ctx.globalAlpha = .38 + ((i + seed) % 3) * .12;
      ctx.beginPath(); ctx.moveTo(width / 2, height / 2); ctx.lineTo(x, y); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2); ctx.fillStyle = palette[i % palette.length]; ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(214,255,70,.7)';
    ctx.lineWidth = 1.5;
    const ring = min * (.22 + Math.sin(t * .7 + seed) * .012 + (pointer.active ? .035 : 0));
    ctx.beginPath(); ctx.arc(width / 2 + (px - width / 2) * .08, height / 2 + (py - height / 2) * .08, ring, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,104,92,.72)';
    ctx.beginPath(); ctx.arc(px, py, min * .025 + 8, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  function animate() {
    draw();
    frame += 1;
    animationId = requestAnimationFrame(animate);
  }

  function setPointer(event) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pointer = { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)), active: true };
    if (interactionStatus) interactionStatus.textContent = `signal x ${(pointer.x * 100).toFixed(0)} / y ${(pointer.y * 100).toFixed(0)} — 角度を更新しました。`;
    draw();
  }

  function recombineField() {
    seed = seed % 9 + 1;
    seedReadout.textContent = `SEED / ${String(seed).padStart(2, '0')}`;
    cardSeed.textContent = `seed: ${String(seed).padStart(2, '0')}`;
    if (interactionStatus) interactionStatus.textContent = `組み替え ${String(seed).padStart(2, '0')} — 新しい配置を観察する。`;
    draw();
  }

  function observeBeats() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setPhase(entry.target.dataset.phase); });
    }, { rootMargin: '-38% 0px -42% 0px', threshold: 0 });
    beats.forEach((beat) => observer.observe(beat));
  }

  if (!canvas || !ctx) body.classList.add('no-canvas');
  if (canvas) {
    canvas.addEventListener('pointermove', setPointer, { passive: true });
    canvas.addEventListener('pointerdown', setPointer, { passive: true });
    canvas.addEventListener('pointerleave', () => { pointer.active = false; if (interactionStatus) interactionStatus.textContent = phaseCopy[body.dataset.phase] || phaseCopy.observe; draw(); });
  }
  if (recombine) recombine.addEventListener('click', recombineField);
  if (recombine) recombine.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      recombineField();
    }
  });
  motionQuery.addEventListener?.('change', setMotion);
  window.addEventListener('resize', resizeCanvas, { passive: true });
  beats.forEach((beat) => beat.addEventListener('focus', () => setPhase(beat.dataset.phase)));
  setPhase('observe');
  resizeCanvas();
  observeBeats();
  setMotion();
})();
