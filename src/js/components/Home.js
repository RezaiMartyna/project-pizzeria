import { templates, } from './../settings.js';
import {app} from './../app.js';

class Home {
  constructor(wrapper) {
    const thisHome = this;

    thisHome.render(wrapper);
    thisHome.initWidgets();
  }

  render(wrapper) {
    const thisHome = this;

    const generatedHTML = templates.homeWidget();

    thisHome.dom = {};

    thisHome.dom.wrapper = wrapper;

    thisHome.dom.wrapper.innerHTML = generatedHTML;

    thisHome.dom.makeOrder = document.querySelector('.order-online');
    thisHome.dom.bookTable = document.querySelector('.book-table');
    thisHome.infoLinks = document.querySelectorAll('.nav-info a');
  }

  initWidgets() {
    const thisHome = this;

    thisHome.elem = document.querySelector('.main-carousel');
    // eslint-disable-next-line no-undef
    thisHome.flkty = new Flickity(thisHome.elem, {
      // options
      cellAlign: 'left',
      contain: true,
      autoPlay: true,
    });

    //thisHome.dom.makeOrder.addEventListner('click', function(){

    //});

    for(let link of thisHome.infoLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /*get page id from href attribute */
        /*W stałej id zapisujemy atrybut 'href' kliknietego elementu w którym zamienimy znak # na pusty ciag znaków*/
        const id = clickedElement.getAttribute('href').replace ('#', '');

        /*run thisApp.activatePage with that id */
        app.activatePage(id);

        /*change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  }
}

export default Home;
