// `anki` command opens this folder in VSCode
// The Tailwind classes are in @import url("_anki_base.css");

console.log("Now loaded _anki_base.js");

// Usage when building cards:
// <script type="module">
// var { choose, swapCSSProperty, randomMajor } = await import(`/_anki_base.js?version=${Date.now()}`);
// </script>

// Usage for availability within cards fields where Anki removes scripts
// <script type="module">
// await import(`/_anki_base.js?version=${Date.now()}`);
// </script>

// Register helpers on the window for use in cards
window.randomMajor = randomMajor;
window.choose = choose;
window.swapCSSProperty = swapCSSProperty;

// Helpers
export function randomMajor(max = 30) {
  return String(Math.floor(Math.random() * max)).padStart(2, "0");
}
export function choose(arr = []) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}
export function swapCSSProperty(selector, property, a, b, changeText = false) {
  document.querySelectorAll(selector).forEach((elem) => {
    const style = window.getComputedStyle(elem);
    const old = property.startsWith("--")
      ? style.getPropertyValue(property)
      : elem.style[property];
    const neww = old === a ? b : a;
    elem.style.setProperty(property, neww);
    elem.innerHTML = neww;
    console.log(
      `Swapping ${property} to ${neww} (${selector} previously ${old})`
    );
  });
}

// To do: find where this is and move out?
document.querySelectorAll(".simpleDivisor").forEach((elem) => {
  const chosen = choose([2, 4, 8, 16, 5, 25, 3, 6, 9, 12, 24, 18, 36]);
  elem.innerHTML = chosen;
});
