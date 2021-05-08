import { elementFactory } from './domHelper.mjs';

const audioSource = [
  '/game/sounds/beep.mp3',
  '/game/sounds/news-1.mp3',
  '/game/sounds/news-2.mp3',
  '/game/sounds/news-3.mp3',
  '/game/sounds/finish.mp3'
]

const audios = [];
audioSource.forEach(item => {
  const audio = elementFactory(
    { tagName: 'audio', attributes: { src: item }, children: [
      { tagName: 'source', attributes: { src: 'name.mp3', type: 'audio/mpeg' } },
    ]}
  );
  audio.volume=0.5;
  audios.push(audio);
});

function randomIndex(max) {
  const rand = Math.random() * (max + 1);
  return Math.floor(rand);
}

export const proxyAudio = new Proxy(audios, {
  get(target, prop) {
    switch (prop) {
      case 'stop' :
        target.forEach(item => item.pause());
        break;
      case 'start':
        target[0].play();
        break;
      case 'finish':
        target[4].play();
        break;
      default:
        const index = randomIndex(2) + 1;
        target[index].play();
    }
    return '';
  }
});
