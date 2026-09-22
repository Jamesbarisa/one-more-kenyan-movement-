const storageKey = 'one-more-kenya-members';
const landingPhotoKey = 'one-more-kenya-landing-photo';

const getMembers = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
const saveMembers = (members) => localStorage.setItem(storageKey, JSON.stringify(members));

function renderDirectory() {
  const members = getMembers();
  const list = document.querySelector('#member-list');
  document.querySelector('#member-count').textContent = members.length;
  document.querySelector('#department-count').textContent = new Set(members.map((member) => member.department)).size;
  document.querySelector('#latest-member').textContent = members[0]?.name?.split(' ')[0] || '—';

  if (!members.length) {
    list.innerHTML = '<tr><td colspan="5" class="empty-state">No registrations yet. Your next member will appear here.</td></tr>';
    return;
  }

  list.innerHTML = members.map((member) => `<tr><td><strong>${escapeHtml(member.name)}</strong></td><td>${escapeHtml(member.email)}<br />${escapeHtml(member.phone)}</td><td>${escapeHtml(member.department)}</td><td>${escapeHtml(member.message || '—')}</td><td>${new Date(member.joined).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })}</td></tr>`).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]);
}

function setLandingPhoto(photo) {
  const hero = document.querySelector('.hero');
  const removeButton = document.querySelector('#remove-landing-photo');
  const status = document.querySelector('#photo-status');
  if (photo) {
    hero.style.backgroundImage = `url("${photo}")`;
    removeButton.hidden = false;
    status.textContent = 'Landing photo saved in this browser.';
  } else {
    hero.style.backgroundImage = '';
    removeButton.hidden = true;
    status.textContent = 'Choose an image to personalize this landing page.';
  }
}

document.querySelector('#landing-photo').addEventListener('change', (event) => {
  const [file] = event.currentTarget.files;
  if (!file) return;
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxImageSize = 5 * 1024 * 1024;
  if (!allowedImageTypes.includes(file.type) || file.size > maxImageSize) {
    event.currentTarget.value = '';
    document.querySelector('#photo-status').textContent = 'Please choose a JPG, PNG, WebP or GIF image under 5 MB.';
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    localStorage.setItem(landingPhotoKey, reader.result);
    setLandingPhoto(reader.result);
  });
  reader.readAsDataURL(file);
});

document.querySelector('#remove-landing-photo').addEventListener('click', () => {
  localStorage.removeItem(landingPhotoKey);
  document.querySelector('#landing-photo').value = '';
  setLandingPhoto('');
});

document.querySelector('#member-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const newMember = Object.fromEntries(formData.entries());
  newMember.joined = new Date().toISOString();
  saveMembers([newMember, ...getMembers()]);
  event.currentTarget.reset();
  document.querySelector('#form-status').textContent = 'Registration received. Welcome to the movement.';
  renderDirectory();
  document.querySelector('#admin').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#clear-members').addEventListener('click', () => {
  if (getMembers().length && window.confirm('Clear all member registrations from this browser?')) {
    localStorage.removeItem(storageKey);
    renderDirectory();
  }
});

document.querySelector('.menu-toggle').addEventListener('click', (event) => {
  const nav = document.querySelector('.top-nav');
  const isOpen = nav.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.top-nav a').forEach((link) => link.addEventListener('click', () => document.querySelector('.top-nav').classList.remove('open')));
document.querySelector('#year').textContent = new Date().getFullYear();
setLandingPhoto(localStorage.getItem(landingPhotoKey));
renderDirectory();