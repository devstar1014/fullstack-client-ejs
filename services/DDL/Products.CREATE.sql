-- CREATE statement for Products iunder

CREATE TABLE IF NOT EXISTS Products (
    product_id SERIAL CONSTRAINT pk_product_id PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT CHECK (LENGTH(description) >= 15) NOT NULL,
    release_year VARCHAR(4) NOT NULL,
    condition VARCHAR(50) NOT NULL,
);