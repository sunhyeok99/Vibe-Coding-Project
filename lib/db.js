import { neon } from '@neondatabase/serverless';

let sql;
let initialized = false;

function getSql() {
  if (!sql) {
    sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  }
  return sql;
}

async function ensureTable() {
  if (initialized) return;
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS records (
      id SERIAL PRIMARY KEY,
      birth_date TEXT NOT NULL,
      birth_time TEXT,
      calendar_type TEXT NOT NULL,
      leap_month BOOLEAN NOT NULL DEFAULT false,
      gender TEXT,
      year_pillar TEXT NOT NULL,
      month_pillar TEXT NOT NULL,
      day_pillar TEXT NOT NULL,
      hour_pillar TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    )
  `;
  initialized = true;
}

export async function saveRecord(r) {
  await ensureTable();
  await getSql()`
    INSERT INTO records
      (birth_date, birth_time, calendar_type, leap_month, gender, year_pillar, month_pillar, day_pillar, hour_pillar)
    VALUES
      (${r.birthDate}, ${r.birthTime}, ${r.calendarType}, ${r.leapMonth}, ${r.gender}, ${r.yearPillar}, ${r.monthPillar}, ${r.dayPillar}, ${r.hourPillar})
  `;
}
