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
    "id" SERIAL PRIMARY KEY,
    "product_id" INT,
    "owner_id" INT,
    "rating" NUMERIC(2, 1) NOT NULL,
    "comment" VARCHAR(300) NOT NULL
);

CREATE TABLE "kart" (
    "id" SERIAL PRIMARY KEY,
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


INSERT INTO "role" ("id","role") VALUES (1, 'client'), (2, 'owner');


-- Functions


CREATE OR REPLACE FUNCTION default_varchar("value" VARCHAR, "default_value" VARCHAR)

RETURNS VARCHAR

LANGUAGE plpgsql AS $$

BEGIN

    IF "value" = '' OR "value" IS NULL THEN RETURN "default_value";

    ELSE RETURN "value";

    END IF;

END; $$;


CREATE OR REPLACE FUNCTION default_int("value" INT, "default_value" INT)

RETURNS INT

LANGUAGE plpgsql AS $$

BEGIN

    IF "value" = 0 OR "value" IS NULL THEN RETURN "default_value";

    ELSE RETURN "value";

    END IF;

END; $$;


CREATE OR REPLACE FUNCTION default_numeric("value" NUMERIC, "default_value" NUMERIC)

RETURNS NUMERIC

LANGUAGE plpgsql AS $$

BEGIN

    IF "value" = 0 OR "value" IS NULL THEN RETURN "default_value";

    ELSE RETURN "value";

    END IF;

END; $$;


--


CREATE OR REPLACE FUNCTION get_user("user_id" INT)

RETURNS TABLE (
    "role_id" INT,
    "first_name" VARCHAR,
    "last_name" VARCHAR,
    "email" VARCHAR
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "U"."role_id", "U"."first_name", "U"."last_name", "U"."email" FROM "user" AS "U" WHERE "U"."id" = "user_id";

END; $$;


CREATE OR REPLACE FUNCTION sign_in("sign_in_email" VARCHAR)

RETURNS TABLE (
    "role_id" INT,
    "password" VARCHAR
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "U"."role_id", "U"."password" FROM "user" AS "U" WHERE "U"."email" = "sign_in_email";

END; $$;


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

    RETURN QUERY SELECT "P"."name", "P"."price", "P"."description", "P"."sales" FROM "product" AS "P" WHERE "P"."id" = "product_id";

END; $$;


CREATE OR REPLACE FUNCTION search_products("query" VARCHAR, "min_price" NUMERIC(7, 2), "max_price" NUMERIC(7, 2))

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

        "max_price" := 99999.99;

    END IF;

    IF "query" = '' OR "query" IS NULL THEN

        RETURN QUERY SELECT "P"."id", "P"."name", "P"."price", "P"."description", "P"."sales" FROM "product" AS "P" WHERE "P"."price" BETWEEN "min_price" AND "max_price";

    ELSE

        SELECT '%' || "query" || '%' INTO "query";

        RETURN QUERY SELECT "P"."id", "P"."name", "P"."price", "P"."description", "P"."sales" FROM "product" AS "P"
        
        WHERE ("P"."name" ILIKE "query" OR "P"."description" ILIKE "query") AND "P"."price" BETWEEN "min_price" AND "max_price";

    END IF;

END; $$;


CREATE OR REPLACE FUNCTION get_product_ratings("selected_product_id" INT)

RETURNS TABLE (
    "id" INT,
    "owner_id" INT,
    "rating" NUMERIC(2, 1),
    "comment" VARCHAR
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "PR"."id", "PR"."owner_id", "PR"."rating", "PR"."comment" FROM "product_ratings" AS "PR" WHERE "PR"."product_id" = "selected_product_id";

END; $$;


CREATE OR REPLACE FUNCTION get_kart("user_id" INT)

RETURNS TABLE (
    "product_id" INT,
    "product_name" VARCHAR(45),
    "product_price" NUMERIC(7,2),
    "quantity" INT
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "P"."id", "P"."name", "P"."price", "K"."quantity" FROM "product" AS "P"

    INNER JOIN "kart" AS "K" ON "P"."id" = "K"."product_id"

    WHERE "K"."owner_id" = "user_id";

END; $$;


CREATE OR REPLACE FUNCTION get_user_invoices("user_id" INT)

RETURNS TABLE (
    "id" INT,
    "date_of_purchase" DATE
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "I"."id", "I"."date_of_purchase" FROM "invoice" AS "I" WHERE "I"."owner_id" = "user_id";

END; $$;


CREATE OR REPLACE FUNCTION get_invoice_detail("selected_invoice_id" INT)

RETURNS TABLE (
    "product_name" VARCHAR(45),
    "product_price" NUMERIC(7,2),
    "quantity" INT
)

LANGUAGE plpgsql AS $$

BEGIN

    RETURN QUERY SELECT "ID"."product_name", "ID"."product_price", "ID"."quantity" FROM "invoice_detail" AS "ID" WHERE "ID"."invoice_id" = "selected_invoice_id";

END; $$;


-- Procedures


CREATE OR REPLACE PROCEDURE new_product("new_name" VARCHAR, "new_price" NUMERIC, "new_description" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    INSERT INTO "product" ("name", "price", "description", "sales") VALUES ("new_name", "new_price", "new_description", 0);
END; $$;

CREATE OR REPLACE PROCEDURE update_product("product_id" INT, "new_name" VARCHAR, "new_price" NUMERIC, "new_description" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    UPDATE "product" SET
    
    "name" = default_varchar("new_name", "name"),
    
    "price" = default_numeric("new_price", "price"),
    
    "description" = default_varchar("new_description", "description")
    
    WHERE "id" = "product_id";

END; $$;


CREATE OR REPLACE PROCEDURE delete_product("product_id" INT)

LANGUAGE plpgsql AS $$

BEGIN

    DELETE FROM "product" WHERE "id" = "product_id";
END; $$;


--


CREATE OR REPLACE PROCEDURE new_user("new_first_name" VARCHAR, "new_last_name" VARCHAR, "new_email" VARCHAR, "new_password" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    INSERT INTO "user" ("role_id","first_name","last_name","email","password") VALUES (1, "new_first_name", "new_last_name", "new_email", "new_password");
END; $$;

CREATE OR REPLACE PROCEDURE update_user("user_id" INT, "new_first_name" VARCHAR, "new_last_name" VARCHAR, "new_email" VARCHAR, "new_password" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    UPDATE "user" SET

    "first_name" =  default_varchar("new_first_name", "first_name"),

    "last_name" =  default_varchar("new_last_name", "last_name"),

    "email" =  default_varchar("new_email", "email"),

    "password" =  default_varchar("new_password", "password")

    WHERE "id" = "user_id";

END; $$;


CREATE OR REPLACE PROCEDURE delete_user("user_id" INT, "new_first_name" VARCHAR, "new_last_name" VARCHAR, "new_email" VARCHAR, "new_password" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    DELETE FROM "user" WHERE "id" = "user_id";
END; $$;


--


CREATE OR REPLACE PROCEDURE add_rating("selected_product_id" INT, "user_id" INT, "new_rating" NUMERIC, "new_comment" VARCHAR)

LANGUAGE plpgsql AS $$

BEGIN

    INSERT INTO "product_ratings" ("product_id","owner_id","rating","comment") VALUES ("selected_product_id", "user_id", "new_rating", "new_comment");
END; $$;


CREATE OR REPLACE PROCEDURE delete_rating("rating_id" INT)

LANGUAGE plpgsql AS $$

BEGIN

    DELETE FROM "product_ratings" WHERE "id" = "rating_id";
END; $$;


--


CREATE OR REPLACE PROCEDURE add_to_kart("user_id" INT, "selected_product_id" INT, "quantity_to_add" INT)

LANGUAGE plpgsql AS $$

BEGIN

    INSERT INTO "kart" ("owner_id","product_id","quantity") VALUES ("user_id", "selected_product_id", "quantity_to_add");
END; $$;


CREATE OR REPLACE PROCEDURE update_kart("user_id" INT, "selected_product_id" INT, "quantity_to_add" INT)

LANGUAGE plpgsql AS $$

BEGIN

    UPDATE "kart" SET "quantity" = "quantity" + "quantity_to_add" WHERE "owner_id" = "user_id" AND "product_id" = "selected_product_id";
END; $$;


CREATE OR REPLACE PROCEDURE delete_from_kart("kart_id" INT)

LANGUAGE plpgsql AS $$

BEGIN

    DELETE FROM "kart" WHERE "id" = "kart_id";
END; $$;


CREATE OR REPLACE PROCEDURE delete_kart("user_id" INT)

LANGUAGE plpgsql AS $$

BEGIN

    DELETE FROM "kart" WHERE "owner_id" = "user_id";
END; $$;


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

    INSERT INTO "new_invoice_detail" ("product_name", "product_price", "quantity") SELECT "K"."product_name", "K"."product_price", "K"."quantity" FROM get_kart("user_id") AS "K";

    INSERT INTO "invoice" ("owner_id") VALUES ("user_id") RETURNING "id" INTO "new_invoice_id";

    UPDATE "new_invoice_detail" SET "invoice_id" = "new_invoice_id";

    INSERT INTO "invoice_detail" ("invoice_id","product_name","product_price","quantity") SELECT "new_invoice_detail";

    CALL delete_kart("user_id");

END; $$;
