document.addEventListener('DOMContentLoaded', () => {
  const mannerElem = document.getElementById('manner-profile');
  if (mannerElem) {
    const mannerTemp = parseFloat(mannerElem.dataset.temp);  
    const bar = document.getElementById('mannerBar-profile');

    if (bar) bar.style.width = `${mannerTemp}%`;

    if (mannerTemp > 80) {
        bar.style.backgroundColor = '#4CAF50';
      } else if (mannerTemp > 60) {
        bar.style.backgroundColor = '#8BC34A';
      } else if (mannerTemp > 40) {
        bar.style.backgroundColor = '#FFC107';
      } else if (mannerTemp > 20) {
        bar.style.backgroundColor = '#FF9800';
      } else {
        bar.style.backgroundColor = '#F44336';
      }
    }
});