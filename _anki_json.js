import { getClozeIndex } from "./_anki_cloze.js";
// Add these two elements to import field with name "json"
// <div id="jsonData" style="display: none">{{json}}</div>
// <div id='errorRoot' style="color: tomato;"></div>

const parser = new DOMParser();
function PARSE(strings, ...values) {
  const html = strings.map((string, i) => string + (values[i] ?? "")).join("");
  const doc = parser.parseFromString(html, "text/html");
  return doc.getElementsByTagName("body")[0].firstChild;
}
const boxWidth = 65;
const boxHeight = Math.floor((boxWidth / 21) * 30);
const sectionMargin = 8;

export function buildBoxes(data, back, visuals) {
  const count = data.length;
  const sections = [];
  const clozeIndex = getClozeIndex();
  let clozeBox = null;

  for (let box = 1; box <= count; box++) {
    const boxData = data[box - 1];

    // Get 10 box section
    const sectionId = Math.floor((box - 1) / 10);
    if (!sections[sectionId])
      sections[sectionId] = PARSE`
        <div class="section" style="display: inline-block;margin-left: ${sectionMargin}px;vertical-align: top;">
          <div class="flex" style="display: flex; width: ${
            boxWidth * 2
          }px; flex-wrap: wrap;">
          </div>
        </div>
      `;
    const section = sections[sectionId];

    // Add this box to section
    const boxClass = boxData.class || "";
    const boxText = box === clozeIndex ? (back ? box : "?") : "";
    const boxElement = PARSE`<div class="inner box${box} ${
      back ? boxClass : ""
    }" style="
      position: relative;
      text-align: left;
      width: ${boxWidth - 2}px;
      height: ${boxHeight - 2}px;
      border: #aaa 1px solid;
    ">
      <div id="hitbox" style="
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 6;
      "></div>
      <div style="
        text-align: center;
        line-height: ${boxHeight - 2}px;
      ">${boxText}</div>
    </div>`;
    const hitbox = boxElement.children[0];
    section.children[0].appendChild(boxElement);
    // Keep clozeBox to return at the end
    if (box === clozeIndex) clozeBox = boxElement.firstChild;

    // Generate extra graphics
    if (back) {
      visuals?.genealogies
        ?.filter((genealogy) => genealogy.chapter === box)
        .forEach((genealogy) => {
          const { start = 0, end = 1 } = genealogy;
          const scale = (end - start) * 1.5;
          const scroll = PARSE`<img src="scroll.svg" style="
            position: absolute;
            padding-left: ${15}%;
            width: ${70}%;
            object-fit: fill;
            transform: translate(0px, ${start * 75 + 8}px) scale(1, ${scale});
            transform-origin: top left;
          "/>`;
          boxElement.appendChild(scroll);
        });
    }
    // Hoverover popup
    if (back) {
      const popupId = "popUp" + box;
      const popUp = PARSE`<div
        id="${popupId}"
        style="
          position: absolute;
          z-index: 5;
          opacity: 0;
          width: 600px;
          text-align: center;
          transition: opacity 0.2s;
          transform: translate(-50%) translate(${
            boxWidth / 2
          }px, ${boxHeight}px)
        "
        ontransitionend="if (this.style.opacity === 0) this.remove();"
      >
        <div style="
          background: rgba(80, 80, 80, 0.9);
          border: #888 solid 1px;
          color: #eee;
          border-radius: 5px;
          display: inline-block;
          text-align: left;
          transform: translate(0px, ${(-boxHeight * 1) / 7}px);
        ">
          <div style="margin: 8px; white-space: nowrap;">${boxData.rhyme}</div>
          <div style="margin: ${
            boxData.comment ? 8 : 0
          }px; width: fit-content; max-width: 800px; font-size: 13px; text-align: justify; color: #ccc;">${
        boxData.comment
      }</div>
        </div>
      </div>`;
      let hoverTimeout;
      hitbox.onmouseenter = () => {
        boxElement.appendChild(popUp);
        hoverTimeout = setTimeout(() => (popUp.style.opacity = 1), 300);
      };
      hitbox.onmouseleave = (event) => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        if (!event.metaKey) popUp.style.opacity = 0;
      };
    }
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
