INSERT INTO "user" (name, email, role, created_at, updated_at, first_name, last_name, lang, profile_color_id, display_name, dark_mode, primary_color_id)
VALUES
    ('Alice Johnson', 'alice@example.com', 'USER', NOW(), NOW(), 'Alice', 'Johnson', 'en', 1, 'Alice J.', false, 1),
    ('Bob Smith', 'bob@example.com', 'USER', NOW(), NOW(), 'Bob', 'Smith', 'en', 1, 'Bob S.', false, 1),
    ('Charlie Brown', 'charlie@example.com', 'ADMIN', NOW(), NOW(), 'Charlie', 'Brown', 'en', 1, 'Charlie B.', false, 1),
    ('David Wilson', 'david@example.com', 'USER', NOW(), NOW(), 'David', 'Wilson', 'pt', 1, 'David W.', false, 1),
    ('Eve Davis', 'eve@example.com', 'ADMIN', NOW(), NOW(), 'Eve', 'Davis', 'pt', 1, 'Eve D.', true, 1),
    ('Frank Miller', 'frank@example.com', 'USER', NOW(), NOW(), 'Frank', 'Miller', 'en', 1, 'Frank M.', false, 1),
    ('Grace Lee', 'grace@example.com', 'USER', NOW(), NOW(), 'Grace', 'Lee', 'en', 1, 'Grace L.', false, 1),
    ('Hank Green', 'hank@example.com', 'USER', NOW(), NOW(), 'Hank', 'Green', 'pt', 1, 'Hank G.', true, 1),
    ('Irene Taylor', 'irene@example.com', 'ADMIN', NOW(), NOW(), 'Irene', 'Taylor', 'en', 1, 'Irene T.', false, 1),
    ('Jack White', 'jack@example.com', 'USER', NOW(), NOW(), 'Jack', 'White', 'pt', 1, 'Jack W.', false, 1);
