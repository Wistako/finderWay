import FinderBox from './components/FinderBox.js';
import { select, classNames } from './settings.js';

const app = {
  initGameSpace(){

  },
  getElements(){
    const thisApp = this;
    thisApp.dom = {};
    thisApp.dom.finder = {};
    thisApp.dom.finder.wrapper = document.querySelector(select.containerOf.finderWrapper);
    thisApp.dom.nav = document.querySelector(select.containerOf.nav);
  },
  initPages: function(){
    const thisApp = this;
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    console.log(thisApp.navLinks);
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


  init: function() {
    const thisApp = this;
    thisApp.initPages();
    thisApp.getElements();
    thisApp.FinderBox = [];
    for ( let x = 0; x < 10; x++ ){
      for( let y = 0; y < 10; y++ ){
        thisApp.FinderBox.push(new FinderBox(x, y));
      }
    }
    console.log(thisApp.FinderBox);
  },
};


app.init();