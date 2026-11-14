const printer = document.querySelector('.printer');
const receipt = document.querySelector('.receipt');
const lines = [...document.querySelectorAll('.receipt-line')];
const balance = document.querySelector('.receipt-balance');
const count = document.querySelector('#printed-count');
const status = document.querySelector('#printer-status');
const slot = document.querySelector('.printer-slot');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let framePending = false;
let idleTimer;

function updateFeed() {
  const slotTop = slot.getBoundingClientRect().top;
  const printed = lines.filter(line => line.getBoundingClientRect().bottom <= slotTop).length;
  const finished = balance.getBoundingClientRect().bottom <= slotTop;
  count.textContent = String(printed).padStart(2, '0');
  document.documentElement.style.setProperty('--feed', printed / lines.length);
  if (finished) {
    status.textContent = 'TAKE A BREAK';
    printer.classList.remove('is-printing');
  } else if (printer.classList.contains('is-printing')) {
    status.textContent = 'PRINTING YOUR THOUGHTS';
  } else {
    status.textContent = receipt.getBoundingClientRect().top < slotTop ? 'READY TO PRINT' : 'WAITING FOR YOUR ORDER';
  }
  framePending = false;
}

window.addEventListener('scroll', () => {
  printer.classList.add('is-printing');
  if (!framePending) {
    framePending = true;
    requestAnimationFrame(updateFeed);
  }
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    printer.classList.remove('is-printing');
    updateFeed();
  }, 180);
}, { passive: true });

window.addEventListener('resize', updateFeed);
document.querySelector('#print-again').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});

updateFeed();
if (document.fonts) document.fonts.ready.then(updateFeed);
