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
  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') || { matches: false };
  const palette = ['#d6ff46', '#ff685c', '#8ebdff', '#f4f0e8'];
  const phaseCopy = {
    observe: 'OBSERVE · watch the field respond to your position.',
    fold: 'FOLD · rearrange the signal and hold the ambiguity.',
    release: 'RELEASE · return what remains as a question.',
  };
  let seed = 1;
  let pointer = { x: .52, y: .47, active: false };
  let pointerPressed = false;
  let frame = 0;
  let reducedMotion = motionQuery.matches;
  let animationId;

  function setPhase(phase) {
    const safePhase = phaseCopy[phase] ? phase : 'observe';
    body.dataset.phase = safePhase;
    if (stage) stage.dataset.phase = safePhase;
    beats.forEach((beat) => {
      const active = beat.dataset.phase === safePhase;
      beat.classList.toggle('is-active', active);
      beat.setAttribute('aria-pressed', String(active));
    });
    if (phaseLabel) phaseLabel.textContent = safePhase.toUpperCase();
    if (interactionStatus && !pointer.active) interactionStatus.textContent = phaseCopy[safePhase];
  }

  function setMotion() {
    reducedMotion = motionQuery.matches;
    body.classList.toggle('reduced-motion', reducedMotion);
    cancelAnimationFrame(animationId);
    if (reducedMotion) draw();
    else animate();
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
    pointer = {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
      active: true,
    };
    if (interactionStatus) interactionStatus.textContent = `SIGNAL X ${(pointer.x * 100).toFixed(0)} / Y ${(pointer.y * 100).toFixed(0)} · pointer updated`;
    draw();
  }

  function endPointer(event) {
    pointerPressed = false;
    if (canvas?.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    pointer.active = false;
    if (interactionStatus) interactionStatus.textContent = phaseCopy[body.dataset.phase] || phaseCopy.observe;
    draw();
  }

  function nudgePointer(dx, dy) {
    pointer = { x: Math.max(0, Math.min(1, pointer.x + dx)), y: Math.max(0, Math.min(1, pointer.y + dy)), active: true };
    if (interactionStatus) interactionStatus.textContent = `SIGNAL X ${(pointer.x * 100).toFixed(0)} / Y ${(pointer.y * 100).toFixed(0)} · keyboard updated`;
    draw();
  }

  function recombineField() {
    seed = seed % 9 + 1;
    const value = String(seed).padStart(2, '0');
    if (seedReadout) seedReadout.textContent = `SEED / ${value}`;
    if (cardSeed) cardSeed.textContent = `seed: ${value}`;
    if (interactionStatus) interactionStatus.textContent = `RECOMBINE ${value} · local pattern reconfigured`;
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
    canvas.addEventListener('pointerdown', (event) => {
      pointerPressed = true;
      setPointer(event);
      canvas.setPointerCapture?.(event.pointerId);
    }, { passive: true });
    canvas.addEventListener('pointerup', endPointer, { passive: true });
    canvas.addEventListener('pointercancel', endPointer, { passive: true });
    canvas.addEventListener('pointerleave', (event) => { if (!pointerPressed) endPointer(event); }, { passive: true });
    canvas.addEventListener('keydown', (event) => {
      const moves = { ArrowLeft: [-.06, 0], ArrowRight: [.06, 0], ArrowUp: [0, -.06], ArrowDown: [0, .06] };
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      nudgePointer(move[0], move[1]);
    });
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
  beats.forEach((beat) => {
    beat.addEventListener('focus', () => setPhase(beat.dataset.phase));
    beat.addEventListener('click', () => setPhase(beat.dataset.phase));
    beat.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      setPhase(beat.dataset.phase);
    });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationId);
    else setMotion();
  });
  setPhase('observe');
  resizeCanvas();
  observeBeats();
  setMotion();
})();
