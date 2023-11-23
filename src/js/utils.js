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
// FINDER
// Select start, STEP TWO
utils.startSelect = function(e){
  if(e.target.classList.contains(classNames.finder.selected)){
    e.target.classList.add(classNames.finder.start);
    gamespace.removeEventListener('click',utils.startSelect);
    gamespace.addEventListener('click', utils.endSelect);
  }
};
// Select end, STEP TWO
utils.endSelect = function(e){
  if(e.target.classList.contains(classNames.finder.selected)){
    e.target.classList.add(classNames.finder.end);
    gamespace.removeEventListener('click', utils.endSelect);
  }
};
// Button first step
utils.buttonStepOne = function(){
  this.dispatchEvent(eventOne);
  eventOne;
};
// Button second step
utils.buttonStepTwo = function(){
  this.dispatchEvent(eventTwo);
  eventTwo;
};
// Button third step
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
// Change text to STEP ONE, TWO, THREE
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