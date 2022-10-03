create or replace function createPost (
    author_id int,
    title varchar,
    slug varchar,
    summary varchar,
    creation_date timestamptz,
    content varchar,
    tag int
  ) returns void as $$ begin with new_post as (
    insert into post (
        author_id,
        title,
        slug,
        summary,
        creation_date,
        content
      )
    values ($1, $2, $3, $4, $5, $6)
    returning post_id
  ) -- , new_tag as (
  --   insert into tag
  --     (...)
  --   values
  --     (...)
  --   RETURNING tag_id
  -- )
insert into post_tag (post_id, tag_id)
values (
    (
      select post_id
      from new_post
    ),
    $7
  );
end;
$$ language plpgsql;