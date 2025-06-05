import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const sendMessage = async (message, patientInfo) => {
  console.log('sendMessage_HB_DEBUG: 함수 시작, message:', message, 'patientInfo:', patientInfo);
  try {
    const response = await axios.post(`${API_BASE_URL}/api/chat`, {
      message,
      patientInfo
    });
    console.log('sendMessage_HB_DEBUG: axios 응답 받음, response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('sendMessage_HB_DEBUG: API 통신 오류:', error);
    // 오류 발생 시 여기서 undefined나 다른 예외가 throw 될 수 있음
    throw new Error('메시지 전송에 실패했습니다.');
  }
}; 