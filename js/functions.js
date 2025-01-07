function intervalUntilCondition(callback, time = 1000) {
  let count = 0;
  const interval = setInterval(() => {
    if (callback(count++)) {
      clearInterval(interval);
    }
  }, time);
  callback(count++);
}

function intervalurlchange(callback, time = 0) {
  callback = typeof callback == "function" ? callback : () => {};

  let href = null;

  const callbackInterval = () => {
    if (location.href != href) {
      href = location.href;
      callback(location);
    }
  };

  callbackInterval();
  return setInterval(callbackInterval, time);
}

function replaceText(string = "", object = {}) {
  if (object instanceof Object) {
    Object.entries(object).forEach((entries) => {
      string = string.replace(...entries);
    });
  }

  return string;
}

// const resultado = replaceText(
//   `
//     <div>
//         <form>
//             <input inputEmail>
//             <input inputPassword>
//             <button>buttonIcon</button>
//         </form>
//     </div>
//   `,
//   {
//     inputEmail: `type="text" placeholder=""`,
//     inputPassword: `type="text" placeholder=""`,
//     buttonIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-arrow-right"><path d="M23.12,9.91,19.25,6a1,1,0,0,0-1.42,0h0a1,1,0,0,0,0,1.41L21.39,11H1a1,1,0,0,0-1,1H0a1,1,0,0,0,1,1H21.45l-3.62,3.61a1,1,0,0,0,0,1.42h0a1,1,0,0,0,1.42,0l3.87-3.88A3,3,0,0,0,23.12,9.91Z"></path></svg>`,
//   }
// );

// console.log(resultado);
