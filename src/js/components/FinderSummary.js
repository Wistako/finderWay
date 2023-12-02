import { classNames, select } from '../settings.js';

class FinderSummary {
  constructor(){
    const thisFinderSummary = this;
    thisFinderSummary.getElements();
    thisFinderSummary.initActions();
  }
  getElements(){
    const thisFinderSummary = this;
    thisFinderSummary.dom = {};
    thisFinderSummary.dom.wrapper = document.querySelector(select.containerOf.FinderSummary);
    thisFinderSummary.dom.sum = document.querySelector(select.FinderSummary.sumBox);
    thisFinderSummary.dom.long = document.querySelector(select.FinderSummary.longWay);
    thisFinderSummary.dom.short = document.querySelector(select.FinderSummary.shortWay);
    thisFinderSummary.dom.closeButton = document.querySelector(select.FinderSummary.close);
  }
  initActions(){
    const thisFinderSummary = this;
    thisFinderSummary.dom.closeButton.addEventListener('click', (e) =>{
      e.preventDefault();
      thisFinderSummary.hide();
    });
  }
  display(){
    const thisFinderSummary = this;
    thisFinderSummary.dom.wrapper.classList.add(classNames.FinderSummary.active);
  }
  hide(){
    const thisFinderSummary = this;
    thisFinderSummary.dom.wrapper.classList.remove(classNames.FinderSummary.active);
  }
  setData(data, end){
    const thisFinderSummary = this;
    console.log(data);
    console.log(end);
    thisFinderSummary.dom.sum.innerHTML = data.length;
    thisFinderSummary.dom.short.innerHTML = end.step;
  }
}
export default FinderSummary;