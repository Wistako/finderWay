import { templates, select, classNames } from '../settings.js';
import { utils } from '../utils.js';

class FinderBox {
  constructor(X, Y){
    const thisBox = this;
    thisBox.dom = {};
    thisBox.dom.wrapper = document.querySelector(select.finder.gamespace);
    thisBox.position = {};
    thisBox.position.x = X;
    thisBox.position.y = Y;
    thisBox.position.sum = X + Y;
    thisBox.render();
    thisBox.initAction();
    thisBox.addStartSelect();
  }
  initAction(){
    const thisBox = this;
    thisBox.dom.wrapper.addEventListener('click', () =>{
      thisBox.initEvent();
    });
  }
  initEvent(){
    const thisFinderBox = this;
    const selectBox =new Event('select-box',{
      bubbles: true,
      detail: {
        element: thisFinderBox.dom.wrapper,
      }
    });
    thisFinderBox.dom.wrapper.dispatchEvent(selectBox);
  }
  render(){
    
    const thisBox = this;
    const generatedHTML = templates.finderBox(thisBox.position);
    thisBox.element = utils.createDOMFromHTML(generatedHTML);
    thisBox.dom.wrapper.appendChild(thisBox.element);
  }
  addStartSelect(){
    const thisBox = this;
    thisBox.element.classList.add(classNames.finder.startSelect);
  }
  removeStartSelect(){
    const thisBox = this;
    thisBox.element.classList.remove(classNames.finder.startSelect);
  }
  addCorrectWay(){
    const thisBox = this;
    thisBox.element.classList.add(classNames.finder.correct);
  }
  startWay(){ 
    // select way 
    const thisBox = this;
    thisBox.element.classList.add(classNames.finder.start);
  }
  endWay(){
    const thisBox = this;
    thisBox.element.classList.add(classNames.finder.end);
  }
}
export default FinderBox;