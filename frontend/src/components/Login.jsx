import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, useTheme } from '@mui/material';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import BiotechIcon from '@mui/icons-material/Biotech';

function Login() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuthAction = async () => {
    setError('');
    try {
      if (isRegistering) {
        if (!name.trim()) { setError("이름을 입력해주세요."); return; }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) { setError(getFirebaseErrorMessage(err.code)); }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); } 
    catch (err) { setError(getFirebaseErrorMessage(err.code)); }
  };
  
  const getFirebaseErrorMessage = (code) => {
    switch (code) {
      case "auth/invalid-email": return "유효하지 않은 이메일 주소입니다.";
      case "auth/user-disabled": return "사용 중지된 계정입니다.";
      case "auth/user-not-found": return "사용자를 찾을 수 없습니다. 먼저 회원가입을 진행해주세요.";
      case "auth/wrong-password": return "잘못된 비밀번호입니다.";
      case "auth/email-already-in-use": return "이미 사용 중인 이메일 주소입니다.";
      case "auth/weak-password": return "비밀번호는 6자 이상이어야 합니다.";
      case "auth/popup-closed-by-user": return "Google 로그인 팝업이 사용자에 의해 닫혔습니다. 다시 시도해주세요.";
      case "auth/cancelled-popup-request": return "Google 로그인 요청이 취소되었습니다.";
      case "auth/popup-blocked": return "Google 로그인 팝업이 브라우저에 의해 차단되었습니다.";
      default: return `로그인 또는 회원가입 중 오류가 발생했습니다. (${code})`;
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {[...Array(50)].map((_, i) => (
        <Box
          key={`star-small-${i}`}
          sx={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '1px',
            height: '1px',
            backgroundColor: 'white',
            borderRadius: '50%',
            animation: `twinkle ${Math.random() * 5 + 5}s linear infinite alternate`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      {[...Array(30)].map((_, i) => (
        <Box
          key={`star-medium-${i}`}
          sx={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '2px',
            height: '2px',
            backgroundColor: 'white',
            borderRadius: '50%',
            animation: `twinkle ${Math.random() * 6 + 6}s linear infinite alternate`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}
       <style>
        {`
          @keyframes twinkle {
            0% { opacity: 0.2; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1.2); }
          }
        `}
      </style>

      <Paper 
        elevation={12}
        sx={{
          padding: { xs: 3, sm: 4, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '420px',
          borderRadius: '16px',
          backgroundColor: 'rgba(10, 25, 41, 0.85)', 
          backdropFilter: 'blur(12px)',
          border: `1px solid ${theme.palette.primary.dark}`,
          color: '#fff',
          zIndex: 1, 
        }}
      >
        <BiotechIcon sx={{ fontSize: 50, color: theme.palette.primary.light, mb: 2 }} />
        <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
          GAI 학습 플랫폼
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, color: theme.palette.grey[400] }}>
          의학 교육의 새로운 표준을 경험하세요.
        </Typography>
        
        <Box component="form" onSubmit={(e) => e.preventDefault()} noValidate sx={{ width: '100%' }}>
          {isRegistering && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="이름 (닉네임)"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              InputLabelProps={{ sx: { color: theme.palette.grey[400] } }}
              InputProps={{ sx: { color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[600] }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.light } } }}
            />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="이메일 주소"
            name="email"
            autoComplete="email"
            autoFocus={!isRegistering}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            InputLabelProps={{ sx: { color: theme.palette.grey[400] } }}
            InputProps={{ sx: { color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[600] }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.light } } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete={isRegistering ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            InputLabelProps={{ sx: { color: theme.palette.grey[400] } }}
            InputProps={{ sx: { color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[600] }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.light } } }}
          />
          {error && (
            <Typography color="error.light" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 1, py: 1.5, fontSize: '1rem', fontWeight: 'bold', backgroundColor: theme.palette.primary.light, '&:hover': { backgroundColor: theme.palette.primary.main } }}
            onClick={handleAuthAction}
          >
            {isRegistering ? '계정 만들기' : '플랫폼 시작하기'}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 2, py: 1.2, color: theme.palette.grey[300], borderColor: theme.palette.grey[600], '&:hover': { borderColor: theme.palette.primary.light, backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}
            onClick={handleGoogleLogin}
          >
            Google 계정으로 계속하기
          </Button>
          <Button
            fullWidth
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            sx={{ textTransform: 'none', color: theme.palette.grey[500], '&:hover': { color: theme.palette.primary.light } }}
          >
            {isRegistering ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 지금 가입하기'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;