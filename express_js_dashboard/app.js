const express = require('express');
const path = require('path');
const app = express();

// 1) 뷰 엔진으로 EJS 설정, static 미들웨어로 public 폴더 오픈
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


// 2) 루트 라우트
app.get('/', (req, res) => {
    // 예시 데이터 — 실제로는 DB나 API에서 가져오시면 됩니다.
    const salesData = [300, 400, 350];
    const userData  = [ 50,  70,  65];
    res.render('dashboard', { salesData, userData });
});

// 404 처리
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

app.listen(3000, () => {
    console.log('Express REST API 서버가 http://localhost:3000 에서 실행 중입니다.');
});
