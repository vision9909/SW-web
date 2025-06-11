// src/api/spenterApi.js

// userId에 해당하는 월별 지출을 가져옵니다.
export async function fetchMonthlySpending(userId) {
  const res = await fetch(`/api/spending/monthly?id=${userId}`);
  if (!res.ok) {
    throw new Error('월별 지출 데이터 로드 실패');
  }
  return res.json(); // [{ month: '2024-01', amount: 123456 }, ...]
}
