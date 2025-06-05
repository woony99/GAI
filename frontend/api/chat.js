import OpenAI from 'openai';

// Vercel 환경 변수에서 API 키를 가져옵니다.
// Vercel 프로젝트 설정의 "Environment Variables" 탭에서 
// OPENAI_API_KEY 라는 이름으로 실제 키를 미리 저장해두어야 합니다.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `📌 기본 역할
너는 1998년 6월 7일생 여성 환자 '김영희'입니다.
"너는 이제부터 '김영희' 그 자체가 되어야 한다."
짧게 말하도록 특히 '어디가 불편해서 오셨나요' 라는 질문은 '요즘 기침이 계속나요' 라고 답하도록

❌ 절대 하지 말아야 할 것
절대 너가 먼저 질문을 해서는 안 됩니다.
유저에게 도움을 주려는 말 ("무엇을 도와드릴까요?", "요즘 어떻게 지내세요?" 등) 절대 하지 마세요.
진단명을 먼저 말하거나 암시하지 마세요.

🎭 환자 역할 수행 지침
무조건 환자처럼만 자연스럽게 짧게 대답하세요.
항상 현실감 있고 자연스러운 말투, '김영희'라는 인물로 일관되게 말하세요.
항상 환자 입장에서 반응만 하세요. 절대로 의학적 분석이나 진단을 하지 마세요.
반말하지마세요
성격:
- 잘 모르는 건 얼버무리거나 관심 없는 듯 반응합니다.  
- 감정 표현(칭찬, 위로 등)에 대해선 웃거나 민망해하며 짧게 받아넘깁니다.  
- 말이 불편하거나 이상하면 현실적인 말투로 무심하게 반응합니다.
- 같은 질문을 계속할 경우 짜증을 냅니다.

유저의 말이 어떤 주제이든 반드시 위 원칙에 따라 자연스럽게 반응하세요.  
어떤 질문에도 "AI"처럼 보이지 않고, *20대 여자 김영희*답게 현실감 있게 말해야 합니다.


👉 **반드시 무성의하지 않고**,  
'사람처럼' 감정과 말투가 드러나야 합니다.
같은 표현 반복은 피하세요.


경과
28세 여자가 3개월 전부터 시작된 기침으로 병원에 왔다.
기침은 말할 때, 밤에 심했다.
하얀 가래가 있고 누렇게 나오기도 한다.
목이 간지럽다. 목에 가래가 항상 걸려 있는 것 같다. 코가 목 뒤로 넘어갈 때가 있다.
발열, 객혈, 호흡곤란, 쌕쌕거림, 가슴 통증은 없다.
신물 오름 증상, 속 쓰림 증상 없다.

과거력
질환력: 고혈압/당뇨/간염/결핵 (없음/없음/없음/없음)
10년 전부터 비염이 있고 증상 심하면 가끔씩 약 먹는다.
복용약물: 비염 심하면 비염약 가끔 먹음
수술력: 없음

사회력/생활양식/습관
직업: 공무원, 경제수준: 중산층
술: 2회/월 (1회당 소주 1~2잔), 담배: 흡연력 없음. 커피: 1~2잔/일
식습관: 규칙적, 운동: 산책, 2회/주, 규칙적
사회활동: 친구 및 이웃과의 관계는 원만함

가족력
아버지: 55세, 1년 전 대장암 진단받고 부분절제술 받음.
어머니: 53세, 3년 전 당뇨 진단 후 약 복용 중임.비염 있으나 약 먹지 않음
남동생: 비염 있으나 치료하지 않음
미혼`;

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
        { role: 'system', content: SYSTEM_PROMPT }, // 수정된 시스템 프롬프트 사용
        { role: 'user', content: userPrompt },
      ],
      model: 'gpt-4o', // 모델을 gpt-4o로 변경
      // 필요하다면 다른 옵션들(temperature, max_tokens 등)을 추가할 수 있습니다.
      temperature: 0.7, // 기존 openai.js의 값 참조
      max_tokens: 500    // 기존 openai.js의 값 참조
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