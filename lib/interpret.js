const dayMasterTraits = {
  '甲': '큰 나무처럼 곧고 성장 지향적이며 리더십이 강한 성향입니다.',
  '乙': '화초처럼 유연하고 적응력이 뛰어나며 부드러운 성향입니다.',
  '丙': '태양처럼 밝고 적극적이며 주변을 이끄는 에너지를 가졌습니다.',
  '丁': '촛불처럼 섬세하고 따뜻하며 배려심이 깊은 성향입니다.',
  '戊': '산처럼 묵직하고 신뢰감을 주며 안정적인 성향입니다.',
  '己': '논밭처럼 포용력 있고 실용적이며 성실한 성향입니다.',
  '庚': '무쇠처럼 단단하고 결단력이 있으며 원칙적인 성향입니다.',
  '辛': '보석처럼 예민하고 섬세하며 미적 감각이 뛰어난 성향입니다.',
  '壬': '바다처럼 넓고 지혜로우며 포용력이 큰 성향입니다.',
  '癸': '이슬처럼 맑고 세심하며 감수성이 풍부한 성향입니다.',
};

const elements = ['목', '화', '토', '금', '수'];

// ponytail: 십성/대운 등 정밀 해석 없음, 필요해지면 추가
export function interpret(pillars) {
  const trait = dayMasterTraits[pillars.day.ganHanja] || '';

  const counts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const p of [pillars.year, pillars.month, pillars.day, pillars.hour].filter(Boolean)) {
    counts[p.ganElement]++;
    counts[p.zhiElement]++;
  }

  const strongest = elements.slice().sort((a, b) => counts[b] - counts[a])[0];
  const missing = elements.filter((e) => counts[e] === 0);

  let balance = `오행 분포는 ${elements.map((e) => `${e} ${counts[e]}개`).join(', ')}로, ${strongest} 기운이 가장 강합니다.`;
  if (missing.length > 0) {
    balance += ` ${missing.join(', ')} 기운은 원국에 없어 보완이 필요할 수 있습니다.`;
  }

  return {
    summary: `${trait} ${balance}`,
    counts,
  };
}
