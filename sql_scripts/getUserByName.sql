create or replace function getUserByName(pattern varchar) returns table (
    user_id int,
    user_name varchar,
    email varchar,
    password_hash varchar,
    registration_date timestamptz,
    last_login timestamptz,
    bio varchar
  ) as $$ begin return query
select *
from user_account
where lower(name) like lower(lower(pattern));
end;
$$ language plpgsql;