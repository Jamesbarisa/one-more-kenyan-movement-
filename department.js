const departmentName = document.body.dataset.department;
const storageKey = `one-more-kenya-${departmentName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-tasks`;
const updatesKey = `${storageKey}-updates`;
const taskList = document.querySelector('#department-tasks');
const progressLabel = document.querySelector('#task-progress');
const updateForm = document.querySelector('#department-update');
const updateStatus = document.querySelector('#update-status');
const updateLog = document.querySelector('#update-log');

function getTasks() {
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
}

function saveTasks(tasks) {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function renderUpdates() {
  const updates = JSON.parse(localStorage.getItem(updatesKey) || '[]');
  updateLog.innerHTML = updates.length
    ? updates.map((update) => `<article><strong>${escapeHtml(update.title)}</strong><p>${escapeHtml(update.message)}</p><small>${new Date(update.created).toLocaleDateString('en-KE', { day: '2-digit', month: 'short' })}</small></article>`).join('')
    : '<p class="empty-update">No team updates yet.</p>';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]);
}

function renderTasks() {
  const tasks = getTasks();
  const checkboxes = [...taskList.querySelectorAll('input[type="checkbox"]')];
  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = tasks[index] === true;
  });
  const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
  progressLabel.textContent = `${completed} of ${checkboxes.length} priorities complete`;
}

taskList.addEventListener('change', (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  saveTasks([...taskList.querySelectorAll('input[type="checkbox"]')].map((checkbox) => checkbox.checked));
  renderTasks();
});

updateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const update = Object.fromEntries(new FormData(event.currentTarget).entries());
  update.created = new Date().toISOString();
  const updates = JSON.parse(localStorage.getItem(updatesKey) || '[]');
  localStorage.setItem(updatesKey, JSON.stringify([update, ...updates]));
  updateStatus.textContent = 'Update saved for the department team.';
  event.currentTarget.reset();
  renderUpdates();
});

document.querySelector('#year').textContent = new Date().getFullYear();
renderTasks();
renderUpdates();