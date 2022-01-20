CREATE TABLE "role" (
    "id" SERIAL PRIMARY KEY,
    "role" VARCHAR(20)
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
    "description" VARCHAR(300) NOT NULL,
    "sales" INT NOT NULL
);

CREATE TABLE "product_ratings" (
    "product_id" INT,
    "owner_id" INT,
    "rating" NUMERIC(2, 1) NOT NULL,
    "comment" VARCHAR(300)
);

CREATE TABLE "kart" (
    "id" SERIAL PRIMARY KEY,
    "owner_id" INT,
    "product_id" INT NOT NULL,
    "quantity" INT NOT NULL
);

CREATE TABLE "invoice" (
    "id" SERIAL PRIMARY KEY,
    "owner_id" INT,
    "date_of_purchase" date NOT NULL
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
