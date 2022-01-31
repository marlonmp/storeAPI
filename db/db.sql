DROP DATABASE IF EXISTS "storeAPI";
CREATE DATABASE "storeAPI";

\c storeAPI;

CREATE TABLE "role" (
    "id" SERIAL PRIMARY KEY,
    "role" VARCHAR(20) NOT NULL
);

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "role_id" INT,
    "first_name" VARCHAR(30) NOT NULL,
    "last_name" VARCHAR(30) NOT NULL,
    "email" VARCHAR(60) UNIQUE NOT NULL,
    "password" VARCHAR(150) NOT NULL
);

CREATE TABLE "product" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(45) NOT NULL,
    "price" NUMERIC(7,2) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "sales" INT NOT NULL
);

CREATE TABLE "product_ratings" (
    "product_id" INT,
    "owner_id" INT,
    "rating" NUMERIC(2, 1) NOT NULL,
    "comment" VARCHAR(300) NOT NULL
);

CREATE TABLE "kart" (
    "owner_id" INT,
    "product_id" INT,
    "quantity" INT NOT NULL
);

CREATE TABLE "invoice" (
    "id" SERIAL PRIMARY KEY,
    "owner_id" INT,
    "date_of_purchase" DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE "invoice_detail" (
    "invoice_id" INT,
    "product_name" VARCHAR(45) NOT NULL,
    "product_price" NUMERIC(7,2) NOT NULL,
    "quantity" INT NOT NULL
);

ALTER TABLE "user" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");

ALTER TABLE "product_ratings" ADD FOREIGN KEY ("product_id") REFERENCES "product" ("id");
ALTER TABLE "product_ratings" ADD FOREIGN KEY ("owner_id") REFERENCES "user" ("id");

ALTER TABLE "kart" ADD FOREIGN KEY ("owner_id") REFERENCES "user" ("id");
ALTER TABLE "kart" ADD FOREIGN KEY ("product_id") REFERENCES "product" ("id");

ALTER TABLE "invoice" ADD FOREIGN KEY ("owner_id") REFERENCES "user" ("id");

ALTER TABLE "invoice_detail" ADD FOREIGN KEY ("invoice_id") REFERENCES "invoice" ("id");


-- Inserts


INSERT INTO "role" ("id","role") VALUES (1, "client"), (2, "owner");


-- Functions


CREATE OR REPLACE FUNCTION get_user("user_id" INT)

RETURNS TABLE (
    "role_id" INT,
    "first_name" VARCHAR,
    "last_name" VARCHAR,
    "email" VARCHAR
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "role_id", "first_name", "last_name", "email" FROM "user"  WHERE "id" = "user_id";

END; $$


CREATE OR REPLACE FUNCTION sign_in("sign_in_email" VARCHAR)

RETURNS TABLE (
    "role_id" INT,
    "password" VARCHAR
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "role_id", "password" FROM "user" WHERE "email" = "sign_in_email";

END; $$


--


CREATE OR REPLACE FUNCTION get_product("product_id" INT)

RETURNS TABLE (
    "name" VARCHAR,
    "price" NUMERIC(7,2),
    "description" VARCHAR,
    "sales" INT
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "name", "price", "description", "sales" FROM "product" WHERE "id" = "product_id";

END; $$


CREATE OR REPLACE FUNCTION search_products("query" VARCHAR, "min_price" NUMERIC, "max_price" NUMERIC)

RETURNS TABLE (
    "id" INT,
    "name" VARCHAR,
    "price" NUMERIC(7,2),
    "description" VARCHAR,
    "sales" INT
)

LANGUAGE plpgsql AS $$

BEGIN

    IF "min_price" < 0 THEN

        "min_price" := 0;

    END IF;

    IF "max_price" = 0 OR "max_price" > 99999.99 THEN 

        "max_price" := 99999.99

    END IF;

    IF "query" != '' OR "query" = NULL THEN

        SELECT '%' || "query" || '%' INTO "query";

        RETURN QUERY SELECT "id", "name", "price", "description", "sales" FROM "product" WHERE ("name" ILIKE "query" OR "description" ILIKE "query") AND "price" BETWEEN "min_price" AND "max_price";

    ELSE

        RETURN QUERY SELECT "id", "name", "price", "description", "sales" FROM "product" WHERE "price" BETWEEN "min_price" AND "max_price";

    END IF;

END; $$


CREATE OR REPLACE FUNCTION get_product_ratings("selected_product_id" INT)

RETURNS TABLE (
    "owner_id" INT,
    "rating" NUMERIC(2, 1),
    "comment" VARCHAR
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "owner_id", "rating", "comment" FROM "product_ratings" WHERE "product_id" = "selected_product_id";

END; $$


CREATE OR REPLACE FUNCTION get_kart("user_id" INT)

RETURNS TABLE (
    "product_id" INT,
    "quantity" INT NOT NULL
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "product_id", "quantity" FROM "kart" WHERE "owner_id" = "user_id";

END; $$


CREATE OR REPLACE FUNCTION get_user_invoices("user_id" INT)

RETURNS TABLE (
    "id" INT,
    "date_of_purchase" DATE
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "id", "date_of_purchase" FROM "invoice" WHERE "owner_id" = "user_id";

END; $$


CREATE OR REPLACE FUNCTION get_invoice_detail("selected_invoice_id" INT)

RETURNS TABLE (
    "product_name" VARCHAR(45),
    "product_price" NUMERIC(7,2),
    "quantity" INT
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "product_name", "product_price", "quantity" FROM "invoice_detail" WHERE "invoice_id" = "selected_invoice_id";

END; $$


-- Procedures


CREATE OR REPLACE PROCEDURE new_product("new_name" VARCHAR, "new_price" NUMERIC, "new_description" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    INSERT INTO "product" ("name", "price", "description", "sales") VALUES ("new_name", "new_price", "new_description", 0);
END; $$

CREATE OR REPLACE PROCEDURE update_product("product_id" INT, "new_name" VARCHAR, "new_price" NUMERIC, "new_description" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    UPDATE "product" SET "name" = "new_name", "price" = "new_price", "description" = "new_description" WHERE "id" = "product_id";
END; $$


CREATE OR REPLACE PROCEDURE delete_product("product_id" INT)

LANGUAGE plpgsql AS $$

BEGIN

    DELETE FROM "product" WHERE "id" = "product_id";
END; $$


--


CREATE OR REPLACE PROCEDURE new_user("new_first_name" VARCHAR, "new_last_name" VARCHAR, "new_email" VARCHAR, "new_password" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    INSERT INTO "user" ("role_id","first_name","last_name","email","password") VALUES (1, "new_first_name", "new_last_name", "new_email", "new_password");
END; $$

CREATE OR REPLACE PROCEDURE update_user("user_id" INT, "new_first_name" VARCHAR, "new_last_name" VARCHAR, "new_email" VARCHAR, "new_password" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    UPDATE "user" SET "first_name" = "new_first_name","last_name" = "new_last_name","email" = "new_email","password" = "new_password" WHERE "id" = "user_id";
END; $$


CREATE OR REPLACE PROCEDURE delete_user("user_id" INT, "new_first_name" VARCHAR, "new_last_name" VARCHAR, "new_email" VARCHAR, "new_password" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    DELETE FROM "user" WHERE "id" = "user_id";
END; $$


--


CREATE OR REPLACE PROCEDURE add_rating("selected_product_id" INT, "user_id" INT, "new_rating" NUMERIC, "new_comment" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    INSERT INTO "product_ratings" ("product_id","owner_id","rating","comment") VALUES ("selected_product_id", "user", "new_rating", "new_comment");
END; $$


CREATE OR REPLACE PROCEDURE delete_rating("selected_product_id" INT, "user_id" INT)

LANGUAGE plpgsql AS $$

BEGIN

    DELETE FROM "product_ratings" WHERE "product_id" = "selected_product_id" AND "owner_id" = "user_id";
END; $$


--


CREATE OR REPLACE PROCEDURE add_to_kart("user_id" INT, "selected_product_id" INT, "quantity_to_add" INT)

LANGUAGE plpgsql AS $$

BEGIN

    INSERT INTO "kart" ("owner_id","product_id","quantity") VALUES ("user_id", "selected_product_id", "quantity_to_add");
END; $$


CREATE OR REPLACE PROCEDURE update_kart("user_id" INT, "selected_product_id" INT, "quantity_to_add" INT)

LANGUAGE plpgsql AS $$

BEGIN

    UPDATE "kart" SET "quantity" = "quantity" + "quantity_to_add" WHERE "owner_id" = "user_id" AND "product_id" = "selected_product_id";
END; $$


CREATE OR REPLACE PROCEDURE delete_from_kart("user_id" INT, "selected_product_id" INT, "quantity_to_add" INT)

LANGUAGE plpgsql AS $$

BEGIN

    DELETE FROM "kart" WHERE "owner_id" = "user_id" AND "product_id" = "selected_product_id";
END; $$


CREATE OR REPLACE PROCEDURE delete_kart("user_id" INT)

LANGUAGE plpgsql AS $$

BEGIN

    DELETE FROM "kart" WHERE "owner_id" = "user_id";
END; $$


--


CREATE OR REPLACE PROCEDURE generate_invoice("user_id" INT)

LANGUAGE plpgsql AS $$

DECLARE

    "new_invoice_id" INT;

BEGIN

    CREATE TEMP TABLE "new_invoice_detail" (
        "invoice_id" INT,
        "product_name" VARCHAR(45),
        "product_price" NUMERIC(7,2),
        "quantity" INT
    ) ON COMMIT DROP;

    SELECT "P"."name" AS "product_name", "P"."price" AS "product_ptice", "K"."quantity" AS "quantity" INTO "new_invoice_detail" FROM "product" AS "P"

    INNER JOIN "kart" AS "K" ON "P"."id" = "K"."product_id"

    WHERE "K"."owner_id" = "user_id";

    INSERT INTO "invoice" ("owner_id") VALUES ("user_id") RETURNING "id" INTO "new_invoice_id";

    UPDATE "new_invoice_detail" SET "invoice_id" = "new_invoice_id";

    INSERT INTO "invoice_detail" ("invoice_id","product_name","product_price","quantity") SELECT "new_invoice_detail";

    CALL delete_kart("user_id");

END; $$
