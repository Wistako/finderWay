import { classNames, select, text} from './settings.js';

export const utils = {};
const gamespace = document.querySelector(select.finder.gamespace);
const finderTitle = document.querySelector(select.finder.title);
const finderButton = document.querySelector(select.finder.button);

utils.createDOMFromHTML = function(htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

// Wybieranie drogi
utils.toggleSelect = function(e){
  if(e.target.classList.contains(classNames.finder.box)){
    e.target.classList.toggle(classNames.finder.selected);
  }
};
// Wybieranie startu 
utils.startSelect = function(e){
  if(e.target.classList.contains(classNames.finder.selected)){
    e.target.classList.add(classNames.finder.start);
    gamespace.removeEventListener('click',utils.startSelect);
    gamespace.addEventListener('click', utils.endSelect);
  }
};
// Wynieranie końca
utils.endSelect = function(e){
  if(e.target.classList.contains(classNames.finder.selected)){
    e.target.classList.add(classNames.finder.end);
    gamespace.removeEventListener('click', utils.endSelect);
  }
};
// Przycisk 1
utils.buttonStepOne = function(){
  this.dispatchEvent(eventOne);
  eventOne;
};
// Przycisk 2
utils.buttonStepTwo = function(){
  this.dispatchEvent(eventTwo);
  eventTwo;
};
// Przycisk 3
utils.buttonStepThree = function(){
  this.dispatchEvent(eventThree);
  eventThree;
};

// Custom Event Step one
const eventOne = new CustomEvent('step-one', {
  bubbles: true,
});
// Step two
const eventTwo = new CustomEvent('step-two', {
  bubbles: true,
});
// Step three
const eventThree = new CustomEvent('step-three', {
  bubbles: true,
});


// Zmiana tekstu button i title
utils.stepOneText = function(){
  finderTitle.innerHTML = text.stepOne.title;
  finderButton.innerHTML = text.stepOne.button;
};
utils.stepTwoText = function(){
  finderTitle.innerHTML = text.stepTwo.title;
  finderButton.innerHTML = text.stepTwo.button;

};
utils.stepThreeText = function(){
  finderTitle.innerHTML = text.stepThree.title;
  finderButton.innerHTML = text.stepThree.button;

};