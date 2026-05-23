import { PRIORITY_LABELS, STATUS_LABELS } from './config.js';

export const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

export const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const formatDate = (value) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

export const statusLabel = (status) => STATUS_LABELS[status] || status || '-';

export const priorityLabel = (priority) => PRIORITY_LABELS[priority] || priority || '-';

export const pluralize = (count, singular, plural) => (count === 1 ? singular : plural);

export const buildOptions = (options, selectedValue = '') =>
  options
    .map(
      (option) =>
        `<option value="${escapeHtml(option.value)}" ${
          option.value === selectedValue ? 'selected' : ''
        }>${escapeHtml(option.label)}</option>`
    )
    .join('');

export const debounce = (callback, delay = 250) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};
