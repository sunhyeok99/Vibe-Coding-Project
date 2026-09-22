import { NextResponse } from 'next/server';
import { buildPillars } from '../../../lib/saju';
import { interpret } from '../../../lib/interpret';
import { saveRecord } from '../../../lib/db';

export async function POST(request) {
  const body = await request.json();
  const { birthDate, birthTime, calendarType, leapMonth, gender, unknownTime } = body;

  if (!birthDate || (calendarType !== 'solar' && calendarType !== 'lunar')) {
    return NextResponse.json({ error: '생년월일과 양력/음력 구분은 필수입니다.' }, { status: 400 });
  }

  try {
    const pillars = buildPillars({ birthDate, birthTime, calendarType, leapMonth: !!leapMonth, unknownTime: !!unknownTime });
    const interpretation = interpret(pillars);

    await saveRecord({
      birthDate,
      birthTime: unknownTime ? null : birthTime || null,
      calendarType,
      leapMonth: !!leapMonth,
      gender: gender || null,
      yearPillar: pillars.year.korean,
      monthPillar: pillars.month.korean,
      dayPillar: pillars.day.korean,
      hourPillar: pillars.hour ? pillars.hour.korean : null,
    });

    return NextResponse.json({ pillars, interpretation });
  } catch (err) {
    return NextResponse.json({ error: err.message || '계산 중 오류가 발생했습니다.' }, { status: 400 });
  }
}
