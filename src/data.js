const texts = [
  'On board, there were over 1300 passengers. About 300 of these were First Class passengers, who enjoyed facilities such as restaurants, cafes, a library, a gym, a swimming pool and a telegraph office which could send radio messages back to families and business colleagues on shore. The First Class passengers included some of the wealthiest and most influential people in the world. Most of the passengers, however, travelled Second or Third Class, in much more humble conditions.',
  'The story of Titanic still fascinates people today. The wreck of Titanic was rediscovered on the bed of the Atlantic in 1985, and many items such as crockery and bits of luggage were brought to the surface and exhibited for people to see. There have been countless books and films about Titanic‘s first and last voyage, and theories about what really happened and who was to blame for the sinking.',
  'Today, the people of Iceland are descended from the Vikings. Some Vikings sailed farther west to the cold island of Greenland. Vikings lived in Greenland for several generations, but eventually they died out. Some Vikings had gone even further west and reached the Canadian island of Newfoundland. The Vikings only stayed for a few years, but they had reached North America about 500 years before Christopher Columbus!',
  'The Vikings made their attacks very quickly and without any warning. They were very cruel to the people of the towns they attacked, and they sometimes destroyed the towns by burning down the buildings. In some parts of Europe, the local kings would often fight against the Vikings. Sometimes, however, the kings would pay the Vikings in order to persuade them not to attack.',
  'However, tea drinking is not an old tradition in Britain. We made our first cup of tea sometime in the middle of the 17th century. We found that we liked it, that it refreshed us and made us strong and happy, and we have continued drinking tea ever since. In the 19th century, tea became popular among working-class people, and it has remained the favourite drink of ordinary British people ever since. And it is well-known that the Queen likes a nice cup of tea, as well.',
  'First, you put some water in a kettle and put it on the stove to boil. When it is nearly boiling, you pour a small amount of the hot water into a tea-pot, and swill it round, and pour it out again. This warms the tea pot. Then you put tea or tea bags into the tea pot. How much tea? Well, my mother used to say that you should put in one teabag for each person, plus one for the pot. So, if you are making tea for two people, you should put three teabags into the pot.',
  'Robert Scott was born in 1868. He joined the Royal Navy at the age of 13. Over the years, he rose in rank, and became an expert in naval torpedoes. In 1899, he heard that the Royal Geographical Society in London planned to send an expedition to Antarctica. Although he had no previous experience of Antarctica, he was enthusiastic about the challenges of the expedition, and he volunteered to lead it.',
  'The seas around Britain can be very dangerous. The Romans, who conquered England in 43 AD, knew this. They built lighthouses at Dover in England and Boulogne in France to guide ships across the Channel. However, the lighthouses fell into disuse after the Romans left at the beginning of the 5th century. For hundreds of years, the seas around Britain were completely dark at night. There was nothing to help sailors find their way, or to warn them of dangers.'
];

//  Pattern "Factory"
//  Хотя здесь он абсолютно не обязателен.
export const proxyText = new Proxy(texts, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      return 'Этот абзац недоступен !';
    }
  }
});
