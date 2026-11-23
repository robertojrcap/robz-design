(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const press = (group, active) => group.forEach((b) => b.setAttribute('aria-pressed', String(b === active)));
  const src = (k) => `/assets/sel/${k}-1-1-1280.webp`;

  /* the one-second test */
  const ROUNDS = [
    { k: 'v19', a: ['Finding a cheaper dentist', 'Regretting dental implants', 'Whitening your teeth at home'], ok: 1 },
    { k: 'v02', a: ['A $100K a month plane detailing business', 'How to buy a private jet', 'What airline pilots earn'], ok: 0 },
    { k: 'v22', a: ['Cooking for a big family', 'The best restaurants in town', 'What to eat on a carnivore diet'], ok: 2 },
  ];
  const game = $('#game');
  const img = $('.p-frame > img', game), cover = $('.p-cover', game), timer = $('.p-timer', game);
  const count = $('.p-count', game), status = $('.p-status', game), opts = $('.p-opts', game);
  const go = $('.p-go', game), see = $('.p-see', game), again = $('.p-again', game);
  let round = 0, score = 0, stage = 'idle';
  ROUNDS.forEach((r) => { new Image().src = src(r.k); });
  const set = (s) => { stage = s; game.dataset.s = s; };

  const idle = () => {
    round = 0; score = 0; set('idle');
    cover.textContent = 'Three thumbnails. One second each.';
    count.textContent = ''; status.textContent = '';
    opts.hidden = true; opts.innerHTML = '';
    go.hidden = false; go.textContent = 'Start';
    see.hidden = true; again.hidden = true;
  };
  const ask = () => {
    const r = ROUNDS[round];
    set('ask');
    cover.textContent = 'What was it about?';
    opts.innerHTML = r.a.map((t, i) => `<button type="button" data-i="${i}">${t}</button>`).join('');
    opts.hidden = false;
    $('button', opts).focus({ preventScroll: true });
  };
  const flash = async () => {
    const r = ROUNDS[round];
    go.hidden = true; see.hidden = true; again.hidden = true;
    opts.hidden = true; opts.innerHTML = ''; status.textContent = '';
    count.textContent = `${round + 1} of ${ROUNDS.length}`;
    img.src = src(r.k);
    try { await img.decode(); } catch (e) { /* show it anyway */ }
    set('flash');
    if (!RM) timer.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: 1000, easing: 'linear' });
    setTimeout(ask, 1000);
  };
  const result = () => {
    set('end');
    cover.textContent = `${score} of ${ROUNDS.length}`;
    count.textContent = '';
    status.textContent = 'That second is the whole job.';
    opts.hidden = true; go.hidden = true;
    see.hidden = false; again.hidden = false;
  };
  opts.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || stage !== 'ask') return;
    const r = ROUNDS[round], right = Number(b.dataset.i) === r.ok;
    score += right ? 1 : 0;
    set('done');
    $$('button', opts).forEach((x, i) => { x.disabled = true; x.classList.toggle('ok', i === r.ok); });
    status.textContent = right ? 'Right.' : 'Not quite.';
    go.hidden = false;
    go.textContent = round === ROUNDS.length - 1 ? 'See your score' : 'Next';
    go.focus({ preventScroll: true });
  });
  go.addEventListener('click', () => {
    if (stage === 'idle') { flash(); return; }
    if (stage !== 'done') return;
    if (round < ROUNDS.length - 1) { round += 1; flash(); } else result();
  });
  again.addEventListener('click', () => { idle(); flash(); });
  idle();

  /* step 2: every element has a job */
  const SPOTS = {
    words: [38, 4, 55, 41, 'Three words, big enough for a phone. They make you need to know what is changing.'],
    face: [3, 0, 35, 100, 'The person making the promise, looking straight at you.'],
    graphic: [46, 43, 52, 47, 'The market on a line, right before it turns. The story lands before you read a word.'],
  };
  const spot = $('.p-spot'), cap = $('#spotcap'), spots = $$('[data-spot]');
  const showSpot = (b) => {
    const [l, t, w, h, text] = SPOTS[b.dataset.spot];
    press(spots, b);
    Object.assign(spot.style, { left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%` });
    cap.textContent = text;
  };
  spots.forEach((b) => b.addEventListener('click', () => showSpot(b)));
  showSpot(spots[0]);

  /* step 3: real size */
  const yt = $('.p-yt'), sizes = $$('[data-size]');
  sizes.forEach((b) => b.addEventListener('click', () => {
    press(sizes, b);
    yt.classList.toggle('small', b.dataset.size === 'small');
  }));
})();
