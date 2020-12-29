import {templates, select,} from './../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  render(element){
    const thisBooking = this;

    /*generowanie kodu HTML za pomocą szablonu templates.bookingWidget */
    const generatedHTML = templates.bookingWidget();

    /*utworzenie pustego obiektu thisBooking.dom*/
    thisBooking.dom = {};

    /*dodanie do tego obiektu właściwości wrapper i
    przypisanie do niej referencji do kontenera  */
    thisBooking.dom.wrapper = element;

    /*zmiana zawartości wrappera (innerHTML) na kod HTML wygenerowany z szablonu. */
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    /*Referencja do inputów People amount */
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);

    /*Referencja do inputu Hours amount */
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('updated', function () {

    });

    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('updated', function () {

    });
  }

}

export default Booking;
