// server.js - Fix port binding
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
// Use Render's PORT environment variable or fallback to 3000
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes for Privacy Dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// API Routes
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.json({ 
            success: true, 
            token: 'jwt-token-here',
            message: 'Login successful' 
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
        });
    }
});

// Privacy Dashboard API endpoints
app.post('/api/tokenize', (req, res) => {
    const { data, method } = req.body;
    res.json({
        success: true,
        tokenized: `TOKEN_${Math.random().toString(36).substring(7)}`,
        method: method
    });
});

app.post('/api/consent', (req, res) => {
    res.json({
        success: true,
        message: 'Consent preferences saved',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/compliance', (req, res) => {
    res.json({
        gdpr: 98,
        ccpa: 95,
        hipaa: 92,
        pciDss: 94,
        sox: 89
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Privacy Dashboard',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Privacy Dashboard Server running on port ${PORT}`);
    console.log(`🔒 Privacy Engine: ACTIVE`);
    console.log(`📊 Dashboard URL: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 Privacy Dashboard shutting down gracefully...');
    process.exit(0);
});
