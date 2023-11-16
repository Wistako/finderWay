export const select = {
  templateOf: {
    finderBox: '#template-finder-box',
  },
  containerOf:{
    finderWrapper: '.finder',
    wrapper: 'nav',
    pages: '#pages'
  },
  finder:{
    stepOne: '.finder #step-1',
    stepTwo: '.finder #step-2',
    stepThree: '.finder #step-3',
    gamespace: '.finder .game-space',
    selected: '.finder .game-space .select',
    start: '.finder .game-space .start-way',
  },
  nav:{
    links: 'nav a',
  }
};

export const templates = {
  finderBox: Handlebars.compile(document.querySelector(select.templateOf.finderBox).innerHTML),
};

export const classNames = {
  pages: {
    active: 'active',
  },
  finder: {
    selected: 'select',
    correct: 'correct',
    start: 'start-way',
    end: 'end-way',
  },
};