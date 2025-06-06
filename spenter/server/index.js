// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');     // MySQL Pool

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI 설정
const { OpenAI } = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ==================================================================
// 회원가입 엔드포인트
// ==================================================================
app.post('/api/register', async (req, res) => {
    const { id, userName, password } = req.body;
    if (!id || !userName || !password) {
        return res.status(400).json({ error: 'id, userName, password 모두 필요합니다.' });
    }

    try {
        // 1) 중복 ID 체크
        const [rows] = await db.query(
            'SELECT COUNT(*) AS cnt FROM login WHERE id = ?', [id]
        );
        if (rows[0].cnt > 0) {
            return res.status(409).json({ error: '이미 사용 중인 ID입니다.' });
        }

        // 3) 레코드 삽입
        await db.query(
            'INSERT INTO login (id, userName, password) VALUES (?, ?, ?)',
            [id, userName, password]
        );

        res.status(201).json({ message: '회원가입 성공' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '서버 오류로 회원가입에 실패했습니다.' });
    }
});


// ==================================================================
// 로그인 엔드포인트
// ==================================================================
app.post('/api/login', async (req, res) => {
    const { id, password } = req.body;
    if (!id || !password) {
        return res.status(400).json({ message: 'ID와 비밀번호를 모두 입력하세요.' });
    }

    try {
        // 1) 해당 ID 유저 조회
        const [rows] = await db.query(
            'SELECT id, userName, password FROM login WHERE id = ?',
            [id]
        );
        if (rows.length === 0) {
            return res.status(401).json({ message: 'ID 또는 비밀번호가 올바르지 않습니다.' });
        }

        const user = rows[0];

        // 2) 비밀번호 비교 (평문 저장 시)
        if (user.password !== password) {
            return res.status(401).json({ message: 'ID 또는 비밀번호가 올바르지 않습니다.' });
        }

        // 3) 성공 시 id와 userName 리턴
        return res.status(200).json({
            id: user.id,
            userName: user.userName
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});




/* ==================================================================
 * AI 분석 후 ai_transactional 테이블에 INSERT
 *
 * 클라이언트에서는 { id: 'dkstjd3839', text: '오늘 스트레스를 너무 받아서 편의점에 8천원치의 음식을 사서 먹었어' }
 * 형태로 POST 요청을 보냅니다.
  ================================================================== */
app.post('/api/ai-transaction', async (req, res) => {
    const { id, text } = req.body;

    // 1) 파라미터 검증
    if (!id || !text) {
        return res.status(400).json({ error: 'id와 text(분석할 문장)가 필요합니다.' });
    }

    try {
        // 2)  해당 id가 login 테이블에 실제 존재하는지 확인(Optional)
        const [users] = await db.query('SELECT * FROM login WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ error: '존재하지 않는 사용자 ID입니다.' });
        }

        // 2) 오늘 날짜를 YYYY-MM-DD 형식으로 계산
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');  // 월은 0부터 시작하므로 +1
        const dd = String(today.getDate()).padStart(2, '0');
        const todayString = `${yyyy}-${mm}-${dd}`;


        // ────────────────────────────────────────────────────────
        // 3) OpenAI에게 감정/장소/카테고리/금액/날짜를 추출하도록 요청
        //    → “순수 JSON”만 반환하도록 프롬프트를 작성
        // ────────────────────────────────────────────────────────

        const systemPrompt = `
당신은 사용자의 입력 문장에서 다음 여섯 가지 항목을 추출하는 AI 어시스턴트입니다:
    1) id (userId)
    2) emotion (감정 태그)
        - 감정 태그는 반드시 아래 여섯 가지 중 하나만 사용해야 합니다:
        "기쁨", "슬픔", "스트레스", "충동", "중립", "화남"
        - 문장에 감정 표현이 전혀 없으면, 반드시 "중립"으로 설정하세요.
    3) use_place (사용 장소)
    4) use_category (사용 카테고리)
    5) credit (금액, 숫자만)
    6) credit_date (사용 날짜, 반드시 YYYY-MM-DD 형식)

▶ 현재 서버 기준 날짜는 ${todayString}입니다.
▶ 출력은 반드시 **순수 JSON 형태(Plain JSON)만**, 코드 블록(예: \`\`\`) 없이 반환해주세요.
▶ 다른 부가 설명이나 따옴표 없이 오직 JSON 객체 리터럴만 응답해주세요.
▶ 문장에 상대 날짜 정보(“5일 전”, “10일 후”, “1주 전”, “2달 후” 등)가 포함되어 있으면,
▶ 위에 알려준 “${todayString}”을 기준으로 계산해 credit_date에 YYYY-MM-DD 형식으로 넣어 주세요.
▶ 절대 날짜(예: 2025년 06월 01일)가 있으면, 그대로 YYYY-MM-DD로 넣어 주세요.
▶ 날짜 정보가 전혀 없으면, AI가 credit_date를 빈 문자열("") 또는 null로 반환해도 됩니다.

예시(반드시 이 형식을 그대로 지켜야 합니다):
{
    "id": "dkstjd3839",
    "emotion": "스트레스",
    "use_place": "편의점",
    "use_category": "식비",
    "credit": 8000,
    "credit_date": "2025-06-02"
}
    `.trim();

        const userPrompt = `
"${text}"
위 문장을 분석하여 JSON 형태로 반환하세요.
문장 안의 상대 날짜 정보(예: "5일 전", "1주 전", "2달 후" 등)는
서버(기준: ${todayString}) 날짜를 기준으로 계산해서 credit_date에 YYYY-MM-DD 형식으로 넣어 주세요.  
`.trim();

        //Chat API 호출 (gpt-3.5-turbo 기준, v4 스타일)
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0,   // 결정론적 결과를 위해 낮은 값 사용
            max_tokens: 200,
        });
        // 응답에서 첫 번째 메시지 내용: AI가 반환한 순수 JSON 문자열(코드 블록 없이)
        const aiRaw = response.choices[0].message.content.trim();

        // 하드코딩 
        // const aiRaw = JSON.stringify({
        //     emotion: '기쁨',
        //     use_place: '고깃집',
        //     use_category: '식비',
        //     credit: 50000,
        //     credit_date: '2025-06-02'
        // });


        // 4) AI가 준 JSON을 파싱 → 객체로 변환
        let parsed;
        try {
            parsed = JSON.parse(aiRaw);
        } catch (parseErr) {
            console.error('AI 응답 파싱 오류:', aiRaw);
            return res.status(500).json({ error: 'AI 응답을 파싱할 수 없습니다.', aiRaw });
        }

        // 5) AI 파싱 결과에서 반드시 필요한 항목이 있는지 검증
        const { emotion, use_place, use_category, credit, credit_date } = parsed;
        if (
            typeof emotion !== 'string'
            || typeof use_place !== 'string'
            || typeof use_category !== 'string'
            || (typeof credit !== 'number' && typeof credit !== 'string')
            || (typeof credit_date !== 'string')
        ) {
            return res.status(400).json({
                error: 'AI 응답에 필요한 키가 없거나 형식이 올바르지 않습니다.',
                aiRaw,
                parsed
            });
        }
        // 6) credit이 문자열로 넘어올 경우 숫자로 변환
        const creditNum = typeof credit === 'string' ? parseInt(credit.replace(/\D/g, ''), 10) : credit;




        // 7) credit_date 형식 검증 (YYYY-MM-DD)
        //    (간단히 정규식으로 검사)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (credit_date && !dateRegex.test(credit_date)) {
            return res.status(400).json({
                error: 'credit_date 형식이 YYYY-MM-DD 가 아닙니다.',
                credit_date
            });
        }

        // 8) AI가 credit_date를 빈 문자열을 줄 경우 todayString으로 대체
        const final_date = credit_date || todayString;

        // 9) INSERT 구문 실행
        const insertQuery = `
        INSERT INTO ai_transactional
        (id, emotion, use_place, use_category, credit, credit_date)
        VALUES (?, ?, ?, ?, ?, ?)`;

        await db.query(insertQuery, [
            id,
            emotion,
            use_place,
            use_category,
            creditNum,
            final_date
        ]);

        // 10) 성공 시 응답
        return res.status(200).json({
            message: 'AI 분석 결과가 성공적으로 저장되었습니다.',
            data: {
                id,
                emotion,
                use_place,
                use_category,
                credit: creditNum,
                credit_date: final_date
            }
        });


    } catch (err) {
        if (err.code === 'insufficient_quota' || err.status === 429) {
            console.error('🚧 OpenAI 할당량 초과:', err);
            return res.status(503).json({ error: 'AI 호출 할당량이 초과되었습니다. 나중에 다시 시도해주세요.' });
        }
        console.error('AI 호출 중 예기치 않은 오류:', err);
        return res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
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
        const userId = req.query.id;
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
