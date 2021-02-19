export const capitalize = string => {
  if (typeof string !== 'string') return string;
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};

export const slugify = text => text.toString().toLowerCase().trim()
  .replace(/[\u0300-\u036f]/g, '') // remove all separated accents
  .replace(/\s+/g, '-') // replace spaces with -
  .replace(/&/g, '-and-') // replace & with 'and'
  .replace(/[^\w-]+/g, '') // remove all non-word chars
  .replace(/--+/g, '-');

export const stripHTML = string => {
  if (
    string.indexOf
      && (
        string.indexOf('<') !== -1
        || string.indexOf('>') !== -1
      )
  ) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = string;
    return tmp.textContent || tmp.innerText || string;
  }
  return string;
};
