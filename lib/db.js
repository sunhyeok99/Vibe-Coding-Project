import { DatabaseSync } from 'node:sqlite';
import path from 'path';

let db;

export function getDb() {
  if (!db) {
    db = new DatabaseSync(path.join(process.cwd(), 'data.db'));
    db.exec(`
      CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        birth_date TEXT NOT NULL,
        birth_time TEXT,
        calendar_type TEXT NOT NULL,
        leap_month INTEGER NOT NULL DEFAULT 0,
        gender TEXT,
        year_pillar TEXT NOT NULL,
        month_pillar TEXT NOT NULL,
        day_pillar TEXT NOT NULL,
        hour_pillar TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
  }
  return db;
}
