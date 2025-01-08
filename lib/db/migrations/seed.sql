-- Create User Table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('user', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    display_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

-- Create Message Table
CREATE TABLE "message" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) CHECK (status IN ('sent', 'scheduled', 'failed')), -- this can be null when the message is a draft
    location VARCHAR(20) NOT NULL CHECK (location IN ('sent', 'draft', 'trash')),
    scheduled_time TIMESTAMP,
    failure_reason VARCHAR(255)
);

-- Create Contacts Table
CREATE TABLE "contact" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name VARCHAR(255),
    phone VARCHAR(50) UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Recipient Table
CREATE TABLE recipient (     
	id SERIAL PRIMARY KEY,     
	message_id INTEGER REFERENCES message(id) ON DELETE CASCADE,     
	contact_id INTEGER REFERENCES contact(id) ON DELETE SET NULL,     
	phone VARCHAR(15) NOT NULL,   -- Store phone numbers as VARCHAR to accommodate various formats  
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

--INSERT INTO public.user (email, name, role, display_name, first_name, last_name) VALUES ('pepe@gmail.com', 'Pepe Maximus', 'user', 'Pepe Maximus', 'Pepe', 'Maximus') RETURNING *;