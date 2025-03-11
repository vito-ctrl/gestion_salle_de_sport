const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Use dynamic import for Node.js 18+
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware with CORS headers to fix Cross-Origin-Opener-Policy issues
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add headers to fix COOP issues
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'credentialless');
  next();
});

app.use(express.json());

// Auth routes
const authRouter = require('./routers/authRoute');
app.use('/api/auth', authRouter);

// Detailed Google OAuth endpoint with robust error handling
app.post('/api/auth/google', async (req, res) => {
  try {
    const { code } = req.body;
    
    // Debug logging
    console.log('Received auth code:', code ? 'Code present' : 'No code provided');
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }
    
    // Get credentials from environment variables
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:5174/dashboard';
    
    if (!client_id || !client_secret) {
      console.error('Missing Google OAuth credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    console.log('Exchanging code for tokens with parameters:', {
      client_id: client_id.substring(0, 10) + '...',
      redirect_uri,
      grant_type: 'authorization_code'
    });
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
    });
    
    // Log response status and details for debugging
    console.log('Google token response status:', tokenResponse.status);
    
    // Parse the response
    const responseText = await tokenResponse.text();
    console.log('Response text:', responseText);
    
    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse token response:', e);
      return res.status(500).json({ error: 'Invalid response from Google' });
    }
    
    // Check if the response contains an error
    if (!tokenResponse.ok) {
      console.error('Google token error:', tokenData);
      return res.status(400).json({ 
        error: 'Failed to exchange authorization code', 
        details: tokenData 
      });
    }
    
    // If successful, get user info
    if (tokenData.access_token) {
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      });
      
      const userInfo = await userInfoResponse.json();
      
      // Return tokens and user info to the client
      return res.json({
        ...tokenData,
        user: userInfo
      });
    } else {
      return res.status(400).json({ error: 'No access token received from Google' });
    }
  } catch (error) {
    console.error('Detailed OAuth error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salle-de-sport')
  .then(() => console.log('Connected to MongoDB!'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  
  res.status(statusCode).json({
    status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
  console.log(`OAuth redirect URI: ${process.env.REDIRECT_URI || 'http://localhost:5174/dashboard'}`);
});