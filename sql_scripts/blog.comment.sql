CREATE TABLE post_comment (
  comment_id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES post ON DELETE NO ACTION,
  author_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content VARCHAR
  -- index idx_comment_post (post_id asc),
  -- constraint fk_comment_post
  --   foreign key (post_id)
  --   references post (id)
  --   on delete no action
  --   on update no action
);