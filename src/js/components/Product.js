import {select, classNames, templates} from './../settings.js';
import utils from './../utils.js';
import AmountWidget from './AmountWidget.js';


class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();



  }


  renderInMenu(){
    const thisProduct = this;

    /*generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);
    /*create element using utils.creteElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /*find menu container*/
    const menuContainer = document.querySelector(select.containerOf.menu);
    /*add element to menu*/
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;


    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    /*const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);*/

    /* START: add event listener to clickable trigger on event click */
    thisProduct.accordionTrigger.addEventListener('click', function (event) {

      /* prevent default action for event */
      event.preventDefault();
      /* find active product (product that has active class) */
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
      /* if there is active product and it's not thisProduct.element, remove class active from it */
      for (let activeProduct of activeProducts) {
        if (activeProduct != thisProduct.element) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
      }

      /* toggle active class on thisProduct.element */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });
  }

  initOrderForm() {

    const thisProduct = this;


    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);


    // set price to default price
    let price = thisProduct.data.price;

    // for every category (param)...
    for (let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];


      // for every option in this category
      for (let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];

        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        // check if there is param with a name of paramId in formData and if it includes optionId
        if (optionSelected) {
          // check if the option is not default
          if (optionSelected && !option.default) {
            // add option price to price variable
            price += option.price;
          }
        } else {
          // check if the option is default
          if (!formData[paramId].includes(optionId) && option.default) {
            // reduce price variable
            price -= option.price;
          }
        }


        //find image
        const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        //console.log(optionImage);
        // if you find image and it is selectet
        if (optionImage && optionSelected) {
          // add active class
          optionImage.classList.add(classNames.menuProduct.imageVisible);
        } else {
          // if you find image but it is not selectet
          if (optionImage && !optionSelected) {
            // remove active class
            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }

      }//finish for every option

    }//finish "for all category"

    thisProduct.priceSingle = price;

    /*multiply price by amount*/
    price *= thisProduct.amountWidget.value;


    thisProduct.price = price;

    // update calculated price in the HTML
    thisProduct.priceElem.innerHTML = price;

  }//finish process product

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }//finish AmountWidget

  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    //app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);

  }//finish addtocart

  prepareCartProduct() {
    const thisProduct = this;
    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.price,
      params: thisProduct.prepareCartProductParams()
    };//finish productSummary

    return productSummary;

  }//finish prepareCartProduct

  prepareCartProductParams() {

    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);
    const params = {};

    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];

      params[paramId] = {
        label: param.label,
        options: {}
      };

      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if (optionSelected) {
          params[paramId].options[optionId] = option.label;
        }

      }//finish for every option

    }//finish "for all category"

    return params;

  }//finishCartPRoductParams

}//finish class product

export default Product;
