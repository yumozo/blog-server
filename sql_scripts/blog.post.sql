CREATE TABLe post (
  post_id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES user_account ON DELETE NO ACTION,
  title VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  summary VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content VARCHAR
  -- unique index uq_slug (slug asc),
  -- index idx_post_user (author_id asc),
  -- constraint fk_post_user
    -- foreign key (author_id)
    -- references user (id)
    -- on delete no action
    -- on update no action
);