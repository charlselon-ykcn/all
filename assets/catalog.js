const cards = [...document.querySelectorAll('.card')];
const filters = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#search');
const orientation = document.querySelector('#orientation');
const count = document.querySelector('#result-count');
let group = 'all';
function applyFilters() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  for (const card of cards) {
    const show = (group === 'all' || group === card.dataset.group)
      && (orientation.value === 'all' || orientation.value === card.dataset.orientation)
      && card.dataset.search.includes(query);
    card.hidden = !show;
    if (show) visible += 1;
    else card.querySelector('video').pause();
  }
  count.textContent = `${visible} ${count.dataset.unit}`;
  document.querySelector('#empty').hidden = visible > 0;
}
for (const button of filters) {
  button.addEventListener('click', () => {
    group = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    applyFilters();
  });
}
search.addEventListener('input', applyFilters);
orientation.addEventListener('change', applyFilters);
for (const card of cards) {
  const video = card.querySelector('video');
  const play = card.querySelector('.play');
  play.addEventListener('click', async () => {
    play.disabled = true;
    try {
      await video.play();
    } catch {
      play.disabled = false;
    }
  });
  video.addEventListener('playing', () => card.classList.add('started'));
  video.addEventListener('play', () => cards.forEach(other => {
    if (other !== card) other.querySelector('video').pause();
  }));
}
