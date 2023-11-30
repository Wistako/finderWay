export const select = {
  templateOf: {
    finderBox: '#template-finder-box',
  },
  containerOf:{
    finderWrapper: '.finder',
    wrapper: 'nav',
    pages: '#pages',
    alert: '.alert',
    messageBox: '.messageBox',
  },
  finder:{
    gamespace: '.game-space',
    selected: '.game-space .select',
    start: '.start-way',
    end: '.end-way',
    button: 'button',
    title: '.finder .title',
    box: '.finder-box',
  },
  messageBox:{
    sumBox: '#sum-box #number',
    shortWay: '#short-way #number',
    longWay: '#long-way #number_correct',
    close: '.messageBox #close',
  },
  nav:{
    links: 'nav a',
  }
};
export const templates = {
  finderBox: Handlebars.compile(document.querySelector(select.templateOf.finderBox).innerHTML),
};
export const text = {
  stepOne: {
    title: 'draw routes',
    button: 'finish drawing',
  },
  stepTwo: {
    title: 'pick start and finish',
    button: 'compute',
  },
  stepThree: {
    title: 'the best route is...',
    button: 'start again',
  },
  alerts:{
    stepOne: 'the route is incorrect',
    stepTwo: 'select start and finish',
  }
};
export const classNames = {
  pages: {
    active: 'active',
  },
  finder: {
    box:'finder-box',
    selected: 'select',
    correct: 'correct',
    start: 'start-way',
    end: 'end-way',
    maybeSelect: 'maybe-select',
    startSelect: 'start-select',
    gamespace: 'game-space',
  },
  messageBox:{
    active: 'active',
  }
};