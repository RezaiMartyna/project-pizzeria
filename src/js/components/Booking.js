import { templates, select, settings, classNames } from './../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(wrapper) {
    const thisBooking = this;


    thisBooking.tablePicked = null;

    thisBooking.render(wrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initTables();


    //console.log('thisBooking', thisBooking);
    //conosle.log('wrapper', wrapper);
  }

  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    //console.log('getData params', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking
        + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsRepeat.join('&'),
    };

    //console.log('getData urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        //console.log(bookings);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    //console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);


    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      //console.log('loop', hourBlock);

      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);

    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }

  }

  initTables() {
    const thisBooking = this;



    thisBooking.floorPlan.addEventListener('click', function (event) {
      const clickedElement = event.target;

      if (clickedElement.classList.contains('table')) {

        if (clickedElement.classList.contains('booked')) {
          alert('Table already reserved');
        } else {
          if (clickedElement.classList.contains('selected')) {
            clickedElement.classList.remove('selected');
            thisBooking.tablePicked = null;
            //console.log('remove table2', thisBooking.tablePicked);
          }
          else {
            for (let table of thisBooking.dom.tables) {
              table.classList.remove('selected');
              clickedElement.classList.add('selected');
              const tableId = clickedElement.getAttribute('data-table');
              thisBooking.tablePicked = tableId;
              //console.log('add table', thisBooking.tablePicked);
            }
          }
        }
      }
    });

  }

  render(wrapper) {
    const thisBooking = this;

    /*generowanie kodu HTML za pomocą szablonu templates.bookingWidget */
    const generatedHTML = templates.bookingWidget();

    /*utworzenie pustego obiektu thisBooking.dom*/
    thisBooking.dom = {};

    /*dodanie do tego obiektu właściwości wrapper i
    przypisanie do niej referencji do kontenera  */
    thisBooking.dom.wrapper = wrapper;

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


    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

    thisBooking.floorPlan = document.querySelector('.floor-plan');

    thisBooking.dom.orderButton = thisBooking.dom.wrapper.querySelector(select.booking.orderButton);

    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelector(select.booking.starters);

    thisBooking.dom.dateInput = document.querySelector(select.widgets.datePicker.input);

    thisBooking.dom.hourInput = document.querySelector(select.widgets.hourPicker.input);

    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);

    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);

    thisBooking.starters = [];
    console.log('starter', thisBooking.starters);
  }

  sendBooking() {
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;



    const payload = {
      date: thisBooking.dom.dateInput.value,
      hour: thisBooking.dom.hourInput.value, //(w formacie HH:ss)??
      table: thisBooking.tablePicked,
      duration: thisBooking.hoursAmount.value,
      ppl: thisBooking.peopleAmount.value,
      starters: [],
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
    };
    console.log('payload', payload);

    for (let starter of thisBooking.starters) {
      payload.starters.push(starter);
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



  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);



    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
      thisBooking.tablePicked = null;
      for (let table of thisBooking.dom.tables) {
        table.classList.remove('selected');
      }
    });




    thisBooking.dom.orderButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });

    thisBooking.dom.starters.addEventListener('click', function (event) {

      const clickedElement = event.target;

      if (clickedElement.tagName === 'INPUT' && clickedElement.type === 'checkbox' && clickedElement.name === 'starter') {

        if (clickedElement.checked) {
          const value = clickedElement.getAttribute('value');
          console.log('value', value);
          thisBooking.starters.push(value);
          console.log(thisBooking.starters, 'dodaj');
        }
        else {
          const value = clickedElement.getAttribute('value');
          const indexOfFilterID = thisBooking.starters.indexOf(value);
          thisBooking.starters.splice(indexOfFilterID, 1);
          console.log(thisBooking.starters, 'usuń');
        }
      }
    });

  }

}

export default Booking;
