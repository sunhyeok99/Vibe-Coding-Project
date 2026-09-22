'use client';

import { useState } from 'react';

const initialForm = {
  birthDate: '',
  birthTime: '',
  unknownTime: false,
  calendarType: 'solar',
  leapMonth: false,
  gender: '',
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/saju', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '계산에 실패했습니다.');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: '40px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h1>사주팔자 계산기</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>양력 / 음력&nbsp;</label>
          <select value={form.calendarType} onChange={(e) => update('calendarType', e.target.value)}>
            <option value="solar">양력</option>
            <option value="lunar">음력</option>
          </select>
          {form.calendarType === 'lunar' && (
            <label style={{ marginLeft: 12 }}>
              <input type="checkbox" checked={form.leapMonth} onChange={(e) => update('leapMonth', e.target.checked)} />
              &nbsp;윤달
            </label>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>생년월일&nbsp;</label>
          <input type="date" value={form.birthDate} onChange={(e) => update('birthDate', e.target.value)} required />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            <input type="checkbox" checked={form.unknownTime} onChange={(e) => update('unknownTime', e.target.checked)} />
            &nbsp;태어난 시간 모름
          </label>
        </div>

        {!form.unknownTime && (
          <div style={{ marginBottom: 12 }}>
            <label>태어난 시간&nbsp;</label>
            <input type="time" value={form.birthTime} onChange={(e) => update('birthTime', e.target.value)} />
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label>성별 (선택)&nbsp;</label>
          <select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
            <option value="">선택 안 함</option>
            <option value="male">남</option>
            <option value="female">여</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '계산 중...' : '사주 계산하기'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <section style={{ marginTop: 24 }}>
          <h2>사주팔자</h2>
          <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>년주</th>
                <th>월주</th>
                <th>일주</th>
                <th>시주</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{result.pillars.year.korean} ({result.pillars.year.hanja})</td>
                <td>{result.pillars.month.korean} ({result.pillars.month.hanja})</td>
                <td>{result.pillars.day.korean} ({result.pillars.day.hanja})</td>
                <td>{result.pillars.hour ? `${result.pillars.hour.korean} (${result.pillars.hour.hanja})` : '미상'}</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 16, lineHeight: 1.6 }}>{result.interpretation.summary}</p>
        </section>
      )}
    </main>
  );
}
