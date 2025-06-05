// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Firebase Authentication 모듈 추가
import { getDatabase } from "firebase/database"; // Firebase Realtime Database 모듈 추가
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHzYNhHFM2ZZUPjxLhx1YMrkQHw7S410k",
  authDomain: "gai-project-d98da.firebaseapp.com",
  projectId: "gai-project-d98da",
  storageBucket: "gai-project-d98da.appspot.com", // .firebasestorage.app에서 .appspot.com으로 변경하는 것이 일반적입니다. 확인 필요.
  messagingSenderId: "720492579732",
  appId: "1:720492579732:web:a40887a8f136162ca4dd81",
  measurementId: "G-HLBJJVMKMT",
  databaseURL: "https://gai-project-d98da-default-rtdb.asia-southeast1.firebasedatabase.app/" // Realtime Database URL 추가
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Firebase Authentication 인스턴스 초기화
const database = getDatabase(app); // Firebase Realtime Database 인스턴스 초기화

// Firebase 앱, Analytics, Auth 및 Database 인스턴스를 내보내 다른 곳에서 사용할 수 있도록 합니다.
export { app, analytics, auth, database }; 