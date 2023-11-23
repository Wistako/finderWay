

import { select, classNames} from './settings.js';
import Finder from './components/Finder.js';

const app = {
  initFinder(){
    const thisApp = this;
    thisApp.Finder = new Finder(thisApp.dom.finder);
  },
  getElements(){
    const thisApp = this;
    thisApp.dom = {};
    thisApp.dom.nav = document.querySelector(select.containerOf.nav);
    thisApp.dom.finder = document.querySelector(select.containerOf.finderWrapper);
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
  init: function() {
    const thisApp = this;
    thisApp.initPages();
    thisApp.getElements();
    thisApp.initFinder();
    // eslint-disable-next-line no-undef
    AOS.init();
    console.log(thisApp.Finder);
  },
};


app.init();