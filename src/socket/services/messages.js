const autos = [
  'BMW',
  'Mercedes',
  'Ferrary',
  'Porshe',
  'Toyota',
  'Opel'
]

const colors = [
  'red',
  'white',
  'black',
  'orange',
  'blue',
  'green',
  'yellow'
]

const noGamers = [
  'While we wait for the rest of the riders ...',
  'Key-drome awaits the rest of the participants !',
  'The rest of the members are going to appear soon.'
]

const outsMess = [
  'Can you hear the key-drome roar ? <br /> Fans are eagerly awaiting! The race is about to begin! ',
  'Final preparations are in progress before the start of the race ! <br /> Latest instructions from trainers. '
  + 'The atmosphere is heated to the limit ... ',
  'Spectators are impatient: who will win today ? <br /> It is difficult to predict the outcome with such a complex line-up.',
  'There is very little left before the start. The weather is great for racing today. The key-drome is filled with fanats up to the brim.',
  'Almost everything is ready for the competition. We could have started. The audience at the key-drome is very impatient!'
]

const onStartMess = [
  'So our race has begun ! Racers rushed forward swiftly, what"s going on in the stands ...',
  'So start have been given ! No doubt, just full speed ahead ! Fans support their favorites !',
  'The long awaited moment has come ! Racers rushed to the finish line ! Who will be lucky ?',
  'The race has begun ! Unforgettable minutes await all us ! We wish good luck to all our racers !'
]

const onfinMess = [
  'The race is over! ! It was an incredible day !',
  'That"s All ! All the riders at the finish line  !',
]

export function randomIndex(max) {
  const rand = Math.random() * (max + 1);
  return Math.floor(rand);
}

function createProxy(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      const index = randomIndex(target.length - 1);
      return target[index];
    }
  });
};

export const proxyColors = createProxy(colors);
export const proxyAuto = createProxy(autos);
export const nogamersMess = createProxy(noGamers);
export const outsidMessage = createProxy(outsMess);
export const startMessage = createProxy(onStartMess);
const finMessage = createProxy(onfinMess);

export const messageExit = (userId, auto, index) => {
  const random = randomIndex(2);
  switch (random) {
    case 0:
      return `${userId} ${auto} car disappeared from track № ${index} ! <br /> May be something have happened to the engine ...`;
    case 1:
      return `Member with number ${index} left us : ${userId} ! <br /> His ${auto} returns to the garage. What a loss for the race !`;
    case 2:
      return `With great regret, I must inform you that I no longer see ${userId} ! His ${auto} disappeared from track № ${index} .`
        + 'What have happened to this sportsman ?';
  }
}

export const messageExitRace = (userId, auto, index) => {
  const random = randomIndex(2);
  switch (random) {
    case 0:
      return `Quite unexpectedly retired from the race ${userId} ! I can't see anymore ${auto} on the track ${index} ! <br /> What a loss for our competition ...`;
    case 1:
      return `The participant with the number ${index} left the race : ${userId} ! <br /> Who could have expected this ? His ${auto} rushed to the finish line so confidently ...`;
    case 2:
      return `With great regret I must inform you that ${userId} has left our competition ! His ${auto} disappeared from track № ${index} . Very sorry ...`
  }
}

const qualification = (raceCount, raceWin) => {
  let text = '';
  let textDop = '';
  switch (raceCount) {
    case 0:
    case 1:
      text = 'young beginner keyboard racer';
      textDop = 'only';
      break;
    case 2:
    case 3:
    case 4:
      text = 'not new to key-drome';
      break;
    case 5:
    case 6:
    case 7:
      text = 'quite experienced keyboard racer';
      textDop = 'already';
      break;
    default:
      text = 'very experienced racer';
      textDop = 'already';
  }
  text += `, it is ${textDop} his ${raceCount + 1} race, he has ${raceWin} wins on his score`;
  return text;
}

export const messageInfo = (userId, auto, raceCount, raceWin, index) => {
  const random = randomIndex(2);
  switch (random) {
    case 0:
      return `On track № ${index} we can see ${auto}. This is ${userId} ! <br /> ${userId} ${qualification(raceCount, raceWin)}. Fans greet their favorite noisily !`;
    case 1:
      return `Track number ${index} occuped ${auto}. We are glad to welcome ${userId} ! <br /> ${userId} ${qualification(raceCount, raceWin)}. We wish him good luck !`;
    case 2:
      return `On track numbered ${index} we are glad to see ${userId} ! This is ${qualification(raceCount, raceWin)}. His ${auto} tear"s forward !`;
  }
}

export const messageAdd = (userId, auto, raceCount, raceWin, index) => {
  const random = randomIndex(4);
  switch (random) {
    case 0:
      return `${userId} joined us ! His ${auto} on track № ${index}. <br /> ${userId} ${qualification(raceCount, raceWin)}. Can you hear the crowd reacting happily ?`;
    case 1:
      return `And here is another participant in our competition numbered ${index} ! This is ${userId} and his famous ${auto}. We are glad to welcome ${userId} !`
      + `<br /> ${userId} ${qualification(raceCount, raceWin)}.`;
    case 2:
      return `We have replenishment ! <br /> On track number ${index} now ${auto}. This is ${userId} ! It"s ${qualification(raceCount, raceWin)}. The fight will be very difficult !`;
    case 3:
      return `On track number ${index} now with us ${auto} and ${userId} ! <br /> Welcome new member ! It is ${qualification(raceCount, raceWin)}.`;
    case 4:
      return `Great news before the start ! On track number ${index} comes out ${auto} and ${userId} ! <br /> Greetings ${userId} ! It is ${qualification(raceCount, raceWin)}.`;
  }
}

const textPlace = indd => {
  switch (indd) {
    case 2:
      return 'third';
    case 3:
      return 'fourth';
  }
  return '';
}

export const messageFinish = (results) => {
  const random = randomIndex(2);
  let text = finMessage[''];
  switch (random) {
    case 0:
      text += `Our winner ${results[0].name} and his ${results[0].auto} with result ${results[0].raits}. <br /> This is his ${results[0].raceWin}th victory !`;
      break;
    case 1:
      text += `Today brought ${results[0].raceWin}th victory ${results[0].name} ! He and his ${results[0].auto} at the top of the pedestal with the result ${results[0].raits} !`
      break;
    case 2:
      text += `We congratulate you on a wonderful victory ${results[0].name} and his ${results[0].auto} ! ${results[0].raits} ! This is his ${results[0].raceWin}th victory !`;
      break;
  }
  if (results.length >= 2) {
    text += `<br /> In second place ${results[1].name} with result ${results[1].raits}.`
  }
  for (let i = 2; i < results.length; i++) {
    if (i < results.length - 1) {
      text += `<br /> In ${textPlace(i)} place ${results[i].name} with result ${results[i].raits}.`;
    } else {
      text += `<br /> And in last place we have ${results[i].name} with result ${results[i].raits}.`;
    }
  }
  return text;
}

export const messageFinLine = (userId, auto, finished) => {
  const random = randomIndex(2);
  switch (random) {
    case 0:
      return `At the finish line - ${auto} ! This is ${userId} ! He has a good chance of finishing ${finished + 1}th. Can you hear the crowd reacting happily ?`;
    case 1:
      return `What excitement in the stands! At the finish line ${userId} and his famous ${auto}. The fans cheer !`;
    case 2:
      return `At the finish line - ${auto} ! This is ${userId} Perhaps this is our winner! Unprecedented excitement among the audience!`;
  }
}

export const messageWinner = userId => {
  const random = randomIndex(2);
  switch (random) {
    case 0:
      return `So: we have a winner! This is ${userId} ! He walked towards his victory confidently !`;
    case 1:
      return `Yes ! ${userId} deservedly won in today's race. Fans triumphing !`;
    case 2:
      return `And today ${userId} confidently winning ! Unbelievable excitement among the spectators !`;
  }
}

export const messageNoWinner = (usernm, finished) => {
  return `Another driver successfully completed the race ! ${usernm} finishes ${finished}.`
}