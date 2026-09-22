import { NextResponse } from 'next/server';
import { buildPillars } from '../../../lib/saju';
import { interpret } from '../../../lib/interpret';
import { getDb } from '../../../lib/db';

export async function POST(request) {
  const body = await request.json();
  const { birthDate, birthTime, calendarType, leapMonth, gender, unknownTime } = body;

  if (!birthDate || (calendarType !== 'solar' && calendarType !== 'lunar')) {
    return NextResponse.json({ error: '생년월일과 양력/음력 구분은 필수입니다.' }, { status: 400 });
  }

  try {
    const pillars = buildPillars({ birthDate, birthTime, calendarType, leapMonth: !!leapMonth, unknownTime: !!unknownTime });
    const interpretation = interpret(pillars);

    const db = getDb();
    db.prepare(
      `INSERT INTO records (birth_date, birth_time, calendar_type, leap_month, gender, year_pillar, month_pillar, day_pillar, hour_pillar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      birthDate,
      unknownTime ? null : birthTime || null,
      calendarType,
      leapMonth ? 1 : 0,
      gender || null,
      pillars.year.korean,
      pillars.month.korean,
      pillars.day.korean,
      pillars.hour ? pillars.hour.korean : null
    );

    return NextResponse.json({ pillars, interpretation });
  } catch (err) {
    return NextResponse.json({ error: err.message || '계산 중 오류가 발생했습니다.' }, { status: 400 });
  }
}
