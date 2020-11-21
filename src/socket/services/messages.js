const autos = [
  'BMW',
  'Mercedes',
  'Ferrary',
  'Porshe',
  'Toyota',
  'Opel'
]

const colors = [
  'красный',
  'белый',
  'черный',
  'оранжевый',
  'синий',
  'зеленый',
  'желтый'
]

const noGamers = [
  'Пока ждем остальных гонщиков ...',
  'Клавадром ждет остальных участников !',
  'Остальные участники вот-вот появятся.'
]

const outsMess = [
  'Вы слышите, как ревет клаводром ? <br /> Болельщики с нетерпением ждут ! Гонка вот-вот начнется !',
  'Идут последние приготовления перед стартом гонки ! <br /> Последние инструкции и наставления от тренеров. '
  + 'Атмосфера накалена до предела ... ',
  'Зрители в нетерпении : кто же победит сегодня ? <br /> Трудно предсказать результат при таком сложном составе участников.',
  'До старта осталось совсем немного. На нашем клаводроме сегодня отличная погода для гонок. Клаводром заполнен почти полностью.',
  'Почти все готово к соревнованиям. Можно было бы и начинать. Публика на клаводроме проявляет большое нетерпение !'
]

const onStartMess = [
  'Итак наша гонка началась ! Гонщики стремительно рванулись вперед, что творится на трибунах ...',
  'Старт дан ! Никаких сомнений, только полный вперед ! Болельщики поддерживают своих фаворитов !',
  'Долгожданный момент настал ! Гонщики устремились к финишу ! Кому улыбнется удача ?',
  'Гонка началась ! Нас ждут незабываемые минуты ! Пожелаем удачи нашим спортсменам !'
]

const onfinMess = [
  'Гонка завершилась ! Это был незабываемый день !',
  'Все, все гонщики на финише !',
]

export function randomIndex(max) {
  const rand = Math.random() * (max + 1);
  return Math.floor(rand);
}

//  Pattern "Proxy"
//  Случайный выбор цвета и марки автомобиля геймера.
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
      return `С дорожки № ${index} исчез ${auto} гонщика ${userId} ! <br /> Наверное что-то случилось с двигателем ...`;
    case 1:
      return `Нас покинул участник под номером ${index} : ${userId} ! <br /> Его ${auto} возвращается в гараж. Какая потеря для гонки !`;
    case 2:
      return `С большим сожалением должен сообщить, что я не вижу ${userId} ! Его ${auto} исчез с дорожки ${index} .`
      + 'Что же случилось с этим спортсменом ?';
  }
}

export const messageExitRace = (userId, auto, index) => {
  const random = randomIndex(2);
  switch (random) {
    case 0:
      return `Совершенно непредвиденно с гонки сошел ${userId} ! Я больше не вижу ${auto} на дорожке ${index} ! <br /> Какая потеря для наших соревнований ...`;
    case 1:
      return `С дистанции сошел участник под номером ${index} : ${userId} ! <br /> Кто мог это ожидать ? Его ${auto} так уверенно рвался к финишу ...`;
    case 2:
      return `С большим сожалением должен сообщить, что наши соревнования покинул ${userId} ! Его ${auto} исчез с дорожки ${index} . Очень жаль ...`
  }
}

const qualification = (raceCount, raceWin) => {
  let text = '';
  let textDop = '';
  switch (raceCount) {
    case 0:
    case 1:
      text = 'молодой, начинающий клаво-гонщик';
      textDop = 'только';
      break;
    case 2:
    case 3:
    case 4:
      text = 'не новичек на клаводроме';
      break;
    case 5:
    case 6:
    case 7:
      text = 'довольно опытный клаво-гонщик';
      textDop = 'уже';
      break;
    default:
      text = 'очень опытный гонщик';
      textDop = 'уже';
  }
  text += `, это ${textDop} его ${raceCount+1} заезд, на его счету ${raceWin} побед`;
  return text;
}

export const messageInfo = (userId, auto, raceCount, raceWin, index) => {
  const random = randomIndex(2);
  switch (random) {
    case 0:
      return `На дорожке № ${index} мы видим ${auto}. Это ${userId} ! <br /> ${userId} ${qualification(raceCount, raceWin)}. Болельщики шумно приветствуют своего любимца !`;
    case 1:
      return `Дорожку под номером ${index} занимает ${auto}. Мы рады приветствовать ${userId} ! <br /> ${userId} ${qualification(raceCount, raceWin)}. Пожелаем ему удачи !`;
    case 2:
      return `На дорожке под номером ${index} мы рады увидеть ${userId} ! Это ${qualification(raceCount, raceWin)}. Его ${auto} просто рвется вперед !`;
  }
}

export const messageAdd = (userId, auto, raceCount, raceWin, index) => {
  const random = randomIndex(4);
  switch (random) {
    case 0:
      return `К нам присоединился ${userId} ! Его ${auto} на дорожке № ${index}. <br /> ${userId} ${qualification(raceCount, raceWin)}. Вы слышите, как радостно реагируют трибуны ?`;
    case 1:
      return `А вот и еще один участник наших соревнований под номером ${index} ! Это ${userId} и его знаменитый ${auto}. Мы рады приветствовать ${userId} !`
      + `<br /> ${userId} ${qualification(raceCount, raceWin)}.`;
    case 2:
      return `Нашего полку прибыло ! <br /> На дорожке номер ${index} теперь ${auto}. Это ${userId} ! Это ${qualification(raceCount, raceWin)}. Поединок будет очень сложным !`;
    case 3:
      return `На дорожке номер ${index} теперь с нами ${auto} и ${userId} ! <br /> Приветствуем нового участника ! Это ${qualification(raceCount, raceWin)}.`;      
    case 4:
      return `Отличная новость перед стартом ! На дорожку номер ${index} выходит ${auto} и ${userId} ! <br /> Приветствуем ${userId} ! Это ${qualification(raceCount, raceWin)}.`; 
  }
}

const textPlace = Indd => {
  switch (indd) {
    case 2:
      return 'третьем';
    case 3:
      return 'четвертом';
  }
  return '';
}

export const messageFinish = (results) => {
  const random = randomIndex(2);
  let text = finMessage[''];
  switch (random) {
    case 0:
      text += `Наш победитель ${results[0].name} и его ${results[0].auto} c результатом ${results[0].raits}. <br /> Это его ${results[0].raceWin} победа !`;
      break;
    case 1:
      text += `Сегодняшний день принес ${results[0].raceWin} победу ${results[0].name} ! Он и его ${results[0].auto} на вершине пьедистала с результатом ${results[0].raits} !`
      break;
    case 2:
      text += `Мы поздравляем с замечательной победой ${results[0].name} и его ${results[0].auto} ! ${results[0].raits} ! Это его ${results[0].raceWin} победа !`;
      break;
  }
  if (results.length >= 2) {
    text += `<br /> На втором месте ${results[1].name} с результатом ${results[1].raits}.`
  }
  for (let i = 2; i < results.length; i++) {
    if (i < results.length - 1) {
      text += `<br /> На ${textPlace(i)} месте ${results[i].name} с результатом ${results[i].raits}.`;
    } else {
      text += `<br /> И на последнем месте у нас ${results[i].name} с результатом ${results[i].raits}.`;
    }
  }
  return text;
}

export const messageFinLine = (userId, auto, finished) => {
  const random = randomIndex(2);
  switch (random) {
    case 0:
      return `На финишной прямой - ${auto} ! Это ${userId} ! У него неплохие шансы финишировать ${finished+1}-м. Вы слышите, как радостно реагируют трибуны ?`;
    case 1:
      return `Какое оживление на трибунах ! На финишной прямой ${userId} и его знаменитый ${auto}. Болельщики ликуют !`;
    case 2:
      return `На финишной прямой - ${auto} ! Это ${userId} Возможно это наш победитель ! Небывалый ажиотаж среди зрителей !`;
  }
}

export const messageWinner = userId => {
  const random = randomIndex(2);
  switch (random) {
    case 0:
      return `Итак : у нас есть победитель ! Это ${userId} ! Он уверенно шел к своей победе !`;
    case 1:
      return `Да ! В сегодняшней гонке заслуженно победил ${userId}. Болельщики ликуют !`;
    case 2:
      return `А сегодня у нас уверенно побеждает ${userId} ! Небывалый ажиотаж среди зрителей !`;
  }
}

export const messageNoWinner = (usernm, finished) => {
  return `Еще один гонщик успешно справился с заездом ! ${usernm} финиширует ${finished}.`
}