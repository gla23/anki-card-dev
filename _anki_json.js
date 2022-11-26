import { getClozeIndex } from "./_anki_cloze.js";
// Add these two elements to import field with name "json"
// <div id="jsonData" style="display: none">{{json}}</div>
// <div id='errorRoot' style="color: tomato;"></div>

const parser = new DOMParser();
function PARSE(strings, ...values) {
  const html = strings.map((string, i) => string + (values[i] || "")).join("");
  const doc = parser.parseFromString(html, "text/html");
  return doc.getElementsByTagName("body")[0].firstChild;
}
const boxWidth = 65;
const boxHeight = Math.floor((boxWidth / 21) * 30);

export function buildBoxes(data, useClass) {
  const count = data.length;
  const sections = [];
  const clozeIndex = getClozeIndex();
  let clozeBox = null;

  for (let box = 1; box <= count; box++) {
    const boxData = data[box - 1];
    const boxClass = boxData.class || "";
    const sectionId = Math.floor((box - 1) / 10);

    if (!sections[sectionId])
      sections[sectionId] = PARSE`
        <div class="section" style="display: inline-block;margin-left: 8px;vertical-align: top;">
          <div class="flex" style="display: flex; width: ${
            boxWidth * 2
          }px; flex-wrap: wrap;">
          </div>
        </div>
      `;
    const section = sections[sectionId];
    const boxElement = PARSE`<div class="inner box${box} ${
      useClass ? boxClass : ""
    }" style="width: ${boxWidth - 2}px; height: ${
      boxHeight - 2
    }px;line-height: ${boxHeight - 2}px;border: #aaa 1px solid;">${
      box === clozeIndex ? "?" : ""
    }</div>`;

    section.children[0].appendChild(boxElement);
    if (box === clozeIndex) clozeBox = boxElement;
  }
  sections.forEach((section) => boxesRoot.appendChild(section));
  return clozeBox;
}
export function getJSON() {
  // Get the json
  const json = jsonData.innerHTML;
  let data,
    error = null;
  try {
    data = JSON.parse(json);
  } catch (e) {
    error = e.message;
  }
  if (error) {
    errorRoot.innerHTML = error;
    throw error;
  }
  return data;
}