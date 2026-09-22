import { Solar, Lunar } from 'lunar-javascript';
import { splitGanZhi } from './ganzhi';

// ponytail: 진태양시(출생지 경도 보정) 미적용, 필요해지면 추가
export function buildPillars({ birthDate, birthTime, calendarType, leapMonth, unknownTime }) {
  const [year, month, day] = birthDate.split('-').map(Number);
  let hour = 0;
  let minute = 0;
  if (!unknownTime && birthTime) {
    [hour, minute] = birthTime.split(':').map(Number);
  }

  let eightChar;
  if (calendarType === 'lunar') {
    const lunarMonth = leapMonth ? -month : month;
    eightChar = Lunar.fromYmdHms(year, lunarMonth, day, hour, minute, 0).getEightChar();
  } else {
    eightChar = Solar.fromYmdHms(year, month, day, hour, minute, 0).getLunar().getEightChar();
  }

  const pillars = {
    year: splitGanZhi(eightChar.getYear()),
    month: splitGanZhi(eightChar.getMonth()),
    day: splitGanZhi(eightChar.getDay()),
  };
  if (!unknownTime) {
    pillars.hour = splitGanZhi(eightChar.getTime());
  }
  return pillars;
}
