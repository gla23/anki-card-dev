import { getClozeIndex } from "./_anki_cloze.js";
import { boxXY, inAGroup } from "./_box_map.js";
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

export function buildBoxes(data, back, visuals = {}) {
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
      box-sizing: border-box;
    ">
      <div id="hitbox" style="
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 15;
      "></div>
      <div style="
        text-align: center;
        line-height: ${boxHeight - 2}px;
        position: absolute;
        width: 100%;
        z-index: 5;
      ">${boxText}</div>
    </div>`;
    const hitbox = boxElement.children[0];
    section.children[0].appendChild(boxElement);
    // Keep clozeBox to return at the end
    if (box === clozeIndex) clozeBox = boxElement.firstChild;

    if (!back) continue;
    // Hoverover popup

    const popupId = "popUp" + box;
    const popUp = PARSE`<div
        id="${popupId}"
        style="
          position: absolute;
          z-index: 10;
          opacity: 0;
          width: 600px;
          text-align: center;
          transition: opacity 0.2s;
          transform: translate(-50%) translate(${
            boxWidth / 2
          }px, ${boxHeight}px)
        "
        ontransitionend="if (this.style.opacity == 0) this.remove();"
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
      hoverTimeout = setTimeout(() => (popUp.style.opacity = 1), 150);
    };
    hitbox.onmouseleave = (event) => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      if (popUp.style.opacity == 0) popUp.remove();
      if (!event.metaKey) popUp.style.opacity = 0;
    };

    // Groupings
    const { groupings = [] } = visuals;
    groupings.forEach((grouping) => {
      if (box < grouping.start || box > grouping.end) return;
      if (clozeIndex < grouping.start || clozeIndex > grouping.end) return;
      // Label
      const labelBox = grouping.labelBox || grouping.start;
      const labelSide = grouping.labelSide || "top";
      if (box === labelBox) {
        const title = PARSE`<span style="
          font-size: 14px;
          padding: 4px;
          width: ${boxWidth * 2}px;
          position: absolute;
          ${labelSide}: 0px;
          color: ${grouping.colour};
          z-index: 5;
        ">
          ${grouping.labelText}
        </span>`;
        boxElement.appendChild(title);
      }
      // Borders
      const inGroup = inAGroup(grouping);
      const { x, y } = boxXY(box);
      const sides = [
        inGroup(x, y - 1),
        inGroup(x + 1, y),
        inGroup(x, y + 1),
        inGroup(x - 1, y),
      ];
      const sideName = ["Top", "Right", "Bottom", "Left"];
      boxElement.style.borderColor = sides
        .map((side, i) => {
          if (!side) return grouping.colour;
          const previousColor = boxElement.style[`border${sideName[i]}Color`];
          if (previousColor !== "rgb(170, 170, 170)") return previousColor;
          return "#777";
        })
        .join(" ");
      boxElement.style.borderWidth = sides
        .map((side, i) => {
          const previousWidth = boxElement.style[`border${sideName[i]}Width`];
          console.log(side, previousWidth, previousWidth !== "1px");
          if (previousWidth !== "1px") return previousWidth;
          return side ? "1px" : "3px";
        })
        .join(" ");
      boxElement.style.borderRadius = sides
        .map((side, i) => (side || sides[(i + 3) % 4] ? "0px" : "8px"))
        .join(" ");
    });

    // Generate extra graphics
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
