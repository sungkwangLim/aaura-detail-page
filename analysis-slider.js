(() => {
  'use strict';

  const sliders = Array.from(document.querySelectorAll('[data-axis-slider]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!sliders.length || reducedMotion.matches) return;

  const createValue = (previousValue, usedValues) => {
    let nextValue;

    do {
      nextValue = Math.floor(Math.random() * 101);
    } while (nextValue === previousValue || usedValues.has(nextValue));

    return nextValue;
  };

  const updateSliders = () => {
    const usedValues = new Set();

    sliders.forEach((slider) => {
      const dot = slider.querySelector('.aaura-axis-dot');
      const previousValue = Number(slider.dataset.value);
      const nextValue = createValue(previousValue, usedValues);

      usedValues.add(nextValue);
      slider.dataset.value = String(nextValue);
      dot.style.setProperty('--aaura-axis-value', `${nextValue}%`);
    });
  };

  window.setInterval(updateSliders, 3000);
})();
