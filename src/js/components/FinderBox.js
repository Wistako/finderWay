import { templates, select, classNames } from '../settings.js';
import { utils } from '../utils.js';

class FinderBox {
  constructor(x, y){
    const thisBox = this;
    thisBox.dom = {};
    thisBox.dom.wrapper = document.querySelector(select.finder.gamespace);
    thisBox.position = {};
    thisBox.position.x = x;
    thisBox.position.y = y;
    thisBox.position.sum = x + y;
    thisBox.render();
    thisBox.addStartSelect();
  }
  // Render box in gameSpace
  render(){
    const thisBox = this;
    const generatedHTML = templates.finderBox(thisBox.position);
    thisBox.element = utils.createDOMFromHTML(generatedHTML);
    thisBox.dom.wrapper.appendChild(thisBox.element);
  }
  // Adding the ability to select a box at the beginning
  addStartSelect(){
    const thisBox = this;
    thisBox.element.classList.add(classNames.finder.startSelect);
  }
  // Remove the ability to select a box at the beginning
  removeStartSelect(){
    const thisBox = this;
    thisBox.element.classList.remove(classNames.finder.startSelect);
  }
  // Adding a class for the final route
  addCorrectWay(){
    const thisBox = this;
    thisBox.element.classList.add(classNames.finder.correct);
  }
}
export default FinderBox;