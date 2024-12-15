
-- INSERTS NOT EXECUTED YET
-- Seed Users Table
INSERT INTO Users (email, password_hash, created_at, updated_at) VALUES
('user1@example.com', 'hashed_password_1', NOW(), NOW()),
('user2@example.com', 'hashed_password_2', NOW(), NOW()),
('user3@example.com', 'hashed_password_3', NOW(), NOW());

-- Seed Contacts Table
INSERT INTO Contacts (user_id, name, email, phone, address, created_at, updated_at) VALUES
(1, 'Contact One', 'contact1@example.com', '123-456-7890', '123 Main St, City, Country', NOW(), NOW()),
(1, 'Contact Two', 'contact2@example.com', NULL, NULL, NOW(), NOW()),
(2, 'Contact Three', 'contact3@example.com', '987-654-3210', '456 Elm St, City, Country', NOW(), NOW()),
(3, 'Contact Four', 'contact4@example.com', '555-555-5555', '789 Oak St, City, Country', NOW(), NOW());

-- Seed Emails Table
INSERT INTO Emails (user_id, subject, body, created_at, updated_at, status, location, scheduled_time, failure_reason) VALUES
(1, 'Hello from User 1', 'This is a test email body for user 1.', NOW(), NOW(), 'sent', 'inbox', NULL, NULL),
(1, 'Scheduled Email', 'This email is scheduled.', NOW(), NOW(), 'scheduled', 'draft', NOW() + INTERVAL '1 day', NULL),
(2, 'Failed Email', 'This email failed to send.', NOW(), NOW(), 'failed', 'trash', NULL, 'Network error'),
(3, 'Greetings from User 3', 'Just checking in!', NOW(), NOW(), 'sent', 'inbox', NULL, NULL);

-- Seed Recipients Table
INSERT INTO Recipients (email_id, contact_id, recipient_email, is_cc, is_bcc) VALUES
(1, 1, NULL, FALSE, FALSE),  -- Recipient is a contact
(1, NULL, 'recipient1@example.com', TRUE, FALSE),  -- CC recipient not in contacts
(2, 2, NULL, FALSE, TRUE),  -- BCC recipient is a contact
(3, 3, NULL, FALSE, FALSE),  -- Recipient is a contact
(4, NULL, 'recipient2@example.com', FALSE, TRUE);  -- BCC recipient not in contacts

-- Seed Attachments Table
INSERT INTO Attachments (email_id, file_name, file_path, file_size, created_at) VALUES
(1, 'attachment1.pdf', '/path/to/attachment1.pdf', 2048, NOW()),
(2, 'attachment2.jpg', '/path/to/attachment2.jpg', 1024, NOW()),
(3, 'attachment3.docx', '/path/to/
