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
    thisBox.start = false;
    thisBox.end = false;
    thisBox.render();
    thisBox.initAction();
  }
  render(){
    
    const thisBox = this;
    const generatedHTML = templates.finderBox(thisBox.position);
    thisBox.element = utils.createDOMFromHTML(generatedHTML);
    thisBox.dom.wrapper.appendChild(thisBox.element);
  }
  initAction(){
    const thisBox = this;
    thisBox.element.addEventListener('click', (e) => {
      e.preventDefault();
      thisBox.selectWay();
    });
  }
  selectWay(){ 
    // select way 
    const thisBox = this;

    thisBox.element.classList.toggle(classNames.finder.selected);
  }
  // selectStart(){
  //   const thisBox = this;

  // }
}
export default FinderBox;