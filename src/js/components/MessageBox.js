import { classNames, select } from '../settings.js';

class MessageBox {
  constructor(){
    const thisMessageBox = this;
    thisMessageBox.getElements();
    thisMessageBox.initActions();
  }
  getElements(){
    const thisMessageBox = this;
    thisMessageBox.dom = {};
    thisMessageBox.dom.wrapper = document.querySelector(select.containerOf.messageBox);
    thisMessageBox.dom.sum = document.querySelector(select.messageBox.sumBox);
    thisMessageBox.dom.long = document.querySelector(select.messageBox.longWay);
    thisMessageBox.dom.short = document.querySelector(select.messageBox.shortWay);
    thisMessageBox.dom.closeButton = document.querySelector(select.messageBox.close);
  }
  initActions(){
    const thisMessageBox = this;
    thisMessageBox.dom.closeButton.addEventListener('click', (e) =>{
      e.preventDefault();
      thisMessageBox.hide();
    });
  }
  display(){
    const thisMessageBox = this;
    thisMessageBox.dom.wrapper.classList.add(classNames.messageBox.active);
  }
  hide(){
    const thisMessageBox = this;
    thisMessageBox.dom.wrapper.classList.remove(classNames.messageBox.active);
  }
  setData(data, start, end){
    const thisMessageBox = this;
    thisMessageBox.dom.sum.innerHTML = data.length;
    console.log(data);
  }
  findShortWay(pos){
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
}
export default MessageBox;