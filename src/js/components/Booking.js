import {templates, select,} from './../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

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

    /*Referencja do inputu Date Picker */
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);

    /*Referencja do inputu Hours Picker */
    thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);

  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    //thisBooking.dom.wrapper.addEventListener('updated', function(){
      //thisBooking.updateDOM();
    //});
  }

}

export default Booking;
