
let ConvertButton = document.getElementById('conversion');
let result = document.querySelector('.result');
let Value = document.querySelector("#number-conv");
let Reset = document.querySelector('#reset');


function ReverseString(str) {
  let rev;
  for (let i = str.length; i >= 0; i--)
    rev += str[i];

  return rev;
}


function IncreaseTheOppacity(element) {
  let oppArray = ["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9"];
  let x = 0;
  (function next() {
    element.style.opacity = oppArray[x];
    if (x++ < oppArray.length) {
      setTimeout(next, 80);
    }
  })();
}

function DecreaseTheOppacity(element) {
  let opp2Array = ["0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1", "0"];
  let y = 0;
  (function next() {
    element.style.opacity = opp2Array[y];
    if (y++ < opp2Array.length) {
      setTimeout(next, 50);
    }
  })();
}




function ResetButtonDown() {
  let initial = document.querySelector("#initial-base");
  let final = document.querySelector(".finalbase");
  DecreaseTheOppacity(document.querySelector('.result'));
  Value.value = "";
  initial.selectedIndex = 0;
  final.selectedIndex = 0;
  result.innerHTML = "";
}



function to_base_10(number, initialbase, finalbase, write) {
  let p = 1, sum = 0, digit;
  while (number) {
    digit = number % finalbase;
    sum += digit * p;
    p *= initialbase;
    number = Math.floor(number / finalbase);
  }

  if (write === true) {

    let display = "Rezultatul conversiei numărului " + Value.value + " din baza " + initialbase + " în baza " + finalbase + " este " + sum;
    IncreaseTheOppacity(result);
    result.innerHTML = display;

  }

  return sum;
}


function base_10_to_greater_base(number, initialbase, finalbase, write) {

  let r = 1, digits = 0;
  let hex = "";

  while (number != 0) {
    r = number % finalbase;
    if (r <= 9) {
      hex += String.fromCharCode(r + 48);
    }
    else {
      hex += String.fromCharCode(r + 55);
    }
    number = Math.floor(number / finalbase);
    digits++;
  }

  let res = ReverseString(hex);
  res = res.replace('NaN', '');

  if (write === true) {
    let display = "Rezultatul conversiei numărului " + Value.value + " din baza " + initialbase + " în baza " + finalbase + " este " + res;
    IncreaseTheOppacity(result);
    result.innerHTML = display;
  }
  return res;

}



function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}



function greater_base_to_base_10(number, initialbase, finalbase, write) {

  let pr = 0, sum = 0, p = 0;
  let digit;

  for (let i = number.length - 1; i >= 0; i--) {
    if (isNumeric(number[i])) {
      digit = number[i];
      pr = parseInt(digit, 10) * Math.pow(initialbase, p);
    }
    else {
      if (number.codePointAt(i) >= 65 && number.codePointAt(i) <= 70) {
        let aux = number.codePointAt(i) - 55;
        pr = aux * Math.pow(initialbase, p);
      }
    }
    p++;
    sum += pr;
  }

  if (write === true) {
    let display = "Rezultatul conversiei numărului " + Value.value + " din baza " + initialbase + " în baza " + finalbase + " este " + sum;
    IncreaseTheOppacity(result);
    result.innerHTML = display;
  }

  return sum;
}



function from_base_10(number, initialbase, finalbase, write) {
  let p = 1, sum = 0, digit;
  while (number) {
    digit = number % finalbase;
    sum += digit * p;
    p *= initialbase;
    number = Math.floor(number / finalbase);
  }

  if (write === true) {
    let display = "Rezultatul conversiei numărului " + Value.value + " din baza " + initialbase + " în baza " + finalbase + " este " + sum;
    IncreaseTheOppacity(result);
    result.innerHTML = display;
  }

  return sum;
}



function Conversions() {
  let input = document.querySelector('#number-conv').value;
  let initialbase = document.querySelector('#initial-base').value;
  let finalbase = document.querySelector('.finalbase').value;


  if (isNumeric(input)) {
    input = parseInt(input, 10);
    console.log(input);
  }

  initialbase = parseInt(initialbase, 10);
  console.log(initialbase);
  finalbase = parseInt(finalbase, 10);
  console.log(finalbase);



  if (initialbase < 10 && finalbase === 10)
    result = to_base_10(input, initialbase, finalbase, true);

  if (initialbase === 10 && finalbase < 10) {
    let res = from_base_10(input, initialbase, finalbase, true);
  }

  if (initialbase === 10 && finalbase > 10 && finalbase <= 16) {
    let res = base_10_to_greater_base(input, initialbase, finalbase, true);
  }

  if (initialbase <= 16 && initialbase > 10 && finalbase === 10)
    greater_base_to_base_10(input, initialbase, finalbase, true);

  if (initialbase < 10 && finalbase < 10 && finalbase != 10 && initialbase != finalbase) {
    let res1 = to_base_10(input, initialbase, 10, false);
    let res2 = from_base_10(res1, 10, finalbase, false);
    let temp = "Rezultatul conversiei numărului " + Value.value + " din baza " + initialbase + " în baza " + finalbase + " este " + res2;
    IncreaseTheOppacity(result)
    result.innerHTML = temp;
  }

  if (initialbase < 10 && finalbase > 10) {
    let res1 = to_base_10(input, initialbase, 10, false);
    let res2 = base_10_to_greater_base(res1, 10, finalbase, false);
    let temp = "Rezultatul conversiei numărului " + Value.value + " din baza " + initialbase + " în baza " + finalbase + " este " + res2;
    IncreaseTheOppacity(result);
    result.innerHTML = temp;
  }

  if (initialbase > 10 && finalbase < 10) {
    let res1 = greater_base_to_base_10(input, initialbase, 10, false);
    //let res2 = parseInt(res1, 10)
    res1 = parseInt(res1, 10);
    console.log("Res 1 este: " + res1);
    let res2 = from_base_10(res1, 10, finalbase, false);
    let temp = "Rezultatul conversiei numărului " + Value.value + " din baza " + initialbase + " în baza " + finalbase + " este " + res2;
    IncreaseTheOppacity(result);
    result.innerHTML = temp;
  }

  if (initialbase > 10 && finalbase > 10 && initialbase != finalbase) {
    let res1 = greater_base_to_base_10(input, initialbase, 10, false);
    res1 = parseInt(res1, 10);
    let res2 = base_10_to_greater_base(res1, 10, finalbase, false);
    let temp = "Rezultatul conversiei numărului " + Value.value + " din baza " + initialbase + " în baza " + finalbase + " este " + res2;
    IncreaseTheOppacity(result);
    result.innerHTML = temp;
  }

}

ConvertButton.addEventListener('click', Conversions);
Reset.addEventListener('click', ResetButtonDown);

//exportam functii uzuale catre celalalt modul Javascript, pentru a permite programului ce asigura functionalitatea calculatorului sa aiba acces direct la functiile definite in cadrul acestui fisier

export { greater_base_to_base_10, base_10_to_greater_base, from_base_10, to_base_10, isNumeric, IncreaseTheOppacity, DecreaseTheOppacity };
