require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { handleInput } = require('./handlers/chatHandler');

const app = express();
const port = process.env.PORT || 3001;

app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

app.use(cors());
app.use(express.json());

// 채팅 API 엔드포인트
app.post('/api/chat', async (req, res) => {
  const { message, patientInfo } = req.body;
  try {
    // handleInput 은 이미 { kind, text } 또는 { kind, url } 형태
    const result = await handleInput(message, patientInfo);
    res.json(result);
  } catch (e) {
    console.error('Chat API error (in router):', e);
    // 오류도 동일한 포맷으로 내려줍니다
    res.status(500).json({ kind: 'text', text: e.message || '서버에서 오류가 발생했습니다.' });
  }
});


app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
}); 