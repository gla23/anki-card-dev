const parser = new DOMParser();
export function HTML(strings, ...values) {
  const html = strings.map((string, i) => string + (values[i] ?? "")).join("");
  const doc = parser.parseFromString(html, "text/html");
  return doc.getElementsByTagName("body")[0].firstChild;
}
