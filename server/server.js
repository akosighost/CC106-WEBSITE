const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
// Allow large incoming JSON strings (like Base64 pictures)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password123', 
  port: 5432,
});

// Global Diagnostic Logging to catch silent background crashes
pool.connect((err, client, release) => {
  if (err) {
    console.error('\n❌ DATABASE CONNECTION ERROR:', err.message);
  } else {
    console.log('✅ PostgreSQL Database connected successfully!');
    release();
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception thrown:', err.message);
});

// ==========================================
// 1. DIAGNOSTIC SIGN UP ENDPOINT
// ==========================================
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email address is already registered.' });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save the new user record
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email',
      [username, email, passwordHash]
    );

    res.status(201).json({
      message: 'Account created successfully!',
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error("🔴 Live DB Error Catch:", err.message);
    // CRITICAL: This passes the exact database block straight to your browser alert popup!
    res.status(500).json({ message: `Database Error: ${err.message}` });
  }
});

// ==========================================
// 2. LIVE LOGIN ENDPOINT
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password match.' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password match.' });
    }

    res.json({
      message: 'Login successful!',
      username: user.username,
      email: user.email,
      password: '●●●●●●●●', 
      token: 'session-jwt-token-production-abc123'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server login error.' });
  }
});

// ==========================================
// 3. FORGOT PASSWORD ENDPOINT
// ==========================================
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'No account found with that email address.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); 

    await pool.query('DELETE FROM password_resets WHERE email = $1', [email]);

    await pool.query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)',
      [email, token, expiresAt]
    );

    res.json({
      message: 'Reset token generated successfully!',
      resetLink: `http://localhost:5500/index.html?token=${token}`,
      token: token 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error handling forgot password request.' });
  }
});

// ==========================================
// 4. RESET PASSWORD ENDPOINT
// ==========================================
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const tokenQuery = await pool.query(
      'SELECT * FROM password_resets WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP',
      [token]
    );

    if (tokenQuery.rows.length === 0) {
      return res.status(400).json({ message: 'Token is invalid or has already expired.' });
    }

    const email = tokenQuery.rows[0].email;
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [newHash, email]);
    await pool.query('DELETE FROM password_resets WHERE email = $1', [email]);

    res.json({ message: 'Your password has been successfully updated!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing password reset routing.' });
  }
});

// ==========================================
// 5. SAVE NEW MOVIE REVIEW ENDPOINT
// ==========================================
app.post('/api/reviews/upload', async (req, res) => {
  const { email, movieName, publishDate, reviewText, imageData } = req.body;

  try {
    // Look up user_id linked to the current active session email
    const userQuery = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Active profile identity not found.' });
    }
    const userId = userQuery.rows[0].user_id;

    // Save the movie review into the user's secure collection pool
    await pool.query(
      'INSERT INTO reviews (user_id, movie_name, publish_date, review_text, image_data) VALUES ($1, $2, $3, $4, $5)',
      [userId, movieName, publishDate, reviewText, imageData]
    );

    res.status(201).json({ message: 'Review published to database successfully!' });

  } catch (err) {
    console.error("❌ Error saving movie review:", err.message);
    res.status(500).json({ message: 'Internal engine fault storing review record.' });
  }
});

// ==========================================
// 6. GET USER-SPECIFIC REVIEWS ENDPOINT
// ==========================================
app.get('/api/reviews/user', async (req, res) => {
  const { email } = req.query;

  try {
    const userQuery = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (userQuery.rows.length === 0) {
      return res.json([]); // Return empty list if no profile matches
    }
    const userId = userQuery.rows[0].user_id;

    // Fetch only the reviews that match this logged-in user ID
    const reviewsQuery = await pool.query(
      'SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json(reviewsQuery.rows);

  } catch (err) {
    console.error("❌ Error fetching user reviews:", err.message);
    res.status(500).json({ message: 'Internal engine fault reading review cards.' });
  }
});

// ==========================================
// 7. GET ALL PUBLIC REVIEWS (AUDIENCE REVIEWS)
// ==========================================
app.get('/api/reviews/all', async (req, res) => {
  try {
    // Fetch all reviews joined with usernames, ordered by newest first
    const reviewsQuery = await pool.query(
      'SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.user_id ORDER BY r.created_at DESC'
    );
    
    res.json(reviewsQuery.rows);

  } catch (err) {
    console.error("❌ Error fetching public reviews:", err.message);
    res.status(500).json({ message: 'Internal engine fault reading public reviews.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log("🚀 Diagnostic API engine initialized successfully!");
  console.log(`🌐 Port Active Terminal: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});