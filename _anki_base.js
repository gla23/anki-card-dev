// `anki` HS command opens this folder in VSCode
// The Tailwind classes are in @import url("_anki_base.css");
import { HTML } from "./_HTML.js";

console.log("Now loaded _anki_base.js");

// Usage when building cards:
// <script type="module">
// var { choose, swapCSSProperty, randomMajor } = await import(`/_anki_base.js?version=${Date.now()}`);
// </script>

// Register helpers on the window for use in cards
window.randomMajor = randomMajor;
window.choose = choose;
window.swapCSSProperty = swapCSSProperty;
window.$$ = (...args) => Array.from(document.querySelectorAll(...args));
window.$ = document.querySelector.bind(document);

// Syntax hightlighting
const languages = [
  "js",
  "ts",
  "css",
  "lua",
  "sql",
  "json",
  "python",
  "bash",
  "html",
  "php",
  // Updates here should also go in: code '/Users/gandersen/Library/Application Support/Anki2/addons21/181103283/user_files'
];

const term = document.getElementById("terminal");
if (term)
  import(`./_terminal.js?version=${Date.now()}`).then((module) => {
    console.log(module);
  });

import(`./_highlight.min.js?version=${1}`).then((module) => {
  document
    .querySelectorAll(
      languages
        .map((language) => `.language-${language}`)
        .concat(["js"])
        .join(", ")
    )
    .forEach((block) => {
      hljs.highlightElement(block);
      block.style.whiteSpace = "pre";
      block.style.fontFamily = "monospace";
      block.style.fontSize = "18px";
      block.style.margin = "8px 4px 8px 4px";
      block.style.padding = "0px 4px 0px 4px";
      block.style.border = "rgba(128, 128, 128, 0.5) solid 1px";
      // if (block.style.display !== "none") block.style.display = "inline-block";
    });
});

// Run JS elements
$$("js").forEach((elem) => {
  const fn = new Function(elem.innerHTML);
  fn();
});

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
    console.log(old === a, old, a, b);
    const neww = old === a ? b : a;
    elem.style.setProperty(property, neww);
    if (changeText) elem.innerHTML = neww;
    if (typeof currentValue !== "undefined") currentValue.innerHTML = neww;
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

// Add relevant tags to the bottom of all cards
const back = $(".back");
let tagDiv = $(".tagDiv");
if (tagDiv) {
  tagDiv.remove();
  tagDiv = null;
}
if (!tagDiv && back) {
  const tags = $(".tags")
    .innerText.split(" ")
    .filter((tag) => tag.endsWith("course"));
  const elem = HTML`<span class="tagDiv" style="
    position: fixed;
    bottom: 20px;
    text-align: left;
    display: inline-block;
    color: rgba(128, 128, 128);
    font-size: 16px;
    transform: translate(-50%)
  ">${tags.map(
    (tag) => `<span style="
      border: rgba(128, 128, 128, 0.5) 1px solid;
      padding: 4px 8px;
      border-radius: 4px;
    ">${tag}</span>`
  )}</span>`;
  back.appendChild(elem);
}
