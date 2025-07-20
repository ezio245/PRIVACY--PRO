// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Mock user database (in production, use a real database)
const users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// Routes for serving HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Authentication endpoints
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }
    
    // Find user in mock database
    const user = users.find(u => 
        u.username === username && u.password === password
    );
    
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
    
    res.json({
        success: true,
        message: 'Login successful',
        token: `jwt-token-${user.id}-${Date.now()}`,
        role: user.role,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

app.post('/api/register', (req, res) => {
    const { username, password, role } = req.body;
    
    // Validation
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }
    
    if (password.length < 4) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 4 characters long'
        });
    }
    
    // Check if username already exists
    const existingUser = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase()
    );
    
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: 'Username already exists. Please choose a different username.'
        });
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        username: username,
        password: password,
        role: role || 'user'
    };
    
    users.push(newUser);
    
    res.json({
        success: true,
        message: 'Registration successful',
        user: {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role
        }
    });
});

app.post('/api/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Privacy Dashboard API endpoints
app.post('/api/tokenize', (req, res) => {
    const { data, method } = req.body;
    
    if (!data) {
        return res.status(400).json({
            success: false,
            message: 'Data is required for tokenization'
        });
    }
    
    // Mock tokenization logic
    const tokenized = method === 'format-preserving' 
        ? data.replace(/./g, '*')
        : `TOKEN_${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    res.json({
        success: true,
        original: data,
        tokenized: tokenized,
        method: method || 'vault-based',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/consent', (req, res) => {
    const { consentData } = req.body;
    
    // Mock consent storage
    res.json({
        success: true,
        message: 'Consent preferences saved successfully',
        data: consentData,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/compliance', (req, res) => {
    res.json({
        success: true,
        scores: {
            gdpr: 98,
            ccpa: 95,
            hipaa: 92,
            pciDss: 94,
            sox: 89
        },
        overall: 93.6,
        lastUpdated: new Date().toISOString()
    });
});

app.post('/api/privacy-technique', (req, res) => {
    const { technique, action, config } = req.body;
    
    if (!technique || !action) {
        return res.status(400).json({
            success: false,
            message: 'Technique and action are required'
        });
    }
    
    res.json({
        success: true,
        technique: technique,
        action: action,
        enabled: action === 'enable',
        config: config || {},
        message: `${technique} ${action}d successfully`
    });
});

app.post('/api/smart-contract', (req, res) => {
    const { accessLevel, retentionPeriod, dataTypes } = req.body;
    
    const contractId = `CONTRACT_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;
    const contractAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
    
    res.json({
        success: true,
        contract: {
            id: contractId,
            address: contractAddress,
            accessLevel: accessLevel || 'restricted',
            retentionPeriod: retentionPeriod || 90,
            dataTypes: dataTypes || [],
            status: 'Active',
            deployedAt: new Date().toISOString()
        }
    });
});

app.get('/api/monitoring/metrics', (req, res) => {
    res.json({
        success: true,
        metrics: {
            systemLoad: Math.floor(Math.random() * 50) + 30,
            memoryUsage: Math.floor(Math.random() * 40) + 40,
            cpuUsage: Math.floor(Math.random() * 30) + 30,
            networkIO: (Math.random() * 2 + 0.5).toFixed(1),
            threats: Math.floor(Math.random() * 3),
            uptime: 99.9
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/api/audit-trail', (req, res) => {
    const events = [
        {
            id: 1,
            event: 'User login',
            user: 'admin',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'success'
        },
        {
            id: 2,
            event: 'Data tokenization',
            user: 'admin',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            status: 'success'
        },
        {
            id: 3,
            event: 'Privacy technique enabled',
            user: 'admin',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            status: 'success'
        }
    ];
    
    res.json({
        success: true,
        events: events,
        total: events.length
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Privacy Dashboard',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Privacy Dashboard Server running on port ${PORT}`);
    console.log(`🔒 Privacy Engine: ACTIVE`);
    console.log(`📊 Dashboard URL: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}`);
    console.log(`🔐 API Endpoints: /api/login, /api/register, /api/tokenize`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 Privacy Dashboard shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📴 Privacy Dashboard shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
