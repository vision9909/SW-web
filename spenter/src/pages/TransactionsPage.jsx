
// src/components/TransactionsPage.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TransactionForm from '../components/TransactionForm'; // 입력 폼 가져오기
import './TransactionsStyle.css';

const TransactionsPage = ({ transactions, setTransactions }) => {
  // === 1. 거래 목록을 관리하는 State ===
  // const [transactions, setTransactions] = useState([
  //   // 예시 초기 데이터 (필요 시 API에서 fetch로 대체 가능)
  //   {
  //     id: 1,
  //     date: '2022-01-30',
  //     category: '교통/차량',
  //     detail: '버스비',
  //     amount: 12000,
  //     type: 'income', // 'income' = 수입, 'expense' = 지출
  //   },
  //   {
  //     id: 2,
  //     date: '2022-01-30',
  //     category: '식비',
  //     detail: '외식비',
  //     amount: 4000,
  //     type: 'expense',
  //   },
  // ]);

  // === 2. 모달 폼 표시 및 편집 중인 데이터 관리를 위한 State ===
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState(null);
  
  // === 3. "+" 버튼 클릭 시 새 거래를 추가하기 위한 함수 ===
  const handleAddClick = () => {
    setEditingData(null);
    setShowForm(true);
  };

  // === 4. "✎" 버튼 클릭 시 거래를 수정하기 위한 함수 ===
  const handleEditClick = (tx) => {
    // 현재 tx 데이터를 폼으로 전달하여 사용자가 수정할 수 있도록 함
    setEditingData({
      id: tx.id,
      type: tx.type,
      category: tx.category,
      detail: tx.detail,
      amount: tx.amount,
      date: tx.date,
      memo: tx.detail, // memo를 detail과 동일하게 유지하려면
    });
    setShowForm(true);
  };

  // === 5. TransactionForm에서 제출된 폼 데이터를 처리하는 함수 ===
  const handleFormSubmit = (formData) => {
    if (editingData) {
      // 편집 중: editingData.id와 일치하는 거래를 업데이트
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === editingData.id
            ? {
                ...tx,
                type: formData.type,
                category: formData.category,
                detail: formData.detail,
                amount: Number(formData.amount),
                date: formData.date,
              }
            : tx
        )
      );
    } else {
      // 새로 추가: id를 Date.now() (또는 UUID)로 생성하여 객체를 만듦
      const newTx = {
        id: Date.now(),
        date: formData.date,
        category: formData.category,
        detail: formData.detail,
        amount: Number(formData.amount),
        type: formData.type,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    // 저장 후 폼 닫기
    setShowForm(false);
    setEditingData(null);
  };

  // === 6. "취소" 버튼 클릭 시 폼을 취소하는 함수 ===
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingData(null);
  };

  // === 7. 상단 행에 표시할 총 잔액, 수입, 지출 계산 ===
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;



  
  return (
    <div style={{ display: 'flex', minheight: '100vh' }}> {/* 사이드바가 전체 높이를 차지하도록 설정 */}
      {/* --- 왼쪽 열: Sidebar --- */}
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* --- 오른쪽 열: 메인 콘텐츠 --- */}
      <div className="Transactions-container">
        {/* --- Top row: 잔액 / 수입 / 지출 --- */}
        <div className="summary-row">
          <div className="summary-box balance-box">
            <h3>잔액</h3>
            <p>{balance.toLocaleString()}원</p>
          </div>
          <div className="summary-box income-box">
            <h3>수입</h3>
            <p>{totalIncome.toLocaleString()}원</p>
          </div>
          <div className="summary-box expense-box">
            <h3>지출</h3>
            <p>{totalExpense.toLocaleString()}원</p>
          </div>
        </div>

        {/* --- 거래내역 컨테이너: 거래 리스트 --- */}
        <div className="Transactions-list-container">
          <div className="Transactions-list-header">
            <h2>입출금 내역</h2>
            {/* "+" 버튼으로 새 항목 추가 폼 열기 */}
            <button className="add-Transactions-button" onClick={handleAddClick}>
              ＋
            </button>
          </div>
          <div className="Transactions-list-box">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`Transactions-box-row ${
                    tx.type === 'income' ? 'income-row' : 'expense-row'
                  }`}
                >
                  <span>{tx.date}</span>
                  <span>{tx.category}</span> 
                  <span>{tx.detail}</span>

                  <span className="Tr-amount">
                    {tx.type === 'income'
                      ? '+' + tx.amount.toLocaleString() + '원'
                      : '−' + tx.amount.toLocaleString() + '원'}
                  </span>
                  <div className="Tr-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(tx)}
                    >
                      ✎
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        setTransactions((prev) =>
                          prev.filter((item) => item.id !== tx.id)
                        )
                      }
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '20px 0' }}>
                거래 내역이 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* --- 월별 AI 피드백 요약 (예시 하드코딩) --- */}
        <div className="monthly-feedback-container">
          <h2>월별 AI 피드백 요약</h2>
          <ul className="feedback-summary-list">
            <li>
              <strong>2023-01</strong> : 지출이 많았어요. 식비를 줄여보세요.
            </li>
            <li>
              <strong>2023-02</strong> : 교통비가 늘었네요. 대중교통 이용을 고려하세요.
            </li>
            <li>
              <strong>2023-03</strong> : “스트레스” 지출이 많습니다. 휴식비를 늘려 보세요.
            </li>
            {/* ... 다른 달 데이터가 있을 경우 추가 ... */}
          </ul>
        </div>

        {/* --- 이번 달 피드백 상세 (예시 하드코딩) --- */}
        <div className="detail-feedback-container">
          <h2>이번 달 피드백 상세</h2>
          <div className="feedback-detail-box">
            <p>AI 분석 결과에 따른 상세 피드백이 여기에 표시됩니다.</p>
          </div>
        </div>
      </div>

      {/* === showForm이 true일 때 modal TransactionForm 표시 === */}
      {showForm && (
        <TransactionForm
          initialData={editingData}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default TransactionsPage;

