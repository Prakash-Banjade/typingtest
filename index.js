// console.log('loaded')
let random_text;
let ranTextSpan;
async function getRanQuote() {
  let response = await fetch("http://quotable.io/random?minLength=100");
  let data = await response.json();
  random_text = data.content;

  let textArray = random_text.split("");
  let textHTML = "";

  textArray.forEach((letter) => {
    textHTML += `<span class="letter">${letter}</span>`;
  });

  let text = document.getElementById("text");
  text.innerHTML = textHTML;

  ranTextSpan = Array.from(document.querySelectorAll(".letter"));
  ranTextSpan[0].scrollIntoView();

  console.log(data.content);
}

getRanQuote();

let text_box = document.getElementById("text_box");
let startTime;
let endTime;
let timeTaken;
let wrongCount = 0;
let rightCount = 0;
// text_box.value = 'this is textbox'

text_box.addEventListener("input", checkText);

function addEventForTimer(){
    text_box.addEventListener(
      "keypress",
      () => {
        // console.log('changed')
        startTime = new Date();
      },
      { once: true }
    );
}

addEventForTimer();

let curr_text;
let curr_letter;
let curr_ind;

function checkText() {
  curr_text = text_box.value;

  // getting current letter index
  curr_ind = curr_text.length - 1 < 0 ? 0 : curr_text.length - 1;

  // getting the typed character
  if (curr_text.length > 0) curr_letter = curr_text.charAt(curr_ind);

  if (curr_text.length == ranTextSpan.length) {
    endTime = new Date();

    timeTaken = (endTime - startTime) / 1000 / 60;
    let totalWords = ranTextSpan.length / 5;
    let acc = Math.floor((rightCount / (rightCount + wrongCount)) * 100);
    let wpm = Math.floor(acc / 100 * (totalWords / timeTaken));


    setScore(wpm, acc);

  }

  if (ranTextSpan[curr_ind] != undefined) {
    ranTextSpan[curr_ind].scrollIntoView();
    ranTextSpan[curr_ind].classList.add("currSpan");
  }
  // checking the character
  if (ranTextSpan[curr_ind - 1] != undefined)
    ranTextSpan[curr_ind - 1].classList.remove("currSpan");
  ranTextSpan[curr_ind + 1].classList.remove("currSpan");

  let spanText =
    ranTextSpan[curr_ind] != undefined ? ranTextSpan[curr_ind].textContent : "";
  if (spanText == curr_letter) {
    rightCount++;
    ranTextSpan[curr_ind].classList.add("right");
    ranTextSpan[curr_ind].classList.remove("wrong");

    ranTextSpan[curr_ind + 1].classList.remove("right", "wrong");
  } else {
    wrongCount++;
    ranTextSpan[curr_ind].classList.add("wrong");
    ranTextSpan[curr_ind].classList.remove("right");

    ranTextSpan[curr_ind + 1].classList.remove("right", "wrong");
  }
}

function setScore(wpm, acc){
    document.getElementById(
        "wpm"
      ).innerHTML = `${wpm} WPM <br> <span>Words Per Minute</span>`;
      document.getElementById(
        "acc"
      ).innerHTML = `${acc}% <br> <span>Accuracy</span>`;
}

let resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", reset);

function reset() {
  getRanQuote();
  text_box.value = "";

  wrongCount = 0;
  rightCount = 0;

  setScore(0, 0)
  addEventForTimer();
}
