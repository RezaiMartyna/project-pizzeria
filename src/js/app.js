import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

export const app = {
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
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /*get page id from href attribute */
        /*W stałej id zapisujemy atrybut 'href' kliknietego elementu w którym zamienimy znak # na pusty ciag znaków*/
        const id = clickedElement.getAttribute('href').replace ('#', '');

        /*run thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /*change URL hash */
        window.location.hash = '#/' + id;
      });
    }

  },

  activatePage: function(pageId){
    const thisApp = this;

    /*add class 'active' to mathing pages, remove from non-matching*/
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /*add class 'active' to mathing links, remove from non-matching*/

    /*dla każdego z linków zapisanych w thisApp.navLink  */
    for(let link of thisApp.navLinks){
      /*chcemy dodać lub odjąć */
      link.classList.toggle(
        /*klasę zdefiniowaną w classNames.nav.active*/
        classNames.nav.active,
        /*w zależnosći od tego czy atrybut 'href' tego linka jest równy #
        oraz id podstrony podanej jako argument metody ActivatePage */
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        //console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });
    //console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  initBooking: function () {
    const thisApp = this;

    thisApp.bookingWrapper = document.querySelector(select.containerOf.booking);

    new Booking(thisApp.bookingWrapper);

  },

  initHome: function() {
    const thisApp = this;

    thisApp.homeWrapper = document.querySelector(select.containerOf.home);

    new Home(thisApp.homeWrapper);
  },

  init: function () {
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initPages();

    thisApp.initData();

    thisApp.initHome();

    thisApp.initCart();

    thisApp.initBooking();


  },



};

app.init();


