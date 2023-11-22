
import FinderBox from './components/FinderBox.js';
import { select, classNames, text} from './settings.js';
import { utils } from './utils.js';
const app = {
  initGameSpace(){
    const thisApp = this;
    thisApp.finderBoxes = {};
    for ( let x = 0; x < 10; x++ ){
      thisApp.finderBoxes[x] = [];
      for( let y = 0; y < 10; y++ ){
        thisApp.finderBoxes[x][y] = (new FinderBox(x, y));
      }
    }
  },
  getElements(){
    const thisApp = this;
    thisApp.dom = {};
    thisApp.dom.nav = document.querySelector(select.containerOf.nav);
    thisApp.dom.finder = {};
    thisApp.dom.finder.wrapper = document.querySelector(select.containerOf.finderWrapper);
    thisApp.dom.finder.gamespace = thisApp.dom.finder.wrapper.querySelector(select.finder.gamespace);
    thisApp.dom.finder.button = thisApp.dom.finder.wrapper.querySelector(select.finder.button);
    thisApp.dom.finder.title = thisApp.dom.finder.wrapper.querySelector(select.finder.title);
    thisApp.dom.finder.alert = thisApp.dom.finder.wrapper.querySelector(select.containerOf.alert);
  },
  initPages: function(){
    const thisApp = this;
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;
    
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');

        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
      });
    }
  },
  activatePage(pageId){
    const thisApp = this;
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, pageId == page.id);
    }
  },
  initActions(){
    const thisApp = this;
    thisApp.dom.finder.gamespace.addEventListener('click', thisApp.toggleSelect);
    thisApp.dom.finder.button.addEventListener('click', utils.buttonStepOne);
    thisApp.dom.finder.wrapper.addEventListener('step-one',() => {
      if(thisApp.isCorrectWay()){
        thisApp.stepOne();
        thisApp.cleanAlert();
        thisApp.cleanMaybeSelect();
      } else {
        thisApp.cleanData();
        thisApp.cleanGameSpace();
        thisApp.alertStepOne();
      }

    });
    thisApp.dom.finder.wrapper.addEventListener('step-two', () => {
      if(thisApp.findStart() && thisApp.findEnd()){
        thisApp.stepTwo();
        thisApp.cleanAlert();
      } else {
        thisApp.alertStepTwo();
      }
    });
    thisApp.dom.finder.wrapper.addEventListener('step-three', () => {
      thisApp.stepThree();
      thisApp.cleanData();
      thisApp.addStartSelect();
    });
    thisApp.dom.finder.gamespace.addEventListener('selected', () => {
      thisApp.selectedBoxes();
      if(thisApp.isCorrectWay()){
        thisApp.cleanAlert();
      } else {
        thisApp.alertStepOne();
        thisApp.alertWrongSelect();
      }
    });
  },
  // ================================
  // ========= STEP ONE =============

  // Pierwsze kliknięcie
  stepOne(){  
    const thisApp = this;
    thisApp.dom.finder.gamespace.removeEventListener('click', thisApp.toggleSelect);
    thisApp.dom.finder.gamespace.addEventListener('click', utils.startSelect);
    thisApp.dom.finder.button.removeEventListener('click', utils.buttonStepOne);
    thisApp.dom.finder.button.addEventListener('click', utils.buttonStepTwo);
    utils.stepTwoText();
  },

  // Szukanie sąsiada 
  findWay(pos){
    const thisApp = this;
    if(pos.visit){
      return;
    }
    pos.step = -1;
    const x = pos.x;
    const y = pos.y;
    const sum = pos.sum;
    const index = pos.index;
    pos.visit = true;

    // Dodajemy element sasiadujacy o ile go nie ma w tablicy
    let flag = true;
    for(const correct of thisApp.correctWay){
      if(correct.index == index){
        flag = false;
      }
    }
    if(flag){
      thisApp.correctWay.push(pos);
    }
    // Usuwamy element z kolejki
    const spliceIndex = thisApp.data.indexOf(pos);
    thisApp.data.splice(spliceIndex, 1); 

    // tablica sąsiadów
    const neighbors = [];
    // Szukamy pasującego bloku 
    for(const box of thisApp.data){
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
      thisApp.findWay(box);
    }
  },

  // Sprawdzanie poprawności trasy
  isCorrectWay(){
    const thisApp = this;
    thisApp.prepareData();
    
    thisApp.correctWay = [];
    if(!thisApp.data[0]){
      return false;
    }
    thisApp.findWay(thisApp.data[0]);
    if(thisApp.data.length == 0 ){
      return true;
    } else {
      return false;
    }
  },

  // Przygotowanie data
  prepareData(){
    const thisApp = this;
    let selectedBox = thisApp.dom.finder.gamespace.querySelectorAll(select.finder.selected);
    thisApp.data = [];
    let i = 0;
    for(const boxElement of selectedBox){
      const box = {};
      box.y = parseInt(boxElement.getAttribute('data-y'));
      box.x = parseInt(boxElement.getAttribute('data-X'));
      box.sum = box.y + box.x;
      box.index = i;
      box.step = -1;
      i++;
      thisApp.data.push(box);
    }
  },
  // Alert dla źle wybranej trasy
  alertStepOne(){
    const thisApp = this;
    thisApp.dom.finder.alert.innerHTML = text.alerts.stepOne;
  },
  // ================================
  // ========= STEP TWO =============

  // Drugie kliknięcie
  stepTwo(){
    const thisApp = this;

    thisApp.dom.finder.gamespace.removeEventListener('click', utils.startSelect);
    thisApp.dom.finder.button.addEventListener('click', utils.buttonStepThree);
    thisApp.dom.finder.button.removeEventListener('click', utils.buttonStepTwo);
    thisApp.findCorrectWay();
    utils.stepThreeText();
  },

  // Logika
  findCorrectWay(){
    const thisApp = this;
    const end = thisApp.findEnd();
    const start = thisApp.findStart();
    thisApp.findStep(start);
    console.log(thisApp.correctWay);
    thisApp.endWay = [];
    thisApp.findEndWay(end);
    thisApp.colorBoxes();
    thisApp.removeEndClass();
    
  },
  // Szukanie najkrótszej drogi
  findEndWay(pos){
    const thisApp = this;
    thisApp.endWay.push(pos);
    // Usuwamy element z kolejki
    const spliceIndex = thisApp.correctWay.indexOf(pos);
    thisApp.correctWay.splice(spliceIndex, 1); 

    for(const box of thisApp.correctWay){
      if(
        (box.x == pos.x || box.y == pos.y)
        &&
        ((box.sum + 1) == pos.sum || (box.sum -1) == pos.sum)
        &&
        (box.step < (pos.step))
      ){{
        thisApp.findEndWay(box);
        return;
      }
      }
    }
  },
  // Szukanie sąsiadów i dodanie im kroku
  findStep(pos){
    const thisApp = this;
    const nextStep = [];
  
    for(const box of thisApp.correctWay){
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
    for(const steps of nextStep){
      thisApp.findStep(steps);
    }
  },
  // Pokolorowanie drogi
  colorBoxes(){
    const thisApp = this;

    for(const pos of thisApp.endWay){
      thisApp.finderBoxes[pos.x][pos.y].addCorrectWay();
    }
  },
  // Szukanie startu
  findStart(){
    const thisApp = this;
    const startElement = thisApp.dom.finder.gamespace.querySelector(select.finder.start);
    if(startElement){
      const getY = parseInt(startElement.getAttribute('data-y'));
      const getX = parseInt(startElement.getAttribute('data-X'));
      for(const box of thisApp.correctWay){
        if(box.x == getX && box.y == getY){
          box.step = 0;
          return box;
        }
      }
    }
  },

  // Szukanie końca
  findEnd(){
    
    const thisApp = this;
    const endElement = thisApp.dom.finder.gamespace.querySelector(select.finder.end);
    if(endElement){
      const getY = parseInt(endElement.getAttribute('data-y'));
      const getX = parseInt(endElement.getAttribute('data-X'));
      for(const box of thisApp.correctWay){
        if(box.x == getX && box.y == getY){
          return box;
        }
      }
    }
  },
  // Usuwanie klass końca i początku
  removeEndClass(){
    const end = document.querySelector(select.finder.end);
    end.classList.remove(classNames.finder.end);
  },
  // Alert dla startu
  alertStepTwo(){
    const thisApp = this;
    thisApp.dom.finder.alert.innerHTML = text.alerts.stepTwo;
  },
  // ================================
  // ========= STEP THREE ===========

  // Trzecie kliknięcie
  stepThree(){
    const thisApp = this;
    thisApp.dom.finder.gamespace.addEventListener('click', thisApp.toggleSelect);
    thisApp.dom.finder.button.addEventListener('click', utils.buttonStepOne);
    thisApp.dom.finder.button.removeEventListener('click', utils.buttonStepThree);
    thisApp.cleanGameSpace();
    utils.stepOneText();
  },
  // ================================

  // Wybieranie drogi
  toggleSelect(e){
    console.log(e);
    const selectedEvent = new CustomEvent('selected', {
      bubbles: true,
      detail: {
        element: e.srcElement,
      },
    });
    if(e.srcElement.classList.contains(classNames.finder.maybeSelect) || e.srcElement.classList.contains(classNames.finder.startSelect)){
      e.srcElement.classList.toggle(classNames.finder.selected);
      // thisApp.findNeightbours(e.srcElement);
    } else {
      e.srcElement.classList.toggle(classNames.finder.selected, e.srcElement.classList.contains(classNames.finder.maybeSelect));
      
    }
    e.srcElement.dispatchEvent(selectedEvent);
  },
  // Znajdowanie wszystkich zaznaczonych elementów
  selectedBoxes(){
    const thisApp = this;
    thisApp.cleanMaybeSelect();
    let i = 0;
    for (let x = 0; x < 10; x ++){
      for( let y = 0; y < 10; y ++){
        const finderBox = thisApp.finderBoxes[x][y];
        if(finderBox.element.classList.contains(classNames.finder.selected)){
          thisApp.findNeightbours(finderBox.element);
          i++;
        }
      }
    }
    if(i == 0){
      thisApp.addStartSelect();
    }
    else {
      thisApp.cleanStartSelect();
    }

  },
  // Znajdowanie dla jednego elementu sąsiadów pod wybór i dodanie im klasy
  findNeightbours(element){
    const thisApp = this;
    
    const getY = parseInt(element.getAttribute('data-y'));
    const getX = parseInt(element.getAttribute('data-X'));
    const sum = getY + getX;
    for (let x = 0; x < 10; x ++){
      for( let y = 0; y < 10; y ++){
        const finderBox = thisApp.finderBoxes[x][y];
        if(
          (finderBox.position.x == getX || finderBox.position.y == getY)
        &&
        ((finderBox.position.sum + 1) == sum || (finderBox.position.sum -1) == sum)){
          finderBox.element.classList.toggle(classNames.finder.maybeSelect, !finderBox.element.classList.contains(classNames.finder.selected));
        }
      }
    }
  },
  // Dodawanie start-select (kiedy nic nie jest zaznaczone)
  addStartSelect(){
    const thisApp = this;
    
    for (let x = 0; x < 10; x ++){
      for( let y = 0; y < 10; y ++){
        const finderBox = thisApp.finderBoxes[x][y];
        finderBox.addStartSelect();
      }
    }
  },
  // Czysczenie start-select (kiedy coś jest zaznaczone)
  cleanStartSelect(){
    const thisApp = this;
    
    for (let x = 0; x < 10; x ++){
      for( let y = 0; y < 10; y ++){
        const finderBox = thisApp.finderBoxes[x][y];
        finderBox.removeStartSelect();
      
      }
    }
  },
  // Czyszczenie maybe-select 
  cleanMaybeSelect(){
    const thisApp = this;
    
    for (let x = 0; x < 10; x ++){
      for( let y = 0; y < 10; y ++){
        thisApp.finderBoxes[x][y].element.classList.remove(classNames.finder.maybeSelect);
      }
    }
  },
  // Czyszczenie alert
  cleanAlert(){
    const thisApp = this;
    thisApp.dom.finder.alert.innerHTML = '';
  },
  // Czyszczenie data
  cleanData(){
    const thisApp = this;
    thisApp.correctWay.splice(0, thisApp.correctWay.length);
    thisApp.data.splice(0, thisApp.data.length);
    if(thisApp.endway){
      thisApp.endWay.splice(0, thisApp.endWay.length);
    }
  },
  // Czyszczenie mapy
  cleanGameSpace(){
    const thisApp = this;

    const selectedBox =  thisApp.dom.finder.gamespace.querySelectorAll(select.finder.box);
    for(const box of selectedBox){
      box.classList.remove(classNames.finder.correct, classNames.finder.end, classNames.finder.selected, classNames.finder.start);
    }

  },
  init: function() {
    const thisApp = this;
    thisApp.initPages();
    thisApp.getElements();
    thisApp.initGameSpace();
    thisApp.initActions();
    utils.stepOneText();
    console.log(thisApp.finderBoxes);
  },
};


app.init();