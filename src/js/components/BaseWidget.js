
class BaseWidget{
  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
  }

  /*get Value jest geterem czyli metodą wykonywaną przy każdej próbie odczytywania wartości value */
  get value(){
    const thisWidget = this;

    return thisWidget.correctValue;
  }

  /*set Value  jest seterem czyli metodą wykonywaną przy każdej próbie ustwienia nowej wartości właściwości value  */
  set value(value) {
    const thisWidget = this;
    const newValue = thisWidget.parseValue(value);

    /*Czy nowa wartość różni się od dotychczasowej wartości oraz czy metoda isValid zwraca prawde */
    if(newValue != thisWidget.correctValue && thisWidget.isValid(newValue)){
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }
    thisWidget.renderValue();
  }

  setValue(value){
    const thisWidget = this;

    thisWidget.value = value;
  }

  parseValue(value){
    return parseInt(value);
  }

  isValid(value){
    /*is Valid zwróci prawdę jeśli value jest liczbą */
    return !isNaN (value);

  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;


  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;
