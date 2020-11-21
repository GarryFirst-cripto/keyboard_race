import { elementFactory } from "../helpers/domHelper.mjs"

const modalClose = event => {
  document.body.removeChild(event.currentTarget);
}

export const showModal = (title, message) => {
  const modal = elementFactory(
    {
      tagName: 'section', className: 'modalcover', onclick: modalClose, children: [
        {
          tagName: 'section', className: 'modalwindow', children: [
            { tagName: 'div', className: 'modaltitle', text: title },
            { tagName: 'div', className: 'modalresult', text: message },
            { tagName: 'div', className: 'modalfooter', text: '(Кликните где-нибудь ...)' }
          ]
        }
      ]
    }
  );
  document.body.appendChild(modal);
}