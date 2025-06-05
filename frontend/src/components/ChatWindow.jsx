import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Avatar,
  IconButton,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { sendMessage } from '../api';
import { auth, database } from '../firebase';
import {
  ref,
  push,
  set,
  onValue,
  serverTimestamp,
  query,
  orderByChild,
} from 'firebase/database';

function ChatWindow({ appBarHeight }) {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const messagesRef = ref(database, 'messages');

  useEffect(() => {
    const queryMessages = query(messagesRef, orderByChild('timestamp'));
    const unsubscribe = onValue(queryMessages, (snapshot) => {
      const loadedMessages = [];
      snapshot.forEach((childSnapshot) => {
        loadedMessages.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setMessages(loadedMessages);
    });
    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const user = auth.currentUser;
    if (!user) return;

    const newMessageObj = {
      role: 'user',
      content: input,
      kind: 'text',
      timestamp: serverTimestamp(),
      userId: user.uid,
      userPhotoURL: user.photoURL,
    };
    const currentInput = input;
    setInput('');
    try {
      const userMessageRef = push(messagesRef);
      await set(userMessageRef, newMessageObj);
      const backendResponse = await sendMessage(currentInput, {});
      let botMessageObj = {
        role: 'assistant',
        timestamp: serverTimestamp(),
        userId: 'assistant',
      };
      if (backendResponse && typeof backendResponse.kind !== 'undefined') {
        if (backendResponse.kind === 'image' || backendResponse.kind === 'audio' || backendResponse.kind === 'video') {
          botMessageObj.kind = backendResponse.kind;
          botMessageObj.urls = backendResponse.urls;
        } else {
          botMessageObj.kind = 'text';
          botMessageObj.content = backendResponse.text;
        }
      } else {
        botMessageObj.kind = 'text';
        botMessageObj.content = '죄송합니다. 응답을 이해하지 못했습니다.';
      }
      const botMessageRef = push(messagesRef);
      await set(botMessageRef, botMessageObj);
    } catch (error) {
      console.error('메시지 처리 중 오류 발생:', error);
      const errorBotMessageObj = {
        role: 'assistant',
        kind: 'text',
        content: '죄송합니다. 메시지 처리에 오류가 발생했습니다.',
        timestamp: serverTimestamp(),
        userId: 'assistant'
      };
      const errorBotMessageRef = push(messagesRef);
      await set(errorBotMessageRef, errorBotMessageObj);
    }
  };

  const handleNewChat = async () => {
    if (window.confirm("모든 대화 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      try {
        await set(ref(database, 'messages'), null);
        setMessages([]);
      } catch (error) {
        console.error("Firebase 대화 기록 삭제 중 오류:", error);
        alert("대화 기록 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <Box sx={{ 
      height: `calc(100vh - ${appBarHeight || 0}px)`,
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      pt: 1,
    }}>
      <Paper 
        elevation={3}
        sx={{ 
          width: '100%',
          maxWidth: '1000px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '12px',
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ 
          flex: 1, 
          p: { xs: 1.5, sm: 2, md: 3 },
          overflowY: 'auto',
          bgcolor: theme.palette.grey[50],
        }}> 
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                mb: 1.5,
                alignItems: 'flex-end',
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: msg.role === 'user' ? theme.palette.primary.main : theme.palette.secondary.main,
                  width: 32, height: 32, 
                  ml: msg.role === 'user' ? 1 : 0,
                  mr: msg.role === 'user' ? 0 : 1,
                }}
                src={msg.role === 'user' ? msg.userPhotoURL : undefined}
              >
                {msg.role === 'user' ? 
                  (auth.currentUser?.displayName ? auth.currentUser.displayName[0].toUpperCase() : <PersonIcon fontSize="small" />) :
                  <SmartToyIcon fontSize="small" />
                }
              </Avatar>
              <Paper
                elevation={1}
                sx={{
                  p: '10px 14px',
                  maxWidth: '70%',
                  bgcolor: msg.role === 'user' ? theme.palette.primary.light : theme.palette.background.paper,
                  color: msg.role === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary,
                  borderRadius: msg.role === 'user' 
                    ? '16px 16px 4px 16px' 
                    : '4px 16px 16px 16px',
                  wordBreak: 'break-word',
                  boxShadow: theme.shadows[1],
                }}
              >
                {msg.kind === 'image' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.urls && msg.urls.map((src, i) => (
                      <img 
                        key={i} 
                        src={src} 
                        alt={`assistant-img-${i}`}
                        style={{ maxWidth: '100%', borderRadius: '12px', display: 'block' }} 
                      />
                    ))}
                  </Box>
                ) : msg.kind === 'audio' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.urls && msg.urls.map((src, i) => (
                      <audio 
                        key={i} 
                        controls
                        style={{ maxWidth: '100%', borderRadius: '12px' }}
                      >
                        <source src={src} type="audio/mpeg" />
                        <source src={src} type="audio/wav" />
                        <source src={src} type="audio/ogg" />
                        오디오를 재생할 수 없습니다.
                      </audio>
                    ))}
                  </Box>
                ) : msg.kind === 'video' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.urls && msg.urls.map((src, i) => (
                      <video 
                        key={i} 
                        controls
                        style={{ maxWidth: '100%', borderRadius: '12px', maxHeight: '300px' }}
                      >
                        <source src={src} type="video/mp4" />
                        <source src={src} type="video/avi" />
                        <source src={src} type="video/mov" />
                        비디오를 재생할 수 없습니다.
                      </video>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                )}
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        
        <Box sx={{ p: 1.5, bgcolor: theme.palette.background.paper, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            fullWidth 
            variant="text" 
            color="secondary"
            onClick={handleNewChat} 
            size="small"
            startIcon={<DeleteForeverIcon />}
            sx={{ mb: 1, textTransform: 'none', fontWeight: 'normal' }}
          >
            모든 대화 기록 삭제
          </Button>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="filled"
              hiddenLabel
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="메시지를 입력하세요..."
              sx={{ 
                bgcolor: theme.palette.grey[100],
                borderRadius: '20px',
                '& .MuiFilledInput-root': {
                  borderRadius: '20px',
                  backgroundColor: theme.palette.grey[100],
                  '&:before, &:after': {
                    display: 'none',
                  },
                },
                '& .MuiFilledInput-input': {
                  padding: '12px 16px',
                }
              }}
              size="small"
              disabled={!auth.currentUser}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || !auth.currentUser}
              sx={{ 
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
                width: '48px', height: '48px'
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ChatWindow; 