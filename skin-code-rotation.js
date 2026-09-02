(() => {
  'use strict';

  const codeItems = Array.from(document.querySelectorAll('.aaura-code-grid [data-skin-code]'));
  const resultCode = document.querySelector('.aaura-code-result strong');
  const finalCode = document.querySelector('.aaura-result-card-content strong');
  const finalNoteCode = document.querySelector('.aaura-result-card-note-code');
  const traitItems = Array.from(document.querySelectorAll('.aaura-code-traits li'));
  const resultLead = document.querySelector('.aaura-code-result-copy b');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const traitLabels = [
    { O: '지성형', D: '건성형' },
    { S: '민감형', R: '저항형' },
    { P: '색소형', N: '비색소형' },
    { W: '주름형', T: '탄력형' }
  ];

  if (!codeItems.length || !resultCode || !finalCode || !finalNoteCode || traitItems.length !== 4 || !resultLead || reducedMotion.matches) return;

  let activeIndex = Math.max(0, codeItems.findIndex((item) => item.classList.contains('aaura-active')));

  const updateFinalCode = (code) => {
    const firstDigit = Math.floor(Math.random() * 3) + 1;
    const secondDigit = Math.floor(Math.random() * 4) + 1;

    finalCode.classList.add('aaura-is-fading');

    window.setTimeout(() => {
      finalCode.textContent = `${code}-${firstDigit}${secondDigit}`;
      finalNoteCode.textContent = code;
      finalCode.classList.remove('aaura-is-fading');
    }, 220);
  };

  const updateCode = (nextIndex) => {
    const nextItem = codeItems[nextIndex];
    const code = nextItem.dataset.skinCode;

    codeItems[activeIndex].classList.remove('aaura-active');
    codeItems[activeIndex].removeAttribute('aria-current');
    nextItem.classList.add('aaura-active');
    nextItem.setAttribute('aria-current', 'true');
    resultCode.textContent = code;

    traitItems.forEach((item, index) => {
      const character = code[index];

      item.querySelector('b').textContent = character;
      item.querySelector('span').textContent = traitLabels[index][character];
    });

    resultLead.textContent = traitLabels[0][code[0]];
    updateFinalCode(code);
    activeIndex = nextIndex;
  };

  window.setInterval(() => {
    let nextIndex;

    do {
      nextIndex = Math.floor(Math.random() * codeItems.length);
    } while (nextIndex === activeIndex);

    updateCode(nextIndex);
  }, 1500);
})();
