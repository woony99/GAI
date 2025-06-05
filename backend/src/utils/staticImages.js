const STATIC_IMAGES = {
  // 사용자 입력에 '흉부엑스레이' 가 포함되면 흉부 X-선검사.png 반환
  '흉부엑스레이': ['/images/흉부엑스레이.png'],
  // '흉부' 만 입력해도 동일한 이미지
  '흉부엑스레이 결과': ['/images/흉부엑스레이.png'],
  // 사용자 입력에 '부비동엑스레이' 가 포함되면 흉부 X-선검사.png 반환
  '부비동엑스레이': ['/images/부비동엑스레이.png'],
  // '부비동' 만 입력해도 동일한 이미지
  '부비동엑스레이 결과': ['/images/부비동엑스레이.png'],
  // 폐 기능 검사 요청 (두 이미지 모두 포함)
  '폐기능 검사': ['/images/폐기능검사.png', '/images/폐기능검사2.png'],
  '폐기능': ['/images/폐기능검사.png', '/images/폐기능검사2.png'],
  '폐음 청취': ['/images/폐음.mp3'],
  '홀로그램 보기': ['/images/홀로그램 보기.mp4']
};

function getStaticImageResponse(text) {
  // console.log('[STATIC_IMAGES_DEBUG] Checking text:', text); // 필요시 디버깅 로그 활성화
  for (const [keyword, urls] of Object.entries(STATIC_IMAGES)) { // value를 urls (배열)로 받음
    // console.log('[STATIC_IMAGES_DEBUG] Comparing with keyword:', keyword);
    if (text.includes(keyword)) {
      // 파일 확장자에 따라 kind 결정
      const firstUrl = urls[0];
      let kind = 'image'; // 기본값
      
      if (firstUrl.endsWith('.mp3') || firstUrl.endsWith('.wav') || firstUrl.endsWith('.ogg')) {
        kind = 'audio';
      } else if (firstUrl.endsWith('.mp4') || firstUrl.endsWith('.avi') || firstUrl.endsWith('.mov')) {
        kind = 'video';
      }
      
      // console.log('[STATIC_IMAGES_DEBUG] Keyword matched! Returning:', { kind, urls });
      return { kind, urls }; // 확장자에 따른 적절한 kind와 urls 배열을 반환
    }
  }
  // console.log('[STATIC_IMAGES_DEBUG] No keyword matched. Returning null.');
  return null;
}

module.exports = { getStaticImageResponse }; 