function loader() {
    var tl = gsap.timeline();
  
    // Animate elements within the loader
    tl.from(".line h1 ", {
      y: 150,
      stagger: 0.2,
      duration: 0.6,
      delay: 0.5,
    });
  
    tl.from("#line-p1 ", {
      opacity: 0,
      onStart: function () {
        let h1timer = document.querySelector("#h5");
        let grow = 0;
  
        setInterval(() => {
          if (grow < 100) {
            h1timer.innerHTML = grow++;
          } else {
            h1timer.innerHTML = grow;
          }
        }, 15);
      },
    });
  
    tl.to(" #h2", {
      opacity: 1,
    });
  
    tl.from(" #line2", {
      opacity: 0,
      duration: 0.3,
      delay: 0.2,
    });
    
    tl.to("#loader", {
      ease: "circ.inOut",
      opacity: 0,
      duration: 2.3,
       });
  
    tl.from(".container", {
      y: 1600,
      opacity: 0,
      duration: 1,
      ease: "power4",
    });
  
    tl.to("#loader", {
      display: "none",
    });
  }
  
  loader();

  const BASE_URL =
  "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=533a4679697e430aa1ea2700713fbfcc";

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const btn = document.querySelector("form button");
const dropdown = document.querySelectorAll(".dropdown select");

for (let select of dropdown) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  let response = await fetch(BASE_URL);
  let data = await response.json();

  let fromRate = data.rates[fromCurr.value];
  let toRate = data.rates[toCurr.value];
  //We calculate the conversion rate by dividing the "to" rate by the "from" rate.
  let rate = toRate / fromRate;
  let finalAmount = amtVal * rate;
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${
    toCurr.value
  }`;
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};


//When the user clicks the "Convert" button, we prevent the default behavior of the form submission (evt.preventDefault()) and call updateExchangeRate() to perform the currency conversion.
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});


//When the page first loads (window.addEventListener("load")), we automatically call updateExchangeRate() so the user sees the conversion result right away
window.addEventListener("load", () => {
    updateExchangeRate();
})