-- Create user table for BestKindElectronics DB

CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL CONSTRAINT pk_user_id PRIMARY KEY,
    user_name VARCHAR(255) UNIQUE NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
