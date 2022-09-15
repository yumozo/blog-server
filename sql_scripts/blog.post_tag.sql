create TABLE post_tag (
  post_id integer REFERENCES post on update CASCADE on DELETE CASCADE,
  tag_id INTEGER REFERENCES tag on UPDATE cascade,
  amount integer not null DEFAULT 1,
  CONSTRAINT post_tag_pkey PRIMARY KEY (post_id, tag_id)
)