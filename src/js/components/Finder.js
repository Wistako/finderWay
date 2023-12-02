import { select, classNames, text } from '../settings.js';
import FinderBox from './FinderBox.js';
import { utils } from '../utils.js';
import FinderSummary from './FinderSummary.js';
class Finder {
  constructor(element){
    const thisFinder = this;
    thisFinder.getElements(element);
    thisFinder.initGameSpace();
    thisFinder.initActions();
    utils.stepOneText();
    thisFinder.FinderSummary = new FinderSummary();
  }
  // Find DOMelements
  getElements(element){
    const thisFinder = this;
    thisFinder.dom = {};
    thisFinder.dom.wrapper = element;
    thisFinder.dom.gamespace = element.querySelector(select.finder.gamespace);
    thisFinder.dom.button = element.querySelector(select.finder.button);
    thisFinder.dom.title = element.querySelector(select.finder.title);
    thisFinder.dom.alert = element.querySelector(select.containerOf.alert);
  }
  // Init and rendered Boxes
  initGameSpace(){
    const thisFinder = this;
    thisFinder.finderBoxes = {};
    for ( let x = 0; x < 10; x++ ){
      thisFinder.finderBoxes[x] = [];
      for( let y = 0; y < 10; y++ ){
        thisFinder.finderBoxes[x][y] = (new FinderBox(x, y));
      }
    }
  }
  // Add listeners
  initActions(){
    const thisFinder = this;
    thisFinder.dom.gamespace.addEventListener('click', thisFinder.triggerSelect);
    thisFinder.dom.button.addEventListener('click', utils.buttonStepOne);
    thisFinder.dom.wrapper.addEventListener('step-one',() => {
      if(thisFinder.isCorrectWay() && thisFinder.prepareData().length > 2){
        thisFinder.stepOne();
        thisFinder.cleanAlert();
        thisFinder.cleanMaybeSelect();
      } else {
        thisFinder.cleanData();
        thisFinder.alertStepOne();
      }
    });
    thisFinder.dom.wrapper.addEventListener('step-two', () => {
      if(thisFinder.findStart() && thisFinder.findEnd()){
        thisFinder.stepTwo();
        thisFinder.cleanAlert();
      } else {
        thisFinder.alertStepTwo();
      }
    });
    thisFinder.dom.wrapper.addEventListener('step-three', () => {
      thisFinder.stepThree();
      thisFinder.cleanData();
      thisFinder.addStartSelect();
    });
    thisFinder.dom.gamespace.addEventListener('selected', (e) => {
      const clickedElem = e.detail.element;
      // Checking whether an item can be selected or has been selected
      if(clickedElem.classList.contains(classNames.finder.maybeSelect) || clickedElem.classList.contains(classNames.finder.startSelect)){
        clickedElem.classList.toggle(classNames.finder.selected);
      } else if(clickedElem.classList.contains(classNames.finder.box)){
        clickedElem.classList.toggle(classNames.finder.selected, clickedElem.classList.contains(classNames.finder.maybeSelect));
        if(!thisFinder.isCorrectWay() ^ thisFinder.prepareData().length == 0){
          clickedElem.classList.toggle(classNames.finder.selected);
        }
      }
      if(thisFinder.isCorrectWay()){
        thisFinder.cleanAlert();
      } else {
        thisFinder.addStartSelect();
        thisFinder.alertStepOne();
      }
      thisFinder.selectedBoxes();
    });
  }
  // =============== STEP ONE ==============
  // First click on button
  stepOne(){  
    const thisFinder = this;
    thisFinder.dom.gamespace.removeEventListener('click', thisFinder.triggerSelect);
    thisFinder.dom.gamespace.addEventListener('click', utils.startSelect);
    thisFinder.dom.button.removeEventListener('click', utils.buttonStepOne);
    thisFinder.dom.button.addEventListener('click', utils.buttonStepTwo);
    utils.stepTwoText();
  }
  //  Remove an item from the queue, find neighbors, and call recursion on them
  findWay(pos){
    const thisFinder = this;
    if(pos.visit){
      return;
    }
    pos.step = -1;
    const x = pos.x;
    const y = pos.y;
    const sum = pos.sum;
    const index = pos.index;
    pos.visit = true;
    // If not in the array add to correct
    let flag = true;
    for(const correct of thisFinder.correctWay){
      if(correct.index == index){
        flag = false;
      }
    }
    if(flag){
      thisFinder.correctWay.push(pos);
    }
    // Delate item from the queue
    const spliceIndex = thisFinder.data.indexOf(pos);
    thisFinder.data.splice(spliceIndex, 1); 
    // Find neighbors, add to array and call recursion
    const neighbors = [];
    for(const box of thisFinder.data){
      if(
        (box.x == x || box.y == y)
        &&
        ((box.sum + 1) == sum || (box.sum -1) == sum)
        && !box.hasOwnProperty('visit')
      ){  
        neighbors.push(box);
      }
    }
    for(const box of neighbors){
      thisFinder.findWay(box);
    }
  }
  // Checking if the route is correct
  isCorrectWay(){
    const thisFinder = this;
    thisFinder.data = thisFinder.prepareData();
    thisFinder.correctWay = [];
    if(!thisFinder.data[0]){
      return false;
    }
    // Calling the function for the first element
    thisFinder.findWay(thisFinder.data[0]);
    if(thisFinder.data.length == 0 ){
      return true;
    } else {
      return false;
    }
  }
  // Preparing data for selected blocks
  prepareData(){
    const thisFinder = this;
    let selectedBox = thisFinder.dom.gamespace.querySelectorAll(select.finder.selected);
    const data = [];
    let i = 0;
    for(const boxElement of selectedBox){
      const box = {};
      box.y = parseInt(boxElement.getAttribute('data-y'));
      box.x = parseInt(boxElement.getAttribute('data-X'));
      box.sum = box.y + box.x;
      box.index = i;
      box.step = -1;
      i++;
      data.push(box);
    }
    return data;
  }
  // Alert for incorrectly selected route
  alertStepOne(){
    const thisFinder = this;
    thisFinder.dom.alert.innerHTML = text.alerts.stepOne;
  }
  // Select box
  triggerSelect(e){
    // Triggering an event to check the correctness of the route
    const selectedEvent = new CustomEvent('selected', {
      bubbles: true,
      detail: {
        element: e.srcElement,
      },
    });
    e.srcElement.dispatchEvent(selectedEvent);
  }
  // Finding all selected elements, adding maybe-select class to neighbors
  selectedBoxes(){
    const thisFinder = this;
    thisFinder.cleanMaybeSelect();
    let i = 0;
    for (let x = 0; x < 10; x ++){
      for( let y = 0; y < 10; y ++){
        const finderBox = thisFinder.finderBoxes[x][y];
        if(finderBox.element.classList.contains(classNames.finder.selected)){
          thisFinder.addClassMaybeSelect(finderBox.element);
          i++;
        }
      }
    }
    // Adding selection options for all
    if(i == 0){
      thisFinder.addStartSelect();
    }
    else {
      thisFinder.cleanStartSelect();
    }
  }
  // Finding selectable neighbors for one element and adding a class to them
  addClassMaybeSelect(element){
    const thisFinder = this;
    const getY = parseInt(element.getAttribute('data-y'));
    const getX = parseInt(element.getAttribute('data-X'));
    const sum = getY + getX;
    for (let x = getX - 1; x <= getX + 1; x ++){
      for( let y = getY - 1; y <= getY + 1; y ++){
        if(thisFinder.finderBoxes[x]){
          if(thisFinder.finderBoxes[x][y]){
            const finderBox = thisFinder.finderBoxes[x][y];
            if(
              (finderBox.position.x == getX || finderBox.position.y == getY)
            &&
            ((finderBox.position.sum + 1) == sum || (finderBox.position.sum -1) == sum)){
              finderBox.element.classList.toggle(classNames.finder.maybeSelect, !finderBox.element.classList.contains(classNames.finder.selected));
            }

          }
        }
      }
    }
  }
  // Adding start-select (when nothing is selected)
  addStartSelect(){
    const thisFinder = this;
    for (let x = 0; x < 10; x ++){
      for( let y = 0; y < 10; y ++){
        const finderBox = thisFinder.finderBoxes[x][y];
        finderBox.addStartSelect();
      }
    }
  }
  // Removing start-select (when nothing is selected)
  cleanStartSelect(){
    const thisFinder = this;
    for (let x = 0; x < 10; x ++){
      for( let y = 0; y < 10; y ++){
        const finderBox = thisFinder.finderBoxes[x][y];
        finderBox.removeStartSelect();
      }
    }
  }
  // Removing class maybe-select for all
  cleanMaybeSelect(){
    const thisFinder = this;
    for (let x = 0; x < 10; x ++){
      for( let y = 0; y < 10; y ++){
        thisFinder.finderBoxes[x][y].element.classList.remove(classNames.finder.maybeSelect);
      }
    }
  }
  // ================== STEP TWO ===================
  // Second click on button
  stepTwo(){
    const thisFinder = this;
    thisFinder.dom.gamespace.removeEventListener('click', utils.startSelect);
    thisFinder.dom.button.addEventListener('click', utils.buttonStepThree);
    thisFinder.dom.button.removeEventListener('click', utils.buttonStepTwo);
    thisFinder.findCorrectWay();
    thisFinder.FinderSummary.setData(thisFinder.correctWay, thisFinder.findEnd());
    thisFinder.FinderSummary.display();
    thisFinder.removeEndClass();
    utils.stepThreeText();
  }
  // Logic
  findCorrectWay(){
    const thisFinder = this;
    const end = thisFinder.findEnd();
    const start = thisFinder.findStart();
    // Add stpes to boxes
    thisFinder.findStep(start);
    // Searching for the shortest route starting from the end
    thisFinder.endWay = [];
    thisFinder.findEndWay(end);
    // Coloring the correct path
    thisFinder.colorBoxes();
  }
  // Searching for the shortest route starting from the start
  findEndWay(pos){
    const thisFinder = this;
    thisFinder.endWay.push(pos);
    // Find an adjacent element with a smaller step, call recursion on it and stop
    for(const box of thisFinder.correctWay){
      if(
        (box.x == pos.x || box.y == pos.y)
        &&
        ((box.sum + 1) == pos.sum || (box.sum -1) == pos.sum)
        &&
        (box.step < (pos.step))
      ){{
        thisFinder.findEndWay(box);
        return;
      }
      }
    }
  }
  // Searching for neighbors and giving them a step
  findStep(pos){
    const thisFinder = this;
    const nextStep = [];
    // Find an adjacent item with a smaller step and add it to array
    for(const box of thisFinder.correctWay){
      if(
        (box.x == pos.x || box.y == pos.y)
        &&
        ((box.sum + 1) == pos.sum || (box.sum -1) == pos.sum)
        && 
        (box.step == -1) ^ box.step > (pos.step -1)
      ){
        box.step = (pos.step + 1);
        nextStep.push(box);
      }
    }
    // Call recursion for array
    for(const steps of nextStep){
      thisFinder.findStep(steps);
    }
  }
  // Coloring the routs
  colorBoxes(){
    const thisFinder = this;
    for(const pos of thisFinder.endWay){
      thisFinder.finderBoxes[pos.x][pos.y].addCorrectWay();
    }
  }
  // Looking for a start in gamespace
  findStart(){
    const thisFinder = this;
    const startElement = thisFinder.dom.gamespace.querySelector(select.finder.start);
    if(startElement){
      const getY = parseInt(startElement.getAttribute('data-y'));
      const getX = parseInt(startElement.getAttribute('data-X'));
      for(const box of thisFinder.correctWay){
        if(box.x == getX && box.y == getY){
          box.step = 0;
          return box;
        }
      }
    }
  }

  // Looking for a end in gamespace
  findEnd(){
    const thisFinder = this;
    const endElement = thisFinder.dom.gamespace.querySelector(select.finder.end);
    if(endElement){
      const getY = parseInt(endElement.getAttribute('data-y'));
      const getX = parseInt(endElement.getAttribute('data-X'));
      for(const box of thisFinder.correctWay){
        if(box.x == getX && box.y == getY){
          return box;
        }
      }
    }
  }
  // Delate end class
  removeEndClass(){
    const end = document.querySelector(select.finder.end);
    end.classList.remove(classNames.finder.end);
  }
  // Alert when no start or end has been marked
  alertStepTwo(){
    const thisFinder = this;
    thisFinder.dom.alert.innerHTML = text.alerts.stepTwo;
  }
  // ================== STEP THREE ===================

  // Third click on button
  stepThree(){
    const thisFinder = this;
    thisFinder.dom.gamespace.addEventListener('click', thisFinder.triggerSelect);
    thisFinder.dom.button.addEventListener('click', utils.buttonStepOne);
    thisFinder.dom.button.removeEventListener('click', utils.buttonStepThree);
    thisFinder.cleanGameSpace();
    console.log(thisFinder.correctWay);
    console.log(thisFinder.data);
    console.log(thisFinder.endWay);
    utils.stepOneText();
  }
  cleanAlert(){
    const thisFinder = this;
    thisFinder.dom.alert.innerHTML = '';
  }
  // Clean for prepare data
  cleanData(){
    const thisFinder = this;
    thisFinder.correctWay.splice(0, thisFinder.correctWay.length);
    thisFinder.data.splice(0, thisFinder.data.length);
    if(thisFinder.endway){
      thisFinder.endWay.splice(0, thisFinder.endWay.length);
    }
  }
  // Clean for new game
  cleanGameSpace(){
    const thisFinder = this;
    const selectedBox =  thisFinder.dom.gamespace.querySelectorAll(select.finder.box);
    for(const box of selectedBox){
      box.classList.remove(classNames.finder.correct, classNames.finder.end, classNames.finder.selected, classNames.finder.start);
    }
  }
}

export default Finder;