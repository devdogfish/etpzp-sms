-- Create User Table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    role VARCHAR(20) CHECK (role IN ('user', 'admin')),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Message Table
CREATE TABLE "message" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'scheduled', 'failed')),
    location VARCHAR(20) CHECK (location IN ('sent', 'draft', 'trash')) DEFAULT "sent", -- this can be null when the message is a draft
    scheduled_time TIMESTAMP,
    failure_reason VARCHAR(255)
);

-- Create Contacts Table
CREATE TABLE "contact" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Recipient Table
CREATE TABLE recipient (     
	id SERIAL PRIMARY KEY,     
	message_id INTEGER REFERENCES message(id) ON DELETE CASCADE,     
	contact_id INTEGER REFERENCES contact(id) ON DELETE SET NULL,     
	phone VARCHAR(15) UNIQUE,   -- Store phone numbers as VARCHAR to accommodate various formats  
	UNIQUE (message_id, contact_id),   -- Ensure a contact can only be added once per message. This is not an actual field in the table, but it will make sure that there are no recipients with duplicate links
	UNIQUE (message_id, phone)  -- Ensure a phone number can only be added once per message. This is not an actual field in the table, but it will make sure that there are no recipients with duplicate links
);

-- Create Attachment Table
-- CREATE TABLE "attachment" (
--     id SERIAL PRIMARY KEY,
--     message_id INTEGER REFERENCES "message"(id) ON DELETE CASCADE,
--     file_name VARCHAR(255) NOT NULL,
--     file_path VARCHAR(255) NOT NULL,
--     file_size INTEGER NOT NULL,
--     created_at TIMESTAMP DEFAULT NOW()
-- );