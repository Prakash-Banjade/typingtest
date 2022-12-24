let ranTextSpan;
let random_text;
let scoreBoard = document.querySelector('.scoreBoard')

let random_text_array = [
  "An ever-growing number of complex and rigid rules plus hard-to-cope-with regulations are now being legislated from state to state. Key federal regulations were formulated by the FDA, FTC, and the CPSC. Each of these federal agencies serves a specific mission.",

  " One example: Laws sponsored by the Office of the Fair Debt Collection Practices prevent an agency from purposefully harassing clients in serious debt. The Fair Packaging and Labeling Act makes certain that protection from misleading packaging of goods is guaranteed to each buyer of goods carried in small shops as well as in large supermarkets.",

  `Products on the market must reveal the names of all ingredients on the label. Language must be in clear and precise terms that can be understood by everyone. This practice is very crucial for the lives of many people. It is prudent that we recall that the FDA specifically requires that all goods are pure, safe, and wholesome. The FDA states that all goods be produced under highly sanitary conditions.`,

  `Drugs must be completely safe and must also be effective for their stated purpose. This policy applies to cosmetics that must be both safe and pure. Individuals are often totally unappreciative of the FDA's great dedication.`,

  `An Ox came down to a reedy pool to drink. As he splashed heavily into the water, he crushed a young Frog into the mud. The old Frog soon missed the little one and asked his brothers and sisters what had become of him. "A great big monster," said one of them, "stepped on little brother with one of his huge feet!"`,

  `"Big, was he!" said the old Frog, puffing herself up. "Was he as big as this?" "Oh, much bigger!" they cried. The Frog puffed up still more. "He could not have been bigger than this," she said. But the little Frogs all declared that the monster was much, much bigger and the old Frog kept puffing herself out more and more until, all at once, she burst.`,

  `The Mice once called a meeting to decide on a plan to free themselves of their enemy, the Cat. At least they wished to find some way of knowing when she was coming, so they might have time to run away. Indeed, something had to be done, for they lived in such constant fear of her claws that they hardly dared stir from their dens by night or day.`,

  `Many plans were discussed, but none of them was thought good enough. At last a very young Mouse got up and said: "I have a plan that seems very simple, but I know it will be successful. All we have to do is to hang a bell about the Cat's neck. When we hear the bell ringing we will know immediately that our enemy is coming."`,

  `All the Mice were much surprised that they had not thought of such a plan before. But in the midst of the rejoicing over their good fortune, an old Mouse arose and said: "I will say that the plan of the young Mouse is very good. But let me ask one question: Who will bell the Cat?" It is one thing to say that something should be done, but quite a different matter to do it.`,
];
async function getRanQuote() {
  let text = document.getElementById("text");
  text.innerText = "Loading...";
  await fetch("http://quotable.io/random?maxLength=200")
    .then((response) => response.json())
    .then((data) => {
      random_text = data.content;
    })
    .catch(() => {
      random_text = random_text_array[Math.floor(Math.random() * 4)];
    });

  let textArray = random_text.split("");
  let textHTML = "";

  textArray.forEach((letter) => {
    textHTML += `<span class="letter">${letter}</span>`;
  });

  text.innerHTML = textHTML;

  ranTextSpan = Array.from(document.querySelectorAll(".letter"));
  ranTextSpan[0].scrollIntoView();
}

getRanQuote();

let text_box = document.getElementById("text_box");
text_box.focus();

let startTime;
let endTime;
let timeTaken;
let wrongCount = 0;
let rightCount = 0;
let second = 0;
let totalKeysPressed = 0;
let wrongLetters = 0;
let correctLetters = 0;

text_box.addEventListener("input", checkText);

function addEventForTimer() {
  text_box.addEventListener(
    "input",
    () => {
      startTime = new Date();
    },
    { once: true }
  );
}

addEventForTimer();

let curr_text;
let curr_letter;
let curr_ind;

function checkText(e) {
  curr_text = text_box.value;

  // getting current letter index
  curr_ind = curr_text.length - 1 < 0 ? 0 : curr_text.length - 1;

  // getting the typed character
  if (curr_text.length > 0) curr_letter = curr_text.charAt(curr_ind);

  if (e.keyCode != 8 || e.keyCode != 46) totalKeysPressed++;

  if (ranTextSpan[curr_ind] != undefined) {
    ranTextSpan[curr_ind].scrollIntoView();
    ranTextSpan[curr_ind].classList.add("currSpan");
  }
  // checking the character
  if (ranTextSpan[curr_ind - 1] != undefined)
    ranTextSpan[curr_ind - 1].classList.remove("currSpan");

  if (ranTextSpan[curr_ind + 1] != undefined)
    ranTextSpan[curr_ind + 1].classList.remove("currSpan");

  let spanText =
    ranTextSpan[curr_ind] != undefined ? ranTextSpan[curr_ind].textContent : "";
  if (spanText == curr_letter) {
    rightCount++;
    ranTextSpan[curr_ind].classList.add("right");
    ranTextSpan[curr_ind].classList.remove("wrong");

    if (ranTextSpan[curr_ind + 1] != undefined)
      ranTextSpan[curr_ind + 1].classList.remove("right", "wrong");
  } else {
    wrongCount++;
    ranTextSpan[curr_ind].classList.add("wrong");
    ranTextSpan[curr_ind].classList.remove("right");

    if (ranTextSpan[curr_ind + 1] != undefined)
      ranTextSpan[curr_ind + 1].classList.remove("right", "wrong");
  }

  if (curr_text.length == ranTextSpan.length) {
    endTime = new Date();
    timeTaken = Number(endTime - startTime) / 1000 / 60;
    let acc = Math.floor((rightCount / totalKeysPressed) * 100);
    let wpm = Math.floor((acc / 100) * (totalKeysPressed / 5 / timeTaken));
    text_box.removeEventListener("input", checkText);
    ranTextSpan.forEach((span) => {
      if (span.classList.contains("wrong")) wrongLetters++;
      if (span.classList.contains("right")) correctLetters++;
      span.classList.remove('currSpan')
    });

    setScore(wpm, acc, totalKeysPressed, wrongLetters, correctLetters);
    text_box.blur();
    if (window.innerWidth <= 900) document.querySelector('.scoreBoard').scrollIntoView();
    scoreBoard.style.display = 'block'
  }
}

function setScore(wpm, acc, keysPressed, wletters, cletters) {
  // console.log(wpm);
  document.getElementById(
    "wpm"
  ).innerHTML = `${wpm} WPM <br /><span>Words Per Minute</span>`;
  document.getElementById("acc").innerHTML = `${acc}%`;
  document.getElementById("keystrokes").innerText = keysPressed;
  document.getElementById('cletters').innerText = cletters;
  document.getElementById('wletters').innerText = wletters;
}

let resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", reset);

function reset() {
  getRanQuote();
  text_box.addEventListener("input", checkText);
  text_box.value = "";
  text_box.focus();

  wrongCount = 0;
  rightCount = 0;
  totalKeysPressed = 0;
  addEventForTimer();
}
