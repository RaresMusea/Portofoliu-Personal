import { greater_base_to_base_10, base_10_to_greater_base, from_base_10, to_base_10, isNumeric, IncreaseTheOppacity, DecreaseTheOppacity } from './functionality_converter.js';

let reset = document.getElementById('reset1');

let calc = document.querySelector('.calculate');

let res = document.querySelector('.result1');

//Functie ce asigura functionalitatea butonului cu textul Reset din modal 

function ResetFields() {

  document.querySelector('.nr1').value = "";
  document.querySelector('.nr2').value = "";
  DecreaseTheOppacity(document.querySelector('.result1'));
  document.querySelector('#base').selectedIndex = 0;
  document.querySelector('.op').selectedIndex = 0;
  res.innerHTML = "";

}

//Adaugam un event listener pentru butonul de Reset
reset.addEventListener('click', ResetFields);

//Functia ce asigura functionalitatea din spatele calculatorului de conversie intre baze 

function Calculate() {
  let nr1 = document.querySelector(".nr1").value;
  let nr2 = document.querySelector(".nr2").value;
  let base = document.querySelector('#base').value;
  let operator = document.querySelector(".op").value;
  let nr1_temp, nr2_temp, result, str1 = nr1, str2 = nr2, disp;
  base = parseInt(base, 10);

  if (isNumeric(nr1))
    nr1 = parseInt(nr1, 10);

  if (isNumeric(nr2))
    nr2 = parseInt(nr2, 10);

  if (base < 10) {
    nr1_temp = to_base_10(nr1, base, 10, false);
    nr2_temp = to_base_10(nr2, base, 10, false);
  }

  if (base > 10) {
    nr1_temp = greater_base_to_base_10(nr1, base, 10, false);
    nr2_temp = greater_base_to_base_10(nr2, base, 10, false);
  }

  console.log(operator);

  switch (operator) {
    case '+':
      if (base != 10)
        result = nr1_temp + nr2_temp;
      else
        result = nr1 + nr2;
      if (base < 10)
        result = from_base_10(result, 10, base, false);
      else if (base > 10)
        result = base_10_to_greater_base(result, 10, base, false);

      disp = "Rezultat:\n" + str1 + "<sub>" + "(" + base + ")" + "</sub>" + " + " + str2 + "<sub>" + "(" + base + ")" + "</sub> " + " = " + result + "<sub>" + "(" + base + ")" + "</sub>";
      IncreaseTheOppacity(res);
      res.innerHTML = disp;
      break;
    case '-':
      if (base != 10)
        result = nr1_temp - nr2_temp;
      else
        result = nr1 - nr2;
      if (base < 10)
        result = from_base_10(result, 10, base, false);
      else if (base > 10)
        result = base_10_to_greater_base(result, 10, base, false);

      disp = "Rezultat:\n" + str1 + "<sub>" + "(" + base + ")" + "</sub>" + " - " + str2 + "<sub>" + "(" + base + ")" + "</sub> " + " = " + result + "<sub>" + "(" + base + ")" + "</sub>";
      res.innerHTML = disp;
      IncreaseTheOppacity(res);
      break;

    case 'x':
      if (base != 10)
        result = nr1_temp * nr2_temp;
      else
        result = nr1 * nr2;
      if (base < 10)
        result = from_base_10(result, 10, base, false);
      else if (base > 10)
        result = base_10_to_greater_base(result, 10, base, false);

      disp = "Rezultat:\n" + str1 + "<sub>" + "(" + base + ")" + "</sub>" + " x " + str2 + "<sub>" + "(" + base + ")" + "</sub> " + " = " + result + "<sub>" + "(" + base + ")" + "</sub>";
      IncreaseTheOppacity(res);
      res.innerHTML = disp;
      break;

    case '/':
      if (base != 10)
        result = Math.floor(nr1_temp / nr2_temp);
      else
        result = Math.floor(nr1 / nr2);
      if (base < 10)
        result = from_base_10(result, 10, base, false);
      else if (base > 10)
        result = base_10_to_greater_base(result, 10, base, false);

      disp = "Rezultat:\n" + str1 + "<sub>" + "(" + base + ")" + "</sub>" + " &divide " + str2 + "<sub>" + "(" + base + ")" + "</sub> " + " = " + result + "<sub>" + "(" + base + ")" + "</sub>";
      IncreaseTheOppacity(res);
      res.innerHTML = disp;
      break;

  }

}

calc.addEventListener('click', Calculate);



