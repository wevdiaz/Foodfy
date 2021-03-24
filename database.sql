-- table chefs Foodfy 
CREATE TABLE "chefs" (
    "id" SERIAL PRIMARY KEY AUTOINCREMENT,
    "name" text NOT NULL,
    "created_at" timestamp,
    "file_id" int
);

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");


-- table files Foodfy
CREATE TABLE "files" (
    "id" SERIAL PRIMARY KEY AUTOINCREMENT,
    "name" text NOT NULL,
    "path" text NOT NULL
);


-- table recipe_files  Foodfy
CREATE TABLE "recipe_files" (
    "id" SERIAL PRIMARY KEY AUTOINCREMENT,
    "recipe_id" int,
    "file_id" int
);

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");


-- table recipes Foodfy
CREATE TABLE "recipes" (
    "id" SERIAL PRIMARY KEY,
    "chef_id" int,
    "title" text NOT NULL,
    "ingredients" text[],
    "preparation" text[],
    "information" text NOT NULL,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- table users  Foodfy

CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "email" text UNIQUE NOT NULL,
    "password" text NOT NULL,
    "reset_token" text,
    "reset_token_expires" text,
    "is_admin" BOOLEAN DEFAULT false,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())    
);



-- create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- auto updated_at users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- auto updated_at recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- connect pg simple table
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE; 

-- effect Cascade SQL when delete
ALTER TABLE "recipes"
DROP CONSTRAINT recipes_user_id_fkey,
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_recipe_id_fkey,
ADD CONSTRAINT recipe_files_recipe_id_fkey
FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_file_id_fkey,
ADD CONSTRAINT recipe_files_file_id_fkey
FOREIGN KEY ("file_id")
REFERENCES "files" ("id")
ON DELETE CASCADE;