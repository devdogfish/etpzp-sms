-- Create user table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('USER', 'ADMIN')) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    display_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    color_id SMALLINT NOT NULL DEFAULT 1
);

-- Create message table
CREATE TABLE "message" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    sender VARCHAR(255),
    subject VARCHAR(255),
    body TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    send_time TIMESTAMP, -- can be null if the message is a draft
    status VARCHAR(20) NOT NULL CHECK (status IN ('SENT', 'SCHEDULED', 'FAILED', 'DRAFTED')), 
    in_trash BOOLEAN NOT NULL DEFAULT false,
    failure_reason VARCHAR(255)
);

-- Create contacts table
CREATE TABLE "contact" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    -- color_id SMALLINT NOT NULL DEFAULT 1, Do you really want to feel the pain of implementing this too?
    UNIQUE (user_id, phone) -- the same phone number may exist between different user, but there cannot be contacts with the same phone number for one user.
);

-- Create recipient table
CREATE TABLE recipient (     
	id SERIAL PRIMARY KEY,
	message_id INTEGER REFERENCES message(id) ON DELETE CASCADE,     
	contact_id INTEGER REFERENCES contact(id) ON DELETE SET NULL,     
	phone VARCHAR(15) NOT NULL,        -- Store phone numbers as VARCHAR to accommodate various formats  
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	UNIQUE (message_id, contact_id),   -- Ensure a contact can only be added once per message. This is not an actual field in the table, but it will make sure that there are no recipients with duplicate links
	UNIQUE (message_id, phone)         -- Ensure a phone number can only be added once per message. This is not an actual field in the table, but it will make sure that there are no recipients with duplicate links
);

-- if on mac uncomment this as well
-- INSERT INTO public.user (email, name, role, display_name, first_name, last_name) VALUES ('pepe@gmail.com', 'Pepe Maximus', 'USER', 'Pepe Maximus', 'Pepe', 'Maximus') RETURNING *;





-- Create Attachment Table
-- CREATE TABLE "attachment" (
--     id SERIAL PRIMARY KEY,
--     message_id INTEGER REFERENCES "message"(id) ON DELETE CASCADE,
--     file_name VARCHAR(255) NOT NULL,
--     file_path VARCHAR(255) NOT NULL,
--     file_size INTEGER NOT NULL,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- ALTER TABLE public.user ALTER COLUMN created_at SET NOT NULL;
-- ALTER TABLE public.user ALTER COLUMN updated_at SET NOT NULL;