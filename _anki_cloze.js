console.log("cloze functions loaded");

// Cloze helpers
export function getClozeElement() {
  return document.querySelector(".cloze");
}

const clozeNumberRegex = new RegExp("card\\d+");
const body = document.querySelector("body");

export function getClozeIndex() {
  const clozeMatch = Array.from(body.classList).find(function (string) {
    return clozeNumberRegex.test(string);
  });
  const clozeIndexString = clozeMatch.slice(4);
  const clozeIndex = parseInt(clozeIndexString);
  return clozeIndex;
}
