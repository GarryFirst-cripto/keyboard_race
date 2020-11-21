export function createElement(value) {
  const element = document.createElement(value.tagName);
  if (value.id) {
    element.id = value.id;
  }
  if (value.className) {
    const classNames = value.className.split(' ').filter(Boolean);
    element.classList.add(...classNames);
  }
  if (value.text) {
    element.innerText = value.text;
  }
  if (value.onclick) {
    element.onclick = value.onclick;
  }
  if (value.attributes) {
    Object.keys(value.attributes).forEach(key => {
      element.setAttribute(key, value.attributes[key])
    });
  }
  return element;
}


//  Pattern "Factory"
export function elementFactory(elemStructure) {
  const element = createElement(elemStructure);
  if (elemStructure.children) {
    elemStructure.children.forEach(child => {
      element.appendChild(elementFactory(child));
    })
  }
  return element;
}
