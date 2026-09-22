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

const elementClass = {
  목: 'el-wood',
  화: 'el-fire',
  토: 'el-earth',
  금: 'el-metal',
  수: 'el-water',
};

function Pillar({ label, pillar }) {
  return (
    <div className="pillar">
      <div className="pillar-label">{label}</div>
      {pillar ? (
        <div className="pillar-chars">
          <span className={elementClass[pillar.ganElement]}>{pillar.korean[0]}</span>
          <span className={elementClass[pillar.zhiElement]}>{pillar.korean[1]}</span>
        </div>
      ) : (
        <div className="pillar-empty">미상</div>
      )}
    </div>
  );
}

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
    <main>
      <h1 className="title">사주팔자</h1>
      <div className="divider" />

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>양력 / 음력</label>
          <select value={form.calendarType} onChange={(e) => update('calendarType', e.target.value)}>
            <option value="solar">양력</option>
            <option value="lunar">음력</option>
          </select>
          {form.calendarType === 'lunar' && (
            <label style={{ marginLeft: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={form.leapMonth} onChange={(e) => update('leapMonth', e.target.checked)} />
              윤달
            </label>
          )}
        </div>

        <div className="field">
          <label>생년월일</label>
          <input type="date" value={form.birthDate} onChange={(e) => update('birthDate', e.target.value)} required />
        </div>

        <div className="field-inline">
          <input type="checkbox" checked={form.unknownTime} onChange={(e) => update('unknownTime', e.target.checked)} />
          <label>태어난 시간 모름</label>
        </div>

        {!form.unknownTime && (
          <div className="field">
            <label>태어난 시간</label>
            <input type="time" value={form.birthTime} onChange={(e) => update('birthTime', e.target.value)} />
          </div>
        )}

        <div className="field">
          <label>성별 (선택)</label>
          <select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
            <option value="">선택 안 함</option>
            <option value="male">남</option>
            <option value="female">여</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '계산 중...' : '사주 보기'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <section className="result">
          <h2>사주팔자</h2>
          <div className="pillars">
            <Pillar label="년주" pillar={result.pillars.year} />
            <Pillar label="월주" pillar={result.pillars.month} />
            <Pillar label="일주" pillar={result.pillars.day} />
            <Pillar label="시주" pillar={result.pillars.hour} />
          </div>

          <div className="legend">
            <span><i className="dot" style={{ background: 'var(--el-wood)' }} />목</span>
            <span><i className="dot" style={{ background: 'var(--el-fire)' }} />화</span>
            <span><i className="dot" style={{ background: 'var(--el-earth)' }} />토</span>
            <span><i className="dot" style={{ background: 'var(--el-metal)' }} />금</span>
            <span><i className="dot" style={{ background: 'var(--el-water)' }} />수</span>
          </div>

          <p className="interpretation">{result.interpretation.summary}</p>
        </section>
      )}
    </main>
  );
}
