// src/components/TransactionForm.jsx

import React, { useState, useEffect } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ initialData = null, onSubmit, onCancel }) => {
  // === 폼 입력 필드 상태 관리 ===
  const [type, setType] = useState('expense'); // 'expense' 또는 'income'
  const [category, setCategory] = useState('');
  const [detail, setDetail] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [memo, setMemo] = useState('');

  // initialData(편집 모드) 값이 있을 때, 해당 데이터를 상태에 세팅
  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setCategory(initialData.category || '');
      setDetail(initialData.detail || '');
      setAmount(initialData.amount || '');
      setDate(initialData.date || '');
      setMemo(initialData.memo || '');
    } else {
      // 새로운 거래 추가 모드라면, 모든 필드를 초기화
      setType('expense');
      setCategory('');
      setDetail('');
      setAmount('');
      setDate('');
      setMemo('');
    }
  }, [initialData]);

  // === 폼 제출 처리 함수 ===
  const handleSubmit = (e) => {
    e.preventDefault();
    // 입력된 데이터를 합쳐서 부모 컴포넌트의 onSubmit 함수 호출
    onSubmit({
      type,
      category,
      detail,
      amount,
      date,
      memo,
    });
  };

  return (
    <div className="transaction-form-backdrop">
      <div className="transaction-form-modal">
        <h2>내역 수정</h2>
        <form onSubmit={handleSubmit} className="transaction-form">
          {/* 라디오 버튼: 수입/지출 선택 */}
          <div className="form-group radio-group">
            <label>
              <input
                type="radio"
                name="type"
                value="expense"
                checked={type === 'expense'}
                onChange={() => setType('expense')}
              />
              지출
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="income"
                checked={type === 'income'}
                onChange={() => setType('income')}
              />
              수입
            </label>
          </div>

          {/* 내역(거래 상세) 입력 필드 */}
          <div className="form-group">
            <label>내역</label>
            <input
              type="text"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="예: 버스비, 월급 등"
              required
            />
          </div>

          {/* 카테고리 입력 필드 */}
          <div className="form-group">
            <label>카테고리</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="예: 교통/차량, 식비 등"
              required
            />
          </div>

          {/* 금액 입력 필드 */}
          <div className="form-group">
            <label>금액</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="예: 4000"
              required
            />
          </div>

          {/* 날짜 입력 필드 */}
          <div className="form-group">
            <label>날짜</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* 메모 입력 필드 */}
          <div className="form-group">
            <label>메모</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 버스비"
            />
          </div>

          {/* 제출 및 취소 버튼 */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              수정
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
