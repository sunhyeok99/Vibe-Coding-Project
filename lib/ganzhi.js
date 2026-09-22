// 천간(天干) / 지지(地支) 한자 -> 한글 + 오행 매핑
export const ganInfo = {
  '甲': { korean: '갑', element: '목' },
  '乙': { korean: '을', element: '목' },
  '丙': { korean: '병', element: '화' },
  '丁': { korean: '정', element: '화' },
  '戊': { korean: '무', element: '토' },
  '己': { korean: '기', element: '토' },
  '庚': { korean: '경', element: '금' },
  '辛': { korean: '신', element: '금' },
  '壬': { korean: '임', element: '수' },
  '癸': { korean: '계', element: '수' },
};

export const zhiInfo = {
  '子': { korean: '자', element: '수' },
  '丑': { korean: '축', element: '토' },
  '寅': { korean: '인', element: '목' },
  '卯': { korean: '묘', element: '목' },
  '辰': { korean: '진', element: '토' },
  '巳': { korean: '사', element: '화' },
  '午': { korean: '오', element: '화' },
  '未': { korean: '미', element: '토' },
  '申': { korean: '신', element: '금' },
  '酉': { korean: '유', element: '금' },
  '戌': { korean: '술', element: '토' },
  '亥': { korean: '해', element: '수' },
};

export function splitGanZhi(combined) {
  const ganHanja = combined[0];
  const zhiHanja = combined[1];
  const gan = ganInfo[ganHanja];
  const zhi = zhiInfo[zhiHanja];
  return {
    hanja: combined,
    korean: gan.korean + zhi.korean,
    ganHanja,
    zhiHanja,
    ganElement: gan.element,
    zhiElement: zhi.element,
  };
}
