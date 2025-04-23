-- Create user table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('USER', 'ADMIN')) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    -- User settings: 
    -- All have defaults except display name, which defaults to the user's AD name when they first sign up.
    lang VARCHAR(2) NOT NULL DEFAULT 'pt', -- ISO 639-1 language code
    profile_color_id SMALLINT NOT NULL DEFAULT 2,
    display_name VARCHAR(50) NOT NULL,
    primary_color_id SMALLINT NOT NULL DEFAULT 1,
    appearance_layout VARCHAR(20) CHECK (appearance_layout IN ('MODERN', 'SIMPLE')) NOT NULL DEFAULT 'MODERN',
    dark_mode BOOLEAN NOT NULL DEFAULT false
);

-- Create message table
CREATE TABLE "message" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    sender VARCHAR(255),
    subject VARCHAR(255),
    body TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    send_time TIMESTAMP DEFAULT NOW() NOT NULL, -- can be null if the message is a draft
    sms_reference_id BIGINT, -- can be null if the message is not scheduled, failed, or a draft
    status VARCHAR(20) NOT NULL CHECK (status IN ('SENT', 'SCHEDULED', 'FAILED', 'DRAFTED')), -- scheduled messages will remain with status "SCHEDULED", even when their delivery date is reached
    in_trash BOOLEAN NOT NULL DEFAULT false,
    api_error_code SMALLINT, -- This is the http status code which is saved when an error occurs
    api_error_details_json TEXT,
    cost NUMERIC(6, 4), -- 6 total digits, 4 digits after the decimal
    cost_currency VARCHAR(10) -- assumed to be in EUR
);

-- Create contacts table
CREATE TABLE "contact" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, phone) -- The same phone number may exist between different user, but there cannot be contacts with the same phone number for one user.
);

-- Create recipient table
CREATE TABLE recipient (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES message(id) ON DELETE CASCADE,
    phone VARCHAR(50) NOT NULL, -- Store phone numbers as VARCHAR to accommodate various formats
    index SMALLINT NOT NULL, -- This is the used for persisting the order of the recipients of a message
    UNIQUE (message_id, phone) -- Ensure a phone number can only be added once per message. This is not an actual field in the table, but it will make sure that there are no recipients with duplicate links
);

-- Insert a scheduled message for testing:
-- INSERT INTO "message" (
--     user_id,
--     sender,
--     subject,
--     body,
--     send_time,
--     status,
--     in_trash,
--     api_error_code,
--     api_error_details_json
-- ) VALUES (
--     1,
--     'john.doe@example.com',
--     'Meeting Reminder at 2pm',
--     'Don"t forget about the meeting tomorrow at 14 AM.',
--     NOW(),
--     'SENT',
--     false,
--     NULL,
--     NULL
-- );
