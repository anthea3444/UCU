USE ucu_lost_found;

-- Fictional accounts (passwords are stored as bcrypt hashes)
INSERT IGNORE INTO users (full_name, email, password_hash, role) VALUES
('Admin Lost and Found', 'admin@ucu.ac.ug', '$2b$10$VixRCnthp7dDiId4wn.3zuWxHW5mjuQSAVNMyeBpYmXF7frDBkoxi', 'admin'),
('Okello Daniel',        'okello@ucu.ac.ug',   '$2b$10$RK/o8PKvF3ky5EVvVSqumOgX/8Uffdms2ZVjMAzmD6u9k7yiADffS', 'student'),
('Namusoke Grace',       'namusoke@ucu.ac.ug', '$2b$10$RK/o8PKvF3ky5EVvVSqumOgX/8Uffdms2ZVjMAzmD6u9k7yiADffS', 'student');

-- Fictional reports
INSERT INTO items (reporter_id, type, title, category, public_description, campus_location, event_date, private_details, status, returned_at)
VALUES
((SELECT id FROM users WHERE email='namusoke@ucu.ac.ug'), 'found', 'Set of keys with blue keyring', 'Keys',
 'Found under a chair after the Health and Wholeness lecture.', 'N5B', '2026-11-18',
 'Small inscription on the back of the keyring.', 'open', NULL),
((SELECT id FROM users WHERE email='okello@ucu.ac.ug'), 'lost', 'Black laptop charger', 'Electronics',
 'Lost somewhere between the library and the restaurant.', 'Hamu Mukasa Library', '2026-11-18',
 NULL, 'open', NULL),
((SELECT id FROM users WHERE email='namusoke@ucu.ac.ug'), 'found', 'Green water bottle', 'Other',
 'Found on a bench outside the main hall.', 'Main Hall', '2026-11-15',
 'Sticker of a mountain on the bottom.', 'returned', '2026-11-17 14:00:00');

-- Fictional claims
INSERT INTO claims (item_id, claimant_id, evidence, status)
VALUES
((SELECT id FROM items WHERE title='Set of keys with blue keyring'),
 (SELECT id FROM users WHERE email='okello@ucu.ac.ug'),
 'The back of the keyring has the letters DO scratched into it.', 'pending');

INSERT INTO claims (item_id, claimant_id, evidence, status, admin_reason, decided_by, decided_at, collected_at)
VALUES
((SELECT id FROM items WHERE title='Green water bottle'),
 (SELECT id FROM users WHERE email='okello@ucu.ac.ug'),
 'There is a mountain sticker under the bottle.', 'approved',
 'Evidence matches the private details.',
 (SELECT id FROM users WHERE email='admin@ucu.ac.ug'),
 '2026-11-16 10:00:00', '2026-11-17 14:00:00');


 SELECT id, email, role FROM ucu_lost_found.users;
SELECT id, type, title, status FROM ucu_lost_found.items;
SELECT id, item_id, status FROM ucu_lost_found.claims;