// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 회원가입 엔드포인트
app.post('/api/register', async (req, res) => {
    const {id, userName, password} = req.body;
    if (!id || !userName || !password) {
        return res.status(400).json({error: 'id, userName, password 모두 필요합니다.'});
    }

    try {
        // 1) 중복 ID 체크
        const [rows] = await db.query(
            'SELECT COUNT(*) AS cnt FROM login WHERE id = ?', [id]
        );
        if (rows[0].cnt > 0) {
            return res.status(409).json({error: '이미 사용 중인 ID입니다.'});
        }

        // 3) 레코드 삽입
        await db.query(
            'INSERT INTO login (id, userName, password) VALUES (?, ?, ?)',
            [id, userName, password]
        );

        res.status(201).json({message: '회원가입 성공'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: '서버 오류로 회원가입에 실패했습니다.'});
    }
});


// 로그인 엔드포인트
app.post('/api/login', async (req, res) => {
    const {id, password} = req.body;
    if (!id || !password) {
        return res.status(400).json({message: 'ID와 비밀번호를 모두 입력하세요.'});
    }

    try {
        // 1) 해당 ID 유저 조회
        const [rows] = await db.query(
            'SELECT userName, password FROM login WHERE id = ?',
            [id]
        );
        if (rows.length === 0) {
            return res.status(401).json({message: 'ID 또는 비밀번호가 올바르지 않습니다.'});
        }

        const user = rows[0];

        // 2) 비밀번호 비교 (평문 저장 시)
        if (user.password !== password) {
            return res.status(401).json({message: 'ID 또는 비밀번호가 올바르지 않습니다.'});
        }

        // 3) 성공 시 userName 리턴
        return res.status(200).json({userName: user.userName});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: '서버 오류가 발생했습니다.'});
    }
});


// ─────────────────────────────────────────────────────────────────
// (1) 감정별 지출 합계 조회 API
//   - 요청: GET /api/chart/emotion?id=<사용자ID>
//   - 반환 예시: [ { emotion: '기쁨', total: 16000 }, { emotion: '슬픔', total: 15000 }, … ]
// ─────────────────────────────────────────────────────────────────
app.get('/api/chart/emotion', async (req, res) => {
    try {
        const userId = req.query.id;
        if (!userId) {
            return res.status(400).json({message: 'id 파라미터가 필요합니다.'});
        }

        const [rows] = await db.query(
            `SELECT emotion, SUM(credit) AS total
             FROM ai_transactional
             WHERE id = ?
             GROUP BY emotion`,
            [userId]
        );
        return res.json(rows);
    } catch (err) {
        console.error('Error GET /api/chart/emotion:', err);
        return res.status(500).json({message: '서버 오류'});
    }
});

// ─────────────────────────────────────────────────────────────────
// (2) 카테고리별 지출 합계 조회 API
//   - 요청: GET /api/chart/category?id=<사용자ID>
//   - 반환 예시: [ { use_category: '식비', total: 16000 }, { use_category: '교통', total: 5000 }, … ]
// ─────────────────────────────────────────────────────────────────
app.get('/api/chart/category', async (req, res) => {
    try {
        const userId = localStorage.getItem('loggedInUserId') || req.query.id;
        if (!userId) {
            return res.status(400).json({message: 'id 파라미터가 필요합니다.'});
        }

        const [rows] = await db.query(
            `SELECT use_category, SUM(credit) AS total
             FROM ai_transactional
             WHERE id = ?
             GROUP BY use_category`,
            [userId]
        );
        return res.json(rows);
    } catch (err) {
        console.error('Error GET /api/chart/category:', err);
        return res.status(500).json({message: '서버 오류'});
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
