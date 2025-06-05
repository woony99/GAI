import OpenAI from 'openai';

// Vercel 환경 변수에서 API 키를 가져옵니다.
// Vercel 프로젝트 설정의 "Environment Variables" 탭에서 
// OPENAI_API_KEY 라는 이름으로 실제 키를 미리 저장해두어야 합니다.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Vercel 서버리스 함수는 POST, GET 등 모든 HTTP 메소드를 받을 수 있습니다.
  // 이 예시에서는 POST 요청만 처리하도록 합니다.
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // 프론트엔드에서 POST 요청 시 body에 'prompt'라는 이름으로 메시지를 보냈다고 가정합니다.
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
      return res.status(400).json({ message: 'Error: Prompt is required in the request body.' });
    }

    // OpenAI API 호출 (Chat Completions API 사용 예시)
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' }, // 시스템 메시지는 역할에 맞게 수정
        { role: 'user', content: userPrompt },
      ],
      model: 'gpt-3.5-turbo', // 사용하려는 모델 지정
      // 필요하다면 다른 옵션들(temperature, max_tokens 등)을 추가할 수 있습니다.
    });

    const assistantResponse = completion.choices[0].message.content;

    // 프론트엔드에 성공적으로 응답을 보냅니다.
    res.status(200).json({ response: assistantResponse });

  } catch (error) {
    // 오류 발생 시 콘솔에 로그를 남기고, 프론트엔드에는 일반적인 오류 메시지를 보냅니다.
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error processing your request with OpenAI' });
  }
} 