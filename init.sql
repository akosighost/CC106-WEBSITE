-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- 2. Create Reviews Table (Updated with featured and genres)
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    movie_name TEXT NOT NULL,
    publish_date TEXT,
    review_text TEXT,
    image_data TEXT,
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    genres TEXT[] DEFAULT '{}'
);

-- 3. Create Movie Comments Table
CREATE TABLE IF NOT EXISTS movie_comments (
    comment_id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(review_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id),
    comment_text TEXT NOT NULL,
    rating INTEGER,
    parent_comment_id INTEGER REFERENCES movie_comments(comment_id),
    comment_type TEXT DEFAULT 'review',
    is_verified BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Rating & Interaction Tables
CREATE TABLE IF NOT EXISTS movie_ratings (
    review_id INTEGER REFERENCES reviews(review_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    PRIMARY KEY (review_id, user_id)
);

CREATE TABLE IF NOT EXISTS comment_likes (
    comment_id INTEGER REFERENCES movie_comments(comment_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id),
    PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS comment_dislikes (
    comment_id INTEGER REFERENCES movie_comments(comment_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id),
    PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS password_resets (
    email TEXT,
    token TEXT,
    expires_at TIMESTAMP
);