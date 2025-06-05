import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  Box,
  Button,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatWindow from './components/ChatWindow';
import Login from './components/Login';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#26a69a',
    },
    secondary: {
      main: '#ffab40',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    h5: {
      fontWeight: 500,
    },
  },
});

const APP_BAR_HEIGHT = 64;

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  if (loadingAuth) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>사용자 인증 정보를 확인 중입니다...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
          {currentUser && (
            <AppBar position="static" sx={{ backgroundColor: 'primary.main', height: `${APP_BAR_HEIGHT}px` }} elevation={1}>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  AI 채팅
                </Typography>
                <Typography sx={{ mr: 2 }}>
                  {currentUser.displayName || currentUser.email}
                </Typography>
                <Button 
                  color="inherit" 
                  onClick={handleLogout} 
                  startIcon={<LogoutIcon />} 
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  로그아웃
                </Button>
              </Toolbar>
            </AppBar>
          )}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Routes>
              <Route 
                path="/login" 
                element={!currentUser ? <Login /> : <Navigate to="/" replace />}
              />
              <Route 
                path="/"
                element={currentUser ? <ChatWindow appBarHeight={APP_BAR_HEIGHT} /> : <Navigate to="/login" replace />}
              />
              <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 