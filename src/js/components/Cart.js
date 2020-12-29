import {select, templates, classNames, settings} from './../settings.js';
import utils from './../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.product = [];

    thisCart.getElements(element);
    thisCart.initActions();

  }//finish constructor

  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
  }//finish getElements

  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }//finish initActions

  add(menuProduct) {
    const thisCart = this;

    /*generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);
    /*create element using utils.creteElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    /*add element to menu*/
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.product.push(new CartProduct(menuProduct, generatedDOM));

    thisCart.update();
  }//finish add(menu product)

  update() {
    const thisCart = this;
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (let product of thisCart.product) {
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }//finish for let product

    if (thisCart.totalNumber > 0) {
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    }
    else {
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;
    }

    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    for (let price of thisCart.dom.totalPrice) {
      price.innerHTML = thisCart.totalPrice;
    }

  }//finish update

  remove(cartProduct) {
    const thisCart = this;

    const removeCartProduct = cartProduct.dom.wrapper;
    removeCartProduct.remove();

    const index = thisCart.product.indexOf(cartProduct);
    thisCart.product.splice(index, 1);

    thisCart.update();
  }// finish remove

  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      addres: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };
    console.log('payload', payload);
    for(let prod of thisCart.product) {
      payload.products.push(prod.getData());
    }
    console.log('payload', payload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }//finish sendORder
}//finish class cart

export default Cart;
