const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
// 1. Enable CORS so Vercel can talk to it
app.use(cors({
    origin: ['https://cc-106-website.vercel.app', 'http://localhost:5500']
}));

app.use(express.json());

// 2. Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
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
      password: user.password, 
      token: 'session-jwt-token-production-abc123',
      is_admin: user.is_admin // FIX: Pass the admin boolean flag to localStorage
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
// 5. SAVE NEW MOVIE REVIEW ENDPOINT (WITH FEATURED & GENRE TRACKING)
// ==========================================
app.post('/api/reviews/upload', async (req, res) => {
  const { email, movieName, publishDate, reviewText, imageData, isFeatured, genres } = req.body;

  try {
    const userQuery = await pool.query('SELECT user_id, is_admin FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Active profile identity not found.' });
    }
    const userId = userQuery.rows[0].user_id;
    const isAdmin = userQuery.rows[0].is_admin;

    const finalFeaturedState = (isFeatured && isAdmin) ? true : false;

    // FIX: Included genres TEXT[] column array tracking parameters
    await pool.query(
      'INSERT INTO reviews (user_id, movie_name, publish_date, review_text, image_data, is_featured, genres) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, movieName, publishDate, reviewText, imageData, finalFeaturedState, genres || []]
    );

    res.status(201).json({ message: 'Review published to database successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal engine fault storing review record.' });
  }
});

// ==========================================
// 6. GET USER-SPECIFIC REVIEWS ENDPOINT (WITH SEPARATED RATINGS)
// ==========================================
app.get('/api/reviews/user', async (req, res) => {
  const { email } = req.query;
  try {
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) return res.json([]); 
    const userId = userQuery.rows[0].user_id;

    const reviewsQuery = await pool.query(
      `SELECT r.*, 
              COALESCE(ROUND(AVG(rt.rating), 1), 0) as avg_rating,
              COUNT(rt.rating)::INT as rating_count
       FROM reviews r
       LEFT JOIN movie_ratings rt ON r.review_id = rt.review_id
       WHERE r.user_id = $1
       GROUP BY r.review_id
       ORDER BY r.review_id DESC`,
      [userId]
    );
    res.json(reviewsQuery.rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// 7. GET ALL PUBLIC REVIEWS (AUDIENCE REVIEWS EXCLUDING PREMIUM FEATURED)
// ==========================================
app.get('/api/reviews/all', async (req, res) => {
  try {
    const reviewsQuery = await pool.query(
      `SELECT r.*, u.username,
              COALESCE(ROUND(AVG(rt.rating), 1), 0) as avg_rating,
              COUNT(rt.rating)::INT as rating_count
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       LEFT JOIN movie_ratings rt ON r.review_id = rt.review_id
       WHERE r.is_featured = FALSE -- FIX: Excludes admin highlights from this grid view!
       GROUP BY r.review_id, u.username
       ORDER BY r.review_id DESC`
    );
    res.json(reviewsQuery.rows);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// ==========================================
// 7B. GET FEATURED REVIEWS ("NEW ON REAV-ON")
// ==========================================
app.get('/api/reviews/featured', async (req, res) => {
  try {
    const reviewsQuery = await pool.query(
      `SELECT r.*, u.username,
              COALESCE(ROUND(AVG(rt.rating), 1), 0) as avg_rating,
              COUNT(rt.rating)::INT as rating_count
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       LEFT JOIN movie_ratings rt ON r.review_id = rt.review_id
       WHERE r.is_featured = TRUE
       GROUP BY r.review_id, u.username
       ORDER BY r.review_id DESC`
    );
    res.json(reviewsQuery.rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// 7C. GET HIGHLY RATED RECOMMENDATIONS (4-5 STAR AUDIENCE PICKS ONLY)
// ==========================================
app.get('/api/reviews/recommendations', async (req, res) => {
  try {
    const highRatedQuery = await pool.query(
      `SELECT r.*, u.username,
              COALESCE(ROUND(AVG(rt.rating), 1), 0) as avg_rating,
              COUNT(rt.rating)::INT as rating_count
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       LEFT JOIN movie_ratings rt ON r.review_id = rt.review_id
       GROUP BY r.review_id, u.username
       HAVING COALESCE(AVG(rt.rating), 0) >= 4.0 AND COALESCE(AVG(rt.rating), 0) <= 5.0
       ORDER BY r.review_id DESC`
    );
    res.json(highRatedQuery.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 8. GET SPECIFIC MOVIE DETAILS WITH ADMIN STATUS & SEPARATED RATINGS
// ==========================================
app.get('/api/reviews/details/:id', async (req, res) => {
  const reviewId = req.params.id;
  const { email } = req.query; 

  try {
    const reviewQuery = await pool.query(
      `SELECT r.*, u.username,
              COALESCE(ROUND(AVG(rt.rating), 1), 0) as avg_rating,
              COUNT(rt.rating)::INT as rating_count
       FROM reviews r 
       JOIN users u ON r.user_id = u.user_id 
       LEFT JOIN movie_ratings rt ON r.review_id = rt.review_id
       WHERE r.review_id = $1
       GROUP BY r.review_id, u.username`,
      [reviewId]
    );

    if (reviewQuery.rows.length === 0) return res.status(404).json({ message: 'Review not found.' });

    const userQuery = await pool.query('SELECT user_id, is_admin FROM users WHERE LOWER(email) = LOWER($1)', [email || '']);
    const currentUserId = userQuery.rows.length > 0 ? userQuery.rows[0].user_id : null;
    const isAdmin = userQuery.rows.length > 0 ? userQuery.rows[0].is_admin : false;
    const isOwner = currentUserId && (reviewQuery.rows[0].user_id === currentUserId);

    const userRatingQuery = await pool.query('SELECT rating FROM movie_ratings WHERE review_id = $1 AND user_id = $2', [reviewId, currentUserId || 0]);
    const userRatedValue = userRatingQuery.rows.length > 0 ? userRatingQuery.rows[0].rating : null;

    const commentsQuery = await pool.query(
      `SELECT c.*, u.username, u.is_admin AS comment_user_is_admin,
       (SELECT COUNT(*)::INT FROM comment_likes cl WHERE cl.comment_id = c.comment_id) as upvote_score,
       EXISTS (SELECT 1 FROM comment_likes cl JOIN users lu ON cl.user_id = lu.user_id WHERE cl.comment_id = c.comment_id AND LOWER(lu.email) = LOWER($2)) as user_has_liked,
       EXISTS (SELECT 1 FROM comment_dislikes cd JOIN users lu ON cd.user_id = lu.user_id WHERE cd.comment_id = c.comment_id AND LOWER(lu.email) = LOWER($2)) as user_has_disliked
       FROM movie_comments c JOIN users u ON c.user_id = u.user_id 
       WHERE c.review_id = $1 AND c.comment_type != 'community' -- ✅ FIX: Excludes global community posts!
       ORDER BY c.comment_id ASC`,
      [reviewId, email || '']
    );

    res.json({
      review: { ...reviewQuery.rows[0], is_owner: isOwner },
      comments: commentsQuery.rows,
      is_admin: isAdmin,
      user_rating: userRatedValue
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// 8B. ISOLATED MOVIE VIEW COUNT INCREMENTOR
// ==========================================
app.post('/api/reviews/view/:id', async (req, res) => {
  const reviewId = req.params.id;
  try {
    await pool.query('UPDATE reviews SET view_count = view_count + 1 WHERE review_id = $1', [reviewId]);
    res.json({ success: true, message: 'View tracked successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database failure updating view count row.' });
  }
});

// ==========================================
// 9. POST NEW COMMUNITY FEED COMMENT OR REVIEW THREAD COMMENT
// ==========================================
app.post('/api/reviews/details/:id/comments', async (req, res) => {
  const reviewId = req.params.id;
  
  // ✅ FIX: Extract 'type' from the frontend
  const { email, commentText, rating, parentCommentId, type } = req.body; 

  try {
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: 'Session unauthorized.' });
    }
    const userId = userQuery.rows[0].user_id;
    
    // ✅ FIX: Safely route the comment to the right place based on intent
    let commentType = type || 'community';
    if (parentCommentId) {
      commentType = 'reply';
    }

    const newComment = await pool.query(
      'INSERT INTO movie_comments (review_id, user_id, comment_text, rating, parent_comment_id, comment_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [reviewId, userId, commentText, rating, parentCommentId || null, commentType]
    );

    res.status(201).json({ message: 'Comment appended successfully!', comment: newComment.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing comment form submission.' });
  }
});

// ==========================================
// 10. UPVOTE TOGGLE ENDPOINT (ONLY TRACKING ACTIVE UPVOTES)
// ==========================================
app.post('/api/comments/like/:id', async (req, res) => {
  const commentId = req.params.id;
  const { email } = req.body;
  if (!email) return res.status(401).json({ message: 'Sign in to upvote comments.' });

  try {
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    const userId = userQuery.rows[0].user_id;

    // Clear opposing side state first to keep interactions mutually exclusive
    await pool.query('DELETE FROM comment_dislikes WHERE comment_id = $1 AND user_id = $2', [commentId, userId]);

    const likeCheck = await pool.query('SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2', [commentId, userId]);
    let isLikedNow = false;

    if (likeCheck.rows.length > 0) {
      await pool.query('DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2', [commentId, userId]);
      isLikedNow = false;
    } else {
      await pool.query('INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)', [commentId, userId]);
      isLikedNow = true;
    }

    // FIX: Count ONLY upvotes so downvotes do not subtract from the visible total
    const likesRes = await pool.query('SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1', [commentId]);
    const totalUpvotes = parseInt(likesRes.rows[0].count, 10);

    await pool.query('UPDATE movie_comments SET likes_count = $1 WHERE comment_id = $2', [totalUpvotes, commentId]);
    res.json({ success: true, newCount: totalUpvotes, liked: isLikedNow });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// 10B. DOWNVOTE TOGGLE ENDPOINT (SAVES STATE WITHOUT CHANGING COUNT)
// ==========================================
app.post('/api/comments/dislike/:id', async (req, res) => {
  const commentId = req.params.id;
  const { email } = req.body;
  if (!email) return res.status(401).json({ message: 'Sign in to downvote comments.' });

  try {
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    const userId = userQuery.rows[0].user_id;

    // Clear opposing upvote mapping context (if they previously upvoted, remove it)
    await pool.query('DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2', [commentId, userId]);

    const dislikeCheck = await pool.query('SELECT * FROM comment_dislikes WHERE comment_id = $1 AND user_id = $2', [commentId, userId]);
    let isDislikedNow = false;

    if (dislikeCheck.rows.length > 0) {
      await pool.query('DELETE FROM comment_dislikes WHERE comment_id = $1 AND user_id = $2', [commentId, userId]);
      isDislikedNow = false;
    } else {
      await pool.query('INSERT INTO comment_dislikes (comment_id, user_id) VALUES ($1, $2)', [commentId, userId]);
      isDislikedNow = true;
    }

    // FIX: Still calculate the score based ONLY on upvotes so downvoting never forces a -1 display
    const likesRes = await pool.query('SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1', [commentId]);
    const totalUpvotes = parseInt(likesRes.rows[0].count, 10);

    await pool.query('UPDATE movie_comments SET likes_count = $1 WHERE comment_id = $2', [totalUpvotes, commentId]);
    res.json({ success: true, newCount: totalUpvotes, disliked: isDislikedNow });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// 10C. 1-TIME MOVIE RATING UPSERT ENDPOINT
// ==========================================
app.post('/api/reviews/rate/:id', async (req, res) => {
  const reviewId = req.params.id;
  const { email, rating } = req.body;
  if (!email) return res.status(401).json({ message: 'Sign in to rate movies.' });

  try {
    const userQuery = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    const userId = userQuery.rows[0].user_id;

    // INSERT or UPDATE if they have already rated before
    await pool.query(
      `INSERT INTO movie_ratings (review_id, user_id, rating) VALUES ($1, $2, $3)
       ON CONFLICT (review_id, user_id) DO UPDATE SET rating = EXCLUDED.rating`,
      [reviewId, userId, rating]
    );

    res.json({ success: true, message: 'Rating applied successfully!' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// 11. SECURED SYSTEM REVIEW TERMINATION (OWNER + ADMIN SAFE)
// ==========================================
app.delete('/api/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const { email } = req.body;

  try {
    const userQuery = await pool.query('SELECT user_id, is_admin FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) return res.status(401).json({ message: 'Session unauthorized.' });
    
    const userId = userQuery.rows[0].user_id;
    const isAdmin = userQuery.rows[0].is_admin;

    const reviewCheck = await pool.query('SELECT user_id FROM reviews WHERE review_id = $1', [reviewId]);
    if (reviewCheck.rows.length === 0) return res.status(404).json({ message: 'Review not found.' });

    if (reviewCheck.rows[0].user_id !== userId && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized action rejected.' });
    }

    await pool.query('DELETE FROM reviews WHERE review_id = $1', [reviewId]);
    res.json({ message: 'Movie review deleted successfully!' });
  } catch (err) { res.status(500).json({ message: 'Internal database error.' }); }
});

// ==========================================
// 12. SECURED COMMENT DELETION (OWNER + ADMIN SAFE)
// ==========================================
app.delete('/api/comments/:id', async (req, res) => {
  const commentId = req.params.id;
  const { email } = req.body;

  try {
    const userQuery = await pool.query('SELECT user_id, is_admin FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    
    const userId = userQuery.rows[0].user_id;
    const isAdmin = userQuery.rows[0].is_admin;

    const commentCheck = await pool.query('SELECT user_id FROM movie_comments WHERE comment_id = $1', [commentId]);
    if (commentCheck.rows.length === 0) return res.status(404).json({ message: 'Comment not found.' });

    // ✅ PUT IT HERE: This checks authorization before allowing the DELETE query
    if (commentCheck.rows[0].user_id !== userId && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized action.' });
    }

    // Now it is safe to execute the delete
    await pool.query('DELETE FROM movie_comments WHERE comment_id = $1', [commentId]);
    res.json({ message: 'Comment removed successfully!' });
  } catch (err) { res.status(500).json({ message: 'Internal database error.' }); }
});

// ==========================================
// 12B. SECURED INLINE COMMENT MODIFICATION (OWNER + ADMIN SAFE)
// ==========================================
app.put('/api/comments/:id', async (req, res) => {
  const commentId = req.params.id;
  const { email, commentText } = req.body;

  try {
    const userQuery = await pool.query('SELECT user_id, is_admin FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0) return res.status(401).json({ message: 'Identity required.' });
    
    const userId = userQuery.rows[0].user_id;
    const isAdmin = userQuery.rows[0].is_admin;

    const commentCheck = await pool.query('SELECT user_id FROM movie_comments WHERE comment_id = $1', [commentId]);
    if (commentCheck.rows.length === 0) return res.status(404).json({ message: 'Comment missing.' });

    if (commentCheck.rows[0].user_id !== userId && !isAdmin) {
      return res.status(403).json({ message: 'Action forbidden.' });
    }

    await pool.query('UPDATE movie_comments SET comment_text = $1 WHERE comment_id = $2', [commentText, commentId]);
    res.json({ message: 'Comment modified successfully!' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// 12C. ADMIN EXCLUSIVE COMMENT VERIFICATION TOGGLE
// ==========================================
app.post('/api/comments/verify/:id', async (req, res) => {
  const commentId = req.params.id;
  const { email } = req.body;

  try {
    const userQuery = await pool.query('SELECT is_admin FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userQuery.rows.length === 0 || !userQuery.rows[0].is_admin) {
      return res.status(403).json({ message: 'Administrative access clearance required.' });
    }

    const currentStatus = await pool.query('SELECT is_verified FROM movie_comments WHERE comment_id = $1', [commentId]);
    if (currentStatus.rows.length === 0) return res.status(404).json({ message: 'Comment missing.' });

    const nextVerifiedState = !currentStatus.rows[0].is_verified;
    await pool.query('UPDATE movie_comments SET is_verified = $1 WHERE comment_id = $2', [nextVerifiedState, commentId]);
    
    res.json({ success: true, is_verified: nextVerifiedState });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// 13. SECURED MOVIE REVIEW UPDATE (PUT ROUTE)
// ==========================================
app.put('/api/reviews/:id', async (req, res) => {
  
  const reviewId = req.params.id;
  const { email, movieName, publishDate, reviewText, imageData } = req.body;

  if (!email) {
    return res.status(401).json({ message: 'Session unauthorized.' });
  }

  try {
    // Inside app.put('/api/reviews/:id') near line 380:
const userQuery = await pool.query('SELECT user_id, is_admin FROM users WHERE LOWER(email) = LOWER($1)', [email]);
if (userQuery.rows.length === 0) return res.status(404).json({ message: 'User identity not found.' });

const userId = userQuery.rows[0].user_id;
const isAdmin = userQuery.rows[0].is_admin;

const reviewCheck = await pool.query('SELECT user_id FROM reviews WHERE review_id = $1', [reviewId]);
if (reviewCheck.rows.length === 0) return res.status(404).json({ message: 'Target review record not found.' });

// UPGRADED CONDITION BLOCK:
if (reviewCheck.rows[0].user_id !== userId && !isAdmin) {
  return res.status(403).json({ message: 'Unauthorized action blocked.' });
}
    // 3. Perform update (If a new poster image was selected, include it; otherwise keep the old one)
    if (imageData) {
      await pool.query(
        'UPDATE reviews SET movie_name = $1, publish_date = $2, review_text = $3, image_data = $4 WHERE review_id = $5',
        [movieName, publishDate, reviewText, imageData, reviewId]
      );
    } else {
      await pool.query(
        'UPDATE reviews SET movie_name = $1, publish_date = $2, review_text = $3 WHERE review_id = $4',
        [movieName, publishDate, reviewText, reviewId]
      );
    }

    res.json({ message: 'Movie review updated successfully!' });

  } catch (err) {
    console.error("❌ Error executing update query:", err.message);
    res.status(500).json({ message: 'Internal database update failure.' });
  }
});

// ==========================================
// 14. GET ALL COMMUNITY DISCUSSION FEED COMMENTS
// ==========================================
app.get('/api/community/feed', async (req, res) => {
  const { email } = req.query;

  try {
    const feedQuery = await pool.query(
      `SELECT c.comment_id, c.comment_text, c.created_at, c.rating,
              u.username, r.review_id, r.movie_name, r.publish_date, r.image_data,
              (SELECT COUNT(*)::INT FROM comment_likes cl WHERE cl.comment_id = c.comment_id) as likes_count,
              (SELECT COUNT(*)::INT FROM movie_comments sub_c WHERE sub_c.parent_comment_id = c.comment_id) as comments_count,
              EXISTS (SELECT 1 FROM comment_likes cl 
                      JOIN users lu ON cl.user_id = lu.user_id 
                      WHERE cl.comment_id = c.comment_id AND LOWER(lu.email) = LOWER($1)) as user_has_liked
       FROM movie_comments c
       JOIN users u ON c.user_id = u.user_id
       JOIN reviews r ON c.review_id = r.review_id
       WHERE c.comment_type = 'community' -- ✅ FIXED: This filter keeps sub-replies off the main feed!
       ORDER BY c.comment_id DESC`,
       [email || '']
    );
    
    res.json(feedQuery.rows);
  } catch (err) {
    console.error("❌ Error fetching community feed:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

// To this:
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running securely on port ${PORT}`);
});