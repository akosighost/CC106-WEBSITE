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
    // ALWAYS match using LOWER() to prevent duplicate case entries
    const emailCheck = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email address is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Force store as clean lowercase
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, LOWER($2), $3) RETURNING user_id, username, email',
      [username, email, passwordHash]
    );

    res.status(201).json({
      message: 'Account created successfully!',
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error("🔴 Live DB Error Catch:", err.message);
    res.status(500).json({ message: `Database Error: ${err.message}` });
  }
});

// ==========================================
// 2. LIVE LOGIN ENDPOINT
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
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
      email: user.email.toLowerCase(), 
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
    // FIX: Uses LOWER() to ensure case-insensitive email matching across accounts
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Active profile identity not found.' });
    }
    const userId = userQuery.rows[0].user_id;

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
// 6. GET USER-SPECIFIC REVIEWS ENDPOINT (WITH DYNAMIC RATING AGGREGATION)
// ==========================================
app.get('/api/reviews/user', async (req, res) => {
  const { email } = req.query;

  try {
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) {
      return res.json([]); 
    }
    const userId = userQuery.rows[0].user_id;

    // Advanced Query: Left joins comment table records to compute live movie row metrics
    const reviewsQuery = await pool.query(
      `SELECT r.*, 
              COALESCE(ROUND(AVG(c.rating), 1), 0) as avg_rating,
              COUNT(c.rating) as rating_count
       FROM reviews r
       LEFT JOIN movie_comments c ON r.review_id = c.review_id
       WHERE r.user_id = $1
       GROUP BY r.review_id
       ORDER BY r.review_id DESC`,
      [userId]
    );
    
    res.json(reviewsQuery.rows);

  } catch (err) {
    console.error("❌ Error fetching user reviews:", err.message);
    res.status(500).json({ message: 'Internal engine fault reading review cards.' });
  }
});

// ==========================================
// 7. GET ALL PUBLIC REVIEWS (AUDIENCE REVIEWS WITH DYNAMIC RATING AGGREGATION)
// ==========================================
app.get('/api/reviews/all', async (req, res) => {
  try {
    // Advanced Query: Joins users and left-joins comments to calculate live scores across the system
    const reviewsQuery = await pool.query(
      `SELECT r.*, u.username,
              COALESCE(ROUND(AVG(c.rating), 1), 0) as avg_rating,
              COUNT(c.rating) as rating_count
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       LEFT JOIN movie_comments c ON r.review_id = c.review_id
       GROUP BY r.review_id, u.username
       ORDER BY r.review_id DESC`
    );
    
    res.json(reviewsQuery.rows);

  } catch (err) {
    console.error("❌ Error fetching public reviews:", err.message);
    res.status(500).json({ message: 'Internal engine fault reading public reviews.' });
  }
});

// ==========================================
// 8. GET SPECIFIC MOVIE DETAILS WITH USER-LIKE TRACKING & OWNER FLAGS
// ==========================================
app.get('/api/reviews/details/:id', async (req, res) => {
  const reviewId = req.params.id;
  const { email } = req.query; 

  try {
    // Automatically increment view counter metric (+1)
    await pool.query('UPDATE reviews SET view_count = view_count + 1 WHERE review_id = $1', [reviewId]);

    const reviewQuery = await pool.query(
      'SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.user_id WHERE r.review_id = $1',
      [reviewId]
    );

    if (reviewQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Review record not found.' });
    }

    // Verify if current browser session visitor owns this review
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email || '']);
    const currentUserId = userQuery.rows.length > 0 ? userQuery.rows[0].user_id : null;
    const isOwner = currentUserId && (reviewQuery.rows[0].user_id === currentUserId);

    // Fetch comments and check if the active user liked them
    const commentsQuery = await pool.query(
      `SELECT c.*, u.username,
       EXISTS (
         SELECT 1 FROM comment_likes cl
         JOIN users lu ON cl.user_id = lu.user_id
         WHERE cl.comment_id = c.comment_id AND LOWER(lu.email) = LOWER($2)
       ) as user_has_liked
       FROM movie_comments c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.review_id = $1
       ORDER BY c.comment_id ASC`,
      [reviewId, email || '']
    );

    res.json({
      review: { ...reviewQuery.rows[0], is_owner: isOwner },
      comments: commentsQuery.rows
    });

  } catch (err) {
    console.error("❌ Error fetching review detail packet:", err.message);
    res.status(500).json({ message: 'Internal server error resolving review payload packet.' });
  }
});

// ==========================================
// 9. POST NEW COMMUNITY FEED COMMENT
// ==========================================
app.post('/api/reviews/details/:id/comments', async (req, res) => {
  const reviewId = req.params.id;
  const { email, commentText, rating } = req.body;

  try {
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: 'Session unauthorized.' });
    }
    const userId = userQuery.rows[0].user_id;

    const newComment = await pool.query(
      'INSERT INTO movie_comments (review_id, user_id, comment_text, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [reviewId, userId, commentText, rating]
    );

    res.status(201).json({ message: 'Comment appended successfully!', comment: newComment.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing comment form submission.' });
  }
});

// ==========================================
// 10. SMART HEART TOGGLE (LIKE / UNLIKE) ENDPOINT
// ==========================================
app.post('/api/comments/like/:id', async (req, res) => {
  const commentId = req.params.id;
  const { email } = req.body;

  if (!email) {
    return res.status(401).json({ message: 'You must be signed in to like comments.' });
  }

  try {
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    const userId = userQuery.rows[0].user_id;

    const likeCheck = await pool.query('SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2', [commentId, userId]);
    let isLikedNow = false;

    if (likeCheck.rows.length > 0) {
      await pool.query('DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2', [commentId, userId]);
      await pool.query('UPDATE movie_comments SET likes_count = GREATEST(0, likes_count - 1) WHERE comment_id = $1', [commentId]);
      isLikedNow = false;
    } else {
      await pool.query('INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)', [commentId, userId]);
      await pool.query('UPDATE movie_comments SET likes_count = likes_count + 1 WHERE comment_id = $1', [commentId]);
      isLikedNow = true;
    }

    const countQuery = await pool.query('SELECT likes_count FROM movie_comments WHERE comment_id = $1', [commentId]);
    res.json({ success: true, newCount: countQuery.rows[0].likes_count, liked: isLikedNow });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing heart interaction.' });
  }
});

// ==========================================
// 11. SECURED SYSTEM REVIEW TERMINATION (DELETE REVIEW ROUTE)
// ==========================================
app.delete('/api/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const { email } = req.body;

  try {
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) return res.status(401).json({ message: 'Session unauthorized.' });
    const userId = userQuery.rows[0].user_id;

    const reviewCheck = await pool.query('SELECT user_id FROM reviews WHERE review_id = $1', [reviewId]);
    if (reviewCheck.rows.length === 0) return res.status(404).json({ message: 'Review not found.' });

    if (reviewCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized action rejected.' });
    }

    await pool.query('DELETE FROM reviews WHERE review_id = $1', [reviewId]);
    res.json({ message: 'Movie review deleted successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal database error.' });
  }
});

// ==========================================
// 12. SECURED COMMENT DELETION (DELETE COMMENT ROUTE)
// ==========================================
app.delete('/api/comments/:id', async (req, res) => {
  const commentId = req.params.id;
  const { email } = req.body;

  if (!email) {
    return res.status(401).json({ message: 'Session unauthorized.' });
  }

  try {
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    const userId = userQuery.rows[0].user_id;

    const commentCheck = await pool.query('SELECT user_id FROM movie_comments WHERE comment_id = $1', [commentId]);
    if (commentCheck.rows.length === 0) return res.status(404).json({ message: 'Comment not found.' });

    if (commentCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own comments.' });
    }

    await pool.query('DELETE FROM movie_comments WHERE comment_id = $1', [commentId]);
    res.json({ message: 'Comment removed successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal database error.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log("🚀 Diagnostic API engine initialized successfully!");
  console.log(`🌐 Port Active Terminal: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});