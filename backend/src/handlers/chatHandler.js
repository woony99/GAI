const { getStaticImageResponse } = require('../utils/staticImages');
const { handleChat }             = require('../openai');

async function handleInput(userMessage, patientInfo) {
  // 1) static 이미지 키워드 처리
  const staticResp = getStaticImageResponse(userMessage);
  if (staticResp) {
    return staticResp;  // 이미 { kind:'image', url } 형태
  }

  // 2) 일반 GPT 대화 처리
  // openai.js의 handleChat은 (userMessage, patientInfo) 시그니처를 가집니다.
  const replyText = await handleChat(userMessage, patientInfo);
  return { kind: 'text', text: replyText };
}

module.exports = { handleInput }; 