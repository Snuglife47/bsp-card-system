-- ============================================
-- BSP Card System — Seed Data
-- Run AFTER schema.sql and AFTER creating Auth users
-- ============================================
-- NOTE: The 4 auth users must be created first in Supabase Auth dashboard
-- with password 'bsp2024', then their UUIDs inserted here.
-- For now, users table inserts are done via a separate step after auth user creation.

-- 38 Customers
INSERT INTO customers (id, cif, name, company_org, phone, email, branch_code) VALUES
('c0000001-0000-0000-0000-000000000001', '0100211', 'Mary Vele', 'Highlands Coffee Ltd', '+675 7078 0918', 'mary.vele@example.com', '968'),
('c0000001-0000-0000-0000-000000000002', '0104848', 'Grace Sioni', 'Pacific Logistics', '+675 7215 4747', 'grace.sioni@example.com', '943'),
('c0000001-0000-0000-0000-000000000003', '0109485', 'Peter Aila', 'Moresby Hardware', '+675 7352 8576', 'peter.aila@example.com', '970'),
('c0000001-0000-0000-0000-000000000004', '0114122', 'Naomi Kepas', 'Niugini Foods', '+675 7489 2405', 'naomi.kepas@example.com', '951'),
('c0000001-0000-0000-0000-000000000005', '0118759', 'Samuel Jim', 'Coral Sea Traders', '+675 7626 6234', 'samuel.jim@example.com', '968'),
('c0000001-0000-0000-0000-000000000006', '0123396', 'Esther Lua', 'Westpac Plumbing', '+675 7763 0063', '', '943'),
('c0000001-0000-0000-0000-000000000007', '0128033', 'Daniel Wandi', 'Star Mountain Supplies', '+675 7900 3892', 'daniel.wandi@example.com', '970'),
('c0000001-0000-0000-0000-000000000008', '0132670', 'Ruth Haroli', 'Gulf Fisheries', '+675 7037 7721', 'ruth.haroli@example.com', '951'),
('c0000001-0000-0000-0000-000000000009', '0137307', 'Michael Joseph', 'Sepik Timber Co', '+675 7174 1550', 'michael.joseph@example.com', '968'),
('c0000001-0000-0000-0000-000000000010', '0141944', 'Linda Pupu', 'Kokoda Tours', '+675 7311 5379', 'linda.pupu@example.com', '943'),
('c0000001-0000-0000-0000-000000000011', '0146581', 'David Akop', 'Bilum Textiles', '+675 7448 9208', 'david.akop@example.com', '970'),
('c0000001-0000-0000-0000-000000000012', '0151218', 'Sarah Mendoza', 'Self-employed', '+675 7585 3037', '', '951'),
('c0000001-0000-0000-0000-000000000013', '0155855', 'John Chua', 'Highlands Coffee Ltd', '+675 7722 6866', 'john.chua@example.com', '968'),
('c0000001-0000-0000-0000-000000000014', '0160492', 'Hannah Lin', 'Pacific Logistics', '+675 7859 0695', 'hannah.lin@example.com', '943'),
('c0000001-0000-0000-0000-000000000015', '0165129', 'Paul Chen', 'Moresby Hardware', '+675 7996 4524', 'paul.chen@example.com', '970'),
('c0000001-0000-0000-0000-000000000016', '0169766', 'Rachel Zhou', 'Niugini Foods', '+675 7133 8353', 'rachel.zhou@example.com', '951'),
('c0000001-0000-0000-0000-000000000017', '0174403', 'Simon Reddy', 'Coral Sea Traders', '+675 7270 2182', 'simon.reddy@example.com', '968'),
('c0000001-0000-0000-0000-000000000018', '0179040', 'Lydia Perera', 'Westpac Plumbing', '+675 7407 6011', '', '943'),
('c0000001-0000-0000-0000-000000000019', '0183677', 'Wei Mishra', 'Star Mountain Supplies', '+675 7544 9840', 'wei.mishra@example.com', '970'),
('c0000001-0000-0000-0000-000000000020', '0188314', 'Mei Bene', 'Gulf Fisheries', '+675 7681 3669', 'mei.bene@example.com', '951'),
('c0000001-0000-0000-0000-000000000021', '0192951', 'Raj Kapi', 'Sepik Timber Co', '+675 7818 7498', 'raj.kapi@example.com', '968'),
('c0000001-0000-0000-0000-000000000022', '0197588', 'Priya Lae', 'Kokoda Tours', '+675 7955 1327', 'priya.lae@example.com', '943'),
('c0000001-0000-0000-0000-000000000023', '0102225', 'Tomu Kome', 'Bilum Textiles', '+675 7092 5156', 'tomu.kome@example.com', '970'),
('c0000001-0000-0000-0000-000000000024', '0106862', 'Kila Hetra', 'Self-employed', '+675 7229 8985', '', '951'),
('c0000001-0000-0000-0000-000000000025', '0111499', 'Bani Daroya', 'Highlands Coffee Ltd', '+675 7366 2814', 'bani.daroya@example.com', '202'),
('c0000001-0000-0000-0000-000000000026', '0116136', 'Dimo Gonzales', 'Pacific Logistics', '+675 7503 6643', 'dimo.gonzales@example.com', '307'),
('c0000001-0000-0000-0000-000000000027', '0120773', 'Sione Awasa', 'Moresby Hardware', '+675 7640 0472', 'sione.awasa@example.com', '950'),
('c0000001-0000-0000-0000-000000000028', '0125410', 'Vani Kala', 'Niugini Foods', '+675 7777 4301', 'vani.kala@example.com', '951'),
('c0000001-0000-0000-0000-000000000029', '0130047', 'Elias Toua', 'Coral Sea Traders', '+675 7914 8130', 'elias.toua@example.com', '968'),
('c0000001-0000-0000-0000-000000000030', '0134684', 'Joyce Vele', 'Westpac Plumbing', '+675 7051 1959', '', '943'),
('c0000001-0000-0000-0000-000000000031', '0139321', 'Aaron Mek', 'Star Mountain Supplies', '+675 7188 5788', 'aaron.mek@example.com', '970'),
('c0000001-0000-0000-0000-000000000032', '0143958', 'Cynthia Sioni', 'Gulf Fisheries', '+675 7325 9617', 'cynthia.sioni@example.com', '951'),
('c0000001-0000-0000-0000-000000000033', '0148595', 'Lepa Aila', 'Sepik Timber Co', '+675 7462 3446', 'lepa.aila@example.com', '968'),
('c0000001-0000-0000-0000-000000000034', '0153232', 'Kesna Kepas', 'Kokoda Tours', '+675 7599 7275', 'kesna.kepas@example.com', '943'),
('c0000001-0000-0000-0000-000000000035', '0157869', 'Margaret Jim', 'Bilum Textiles', '+675 7736 1104', 'margaret.jim@example.com', '970'),
('c0000001-0000-0000-0000-000000000036', '0162506', 'Elape Lua', 'Self-employed', '+675 7873 4933', '', '951'),
('c0000001-0000-0000-0000-000000000037', '0167143', 'Anton Wandi', 'Highlands Coffee Ltd', '+675 7010 8762', 'anton.wandi@example.com', '202'),
('c0000001-0000-0000-0000-000000000038', '0171780', 'Mary Haroli', 'Pacific Logistics', '+675 7147 2591', 'mary.haroli@example.com', '307');

-- 38 Cards (status distribution matches Stage 0 seed)
INSERT INTO cards (id, customer_id, account_number, product, product_code, issuance_reason, access_card_applied, officer, card_status, notification_status, applied_date, ready_at, collected_at) VALUES
-- r=0: Ready, Not Notified
('d0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', '1000073958', 'BSP GOLD', '2012', 'green_to_gold', true, 'Tessa Aila', 'Ready', 'Not Notified', now() - interval '4 days', now() - interval '2 days', NULL),
-- r=1: Ready, Not Notified
('d0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', '1000147909', 'BSP FIRST', '2012', 'new_account', true, 'Boira Vele', 'Ready', 'Not Notified', now() - interval '5 days', now() - interval '3 days', NULL),
-- r=2: Ready, Not Notified
('d0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000003', '1000221860', 'BSP GOLD', '2012', 'replacement', true, 'Lina Toua', 'Ready', 'Not Notified', now() - interval '6 days', now() - interval '4 days', NULL),
-- r=3: Ready, Not Notified
('d0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000004', '1000295811', 'BSP FIRST', '2012', 'green_to_gold', true, 'Gabriel Mek', 'Ready', 'Not Notified', now() - interval '7 days', now() - interval '5 days', NULL),
-- r=4: Ready, Notified
('d0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', '1000369762', 'BSP PLATINUM', '2012', 'new_account', true, 'Ruth Sioni', 'Ready', 'Notified', now() - interval '8 days', now() - interval '6 days', NULL),
-- r=5: Ready, Notified
('d0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000006', '1000443713', 'BSP GOLD', '2012', 'replacement', true, 'Tessa Aila', 'Ready', 'Notified', now() - interval '9 days', now() - interval '7 days', NULL),
-- r=6: Ready, Reminded
('d0000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000007', '1000517664', 'BSP FIRST', '2012', 'green_to_gold', true, 'Boira Vele', 'Ready', 'Reminded', now() - interval '10 days', now() - interval '8 days', NULL),
-- r=7: Ready, Notified (will have failed SMS)
('d0000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000008', '1000591615', 'BSP GOLD', '2012', 'new_account', true, 'Lina Toua', 'Ready', 'Notified', now() - interval '11 days', now() - interval '9 days', NULL),
-- r=8: Collected, Notified
('d0000001-0000-0000-0000-000000000009', 'c0000001-0000-0000-0000-000000000009', '1000665566', 'BSP PLATINUM', '2012', 'replacement', true, 'Gabriel Mek', 'Collected', 'Notified', now() - interval '12 days', now() - interval '10 days', now() - interval '9 days'),
-- r=9: Collected, Notified
('d0000001-0000-0000-0000-000000000010', 'c0000001-0000-0000-0000-000000000010', '1000739517', 'BSP GOLD', '2012', 'green_to_gold', true, 'Ruth Sioni', 'Collected', 'Notified', now() - interval '13 days', now() - interval '11 days', now() - interval '10 days'),
-- r=10: Produced, Not Notified
('d0000001-0000-0000-0000-000000000011', 'c0000001-0000-0000-0000-000000000011', '1000813468', 'BSP FIRST', '2012', 'new_account', true, 'Tessa Aila', 'Produced', 'Not Notified', now() - interval '2 days', NULL, NULL),
-- r=11: Expired, Reminded
('d0000001-0000-0000-0000-000000000012', 'c0000001-0000-0000-0000-000000000012', '1000887419', 'BSP GOLD', '2012', 'replacement', true, 'Boira Vele', 'Expired', 'Reminded', now() - interval '54 days', now() - interval '52 days', NULL),
-- r=0: Ready, Not Notified
('d0000001-0000-0000-0000-000000000013', 'c0000001-0000-0000-0000-000000000013', '1000961370', 'BSP PLATINUM', '2012', 'green_to_gold', true, 'Lina Toua', 'Ready', 'Not Notified', now() - interval '16 days', now() - interval '14 days', NULL),
-- r=1: Ready, Not Notified
('d0000001-0000-0000-0000-000000000014', 'c0000001-0000-0000-0000-000000000014', '1001035321', 'BSP GOLD', '2012', 'new_account', true, 'Gabriel Mek', 'Ready', 'Not Notified', now() - interval '17 days', now() - interval '15 days', NULL),
-- r=2: Ready, Not Notified
('d0000001-0000-0000-0000-000000000015', 'c0000001-0000-0000-0000-000000000015', '1001109272', 'BSP FIRST', '2012', 'replacement', true, 'Ruth Sioni', 'Ready', 'Not Notified', now() - interval '18 days', now() - interval '16 days', NULL),
-- r=3: Ready, Not Notified
('d0000001-0000-0000-0000-000000000016', 'c0000001-0000-0000-0000-000000000016', '1001183223', 'BSP GOLD', '2012', 'green_to_gold', true, 'Tessa Aila', 'Ready', 'Not Notified', now() - interval '19 days', now() - interval '17 days', NULL),
-- r=4: Ready, Notified
('d0000001-0000-0000-0000-000000000017', 'c0000001-0000-0000-0000-000000000017', '1001257174', 'BSP PLATINUM', '2012', 'new_account', true, 'Boira Vele', 'Ready', 'Notified', now() - interval '20 days', now() - interval '18 days', NULL),
-- r=5: Ready, Notified
('d0000001-0000-0000-0000-000000000018', 'c0000001-0000-0000-0000-000000000018', '1001331125', 'BSP GOLD', '2012', 'replacement', true, 'Lina Toua', 'Ready', 'Notified', now() - interval '3 days', now() - interval '1 days', NULL),
-- r=6: Ready, Reminded
('d0000001-0000-0000-0000-000000000019', 'c0000001-0000-0000-0000-000000000019', '1001405076', 'BSP FIRST', '2012', 'green_to_gold', true, 'Gabriel Mek', 'Ready', 'Reminded', now() - interval '4 days', now() - interval '2 days', NULL),
-- r=7: Ready, Notified (failed)
('d0000001-0000-0000-0000-000000000020', 'c0000001-0000-0000-0000-000000000020', '1001479027', 'BSP GOLD', '2012', 'new_account', true, 'Ruth Sioni', 'Ready', 'Notified', now() - interval '5 days', now() - interval '3 days', NULL),
-- r=8: Collected
('d0000001-0000-0000-0000-000000000021', 'c0000001-0000-0000-0000-000000000021', '1001552978', 'BSP PLATINUM', '2012', 'replacement', true, 'Tessa Aila', 'Collected', 'Notified', now() - interval '6 days', now() - interval '4 days', now() - interval '3 days'),
-- r=9: Collected
('d0000001-0000-0000-0000-000000000022', 'c0000001-0000-0000-0000-000000000022', '1001626929', 'BSP GOLD', '2012', 'green_to_gold', true, 'Boira Vele', 'Collected', 'Notified', now() - interval '7 days', now() - interval '5 days', now() - interval '4 days'),
-- r=10: Produced
('d0000001-0000-0000-0000-000000000023', 'c0000001-0000-0000-0000-000000000023', '1001700880', 'BSP FIRST', '2012', 'new_account', true, 'Lina Toua', 'Produced', 'Not Notified', now() - interval '2 days', NULL, NULL),
-- r=11: Expired
('d0000001-0000-0000-0000-000000000024', 'c0000001-0000-0000-0000-000000000024', '1001774831', 'BSP GOLD', '2012', 'replacement', true, 'Gabriel Mek', 'Expired', 'Reminded', now() - interval '66 days', now() - interval '64 days', NULL),
-- r=0: Ready, Not Notified
('d0000001-0000-0000-0000-000000000025', 'c0000001-0000-0000-0000-000000000025', '1001848782', 'BSP PLATINUM', '2012', 'green_to_gold', true, 'Ruth Sioni', 'Ready', 'Not Notified', now() - interval '8 days', now() - interval '6 days', NULL),
-- r=1: Ready, Not Notified
('d0000001-0000-0000-0000-000000000026', 'c0000001-0000-0000-0000-000000000026', '1001922733', 'BSP GOLD', '2012', 'new_account', true, 'Tessa Aila', 'Ready', 'Not Notified', now() - interval '9 days', now() - interval '7 days', NULL),
-- r=2: Ready, Not Notified
('d0000001-0000-0000-0000-000000000027', 'c0000001-0000-0000-0000-000000000027', '1001996684', 'BSP FIRST', '2012', 'replacement', true, 'Boira Vele', 'Ready', 'Not Notified', now() - interval '10 days', now() - interval '8 days', NULL),
-- r=3: Ready, Not Notified
('d0000001-0000-0000-0000-000000000028', 'c0000001-0000-0000-0000-000000000028', '1002070635', 'BSP GOLD', '2012', 'green_to_gold', true, 'Lina Toua', 'Ready', 'Not Notified', now() - interval '11 days', now() - interval '9 days', NULL),
-- r=4: Ready, Notified
('d0000001-0000-0000-0000-000000000029', 'c0000001-0000-0000-0000-000000000029', '1002144586', 'BSP PLATINUM', '2012', 'new_account', true, 'Gabriel Mek', 'Ready', 'Notified', now() - interval '12 days', now() - interval '10 days', NULL),
-- r=5: Ready, Notified
('d0000001-0000-0000-0000-000000000030', 'c0000001-0000-0000-0000-000000000030', '1002218537', 'BSP GOLD', '2012', 'replacement', true, 'Ruth Sioni', 'Ready', 'Notified', now() - interval '13 days', now() - interval '11 days', NULL),
-- r=6: Ready, Reminded
('d0000001-0000-0000-0000-000000000031', 'c0000001-0000-0000-0000-000000000031', '1002292488', 'BSP FIRST', '2012', 'green_to_gold', true, 'Tessa Aila', 'Ready', 'Reminded', now() - interval '14 days', now() - interval '12 days', NULL),
-- r=7: Ready, Notified (failed)
('d0000001-0000-0000-0000-000000000032', 'c0000001-0000-0000-0000-000000000032', '1002366439', 'BSP GOLD', '2012', 'new_account', true, 'Boira Vele', 'Ready', 'Notified', now() - interval '15 days', now() - interval '13 days', NULL),
-- r=8: Collected
('d0000001-0000-0000-0000-000000000033', 'c0000001-0000-0000-0000-000000000033', '1002440390', 'BSP PLATINUM', '2012', 'replacement', true, 'Lina Toua', 'Collected', 'Notified', now() - interval '16 days', now() - interval '14 days', now() - interval '13 days'),
-- r=9: Collected
('d0000001-0000-0000-0000-000000000034', 'c0000001-0000-0000-0000-000000000034', '1002514341', 'BSP GOLD', '2012', 'green_to_gold', true, 'Gabriel Mek', 'Collected', 'Notified', now() - interval '17 days', now() - interval '15 days', now() - interval '14 days'),
-- r=10: Produced
('d0000001-0000-0000-0000-000000000035', 'c0000001-0000-0000-0000-000000000035', '1002588292', 'BSP FIRST', '2012', 'new_account', true, 'Ruth Sioni', 'Produced', 'Not Notified', now() - interval '2 days', NULL, NULL),
-- r=11: Expired
('d0000001-0000-0000-0000-000000000036', 'c0000001-0000-0000-0000-000000000036', '1002662243', 'BSP GOLD', '2012', 'replacement', true, 'Tessa Aila', 'Expired', 'Reminded', now() - interval '78 days', now() - interval '76 days', NULL),
-- r=0: Ready, Not Notified
('d0000001-0000-0000-0000-000000000037', 'c0000001-0000-0000-0000-000000000037', '1002736194', 'BSP PLATINUM', '2012', 'green_to_gold', true, 'Boira Vele', 'Ready', 'Not Notified', now() - interval '20 days', now() - interval '18 days', NULL),
-- r=1: Ready, Not Notified
('d0000001-0000-0000-0000-000000000038', 'c0000001-0000-0000-0000-000000000038', '1002810145', 'BSP GOLD', '2012', 'new_account', true, 'Lina Toua', 'Ready', 'Not Notified', now() - interval '21 days', now() - interval '19 days', NULL);

-- Notifications for notified/reminded/failed cards
INSERT INTO notifications (card_id, customer_id, channel, message, status, sent_at, created_by) VALUES
-- Card 5: Notified
('d0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', 'sms', 'Your BSP PLATINUM card is ready for collection at branch 968.', 'delivered', now() - interval '5 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Samuel Jim, Your BSP PLATINUM card is now ready.', 'delivered', now() - interval '5 days', 'Tessa Aila'),
-- Card 6: Notified (no email - phone only customer)
('d0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000006', 'sms', 'Your BSP GOLD card is ready for collection at branch 943.', 'delivered', now() - interval '6 days', 'Tessa Aila'),
-- Card 7: Reminded (SMS + reminder SMS)
('d0000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000007', 'sms', 'Your BSP FIRST card is ready for collection at branch 970.', 'delivered', now() - interval '7 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000007', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Daniel Wandi, Your BSP FIRST card is now ready.', 'delivered', now() - interval '7 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000007', 'sms', 'Reminder — your BSP FIRST card is still waiting at branch 970.', 'delivered', now() - interval '2 days', 'Tessa Aila'),
-- Card 8: Notified but SMS failed
('d0000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000008', 'sms', 'Your BSP GOLD card is ready for collection at branch 951.', 'failed', now() - interval '8 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000008', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Ruth Haroli, Your BSP GOLD card is now ready.', 'delivered', now() - interval '8 days', 'Tessa Aila'),
-- Card 9: Collected, was notified
('d0000001-0000-0000-0000-000000000009', 'c0000001-0000-0000-0000-000000000009', 'sms', 'Your BSP PLATINUM card is ready for collection at branch 968.', 'delivered', now() - interval '9 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000009', 'c0000001-0000-0000-0000-000000000009', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Michael Joseph, Your BSP PLATINUM card is now ready.', 'delivered', now() - interval '9 days', 'Tessa Aila'),
-- Card 10: Collected, was notified
('d0000001-0000-0000-0000-000000000010', 'c0000001-0000-0000-0000-000000000010', 'sms', 'Your BSP GOLD card is ready for collection at branch 943.', 'delivered', now() - interval '10 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000010', 'c0000001-0000-0000-0000-000000000010', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Linda Pupu, Your BSP GOLD card is now ready.', 'delivered', now() - interval '10 days', 'Tessa Aila'),
-- Card 12: Expired, was reminded
('d0000001-0000-0000-0000-000000000012', 'c0000001-0000-0000-0000-000000000012', 'sms', 'Your BSP GOLD card is ready for collection at branch 951.', 'delivered', now() - interval '51 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000012', 'c0000001-0000-0000-0000-000000000012', 'sms', 'Reminder — your BSP GOLD card is still waiting at branch 951.', 'delivered', now() - interval '46 days', 'Tessa Aila'),
-- Card 17: Notified
('d0000001-0000-0000-0000-000000000017', 'c0000001-0000-0000-0000-000000000017', 'sms', 'Your BSP PLATINUM card is ready for collection at branch 968.', 'delivered', now() - interval '17 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000017', 'c0000001-0000-0000-0000-000000000017', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Simon Reddy, Your BSP PLATINUM card is now ready.', 'delivered', now() - interval '17 days', 'Tessa Aila'),
-- Card 18: Notified (no email)
('d0000001-0000-0000-0000-000000000018', 'c0000001-0000-0000-0000-000000000018', 'sms', 'Your BSP GOLD card is ready for collection at branch 943.', 'delivered', now() - interval '0 days', 'Tessa Aila'),
-- Card 19: Reminded
('d0000001-0000-0000-0000-000000000019', 'c0000001-0000-0000-0000-000000000019', 'sms', 'Your BSP FIRST card is ready for collection at branch 970.', 'delivered', now() - interval '1 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000019', 'c0000001-0000-0000-0000-000000000019', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Wei Mishra, Your BSP FIRST card is now ready.', 'delivered', now() - interval '1 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000019', 'c0000001-0000-0000-0000-000000000019', 'sms', 'Reminder — your BSP FIRST card is still waiting at branch 970.', 'delivered', now() - interval '0 days', 'Tessa Aila'),
-- Card 20: Notified, failed SMS
('d0000001-0000-0000-0000-000000000020', 'c0000001-0000-0000-0000-000000000020', 'sms', 'Your BSP GOLD card is ready for collection at branch 951.', 'failed', now() - interval '2 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000020', 'c0000001-0000-0000-0000-000000000020', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Mei Bene, Your BSP GOLD card is now ready.', 'delivered', now() - interval '2 days', 'Tessa Aila'),
-- Card 21: Collected
('d0000001-0000-0000-0000-000000000021', 'c0000001-0000-0000-0000-000000000021', 'sms', 'Your BSP PLATINUM card is ready for collection at branch 968.', 'delivered', now() - interval '3 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000021', 'c0000001-0000-0000-0000-000000000021', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Raj Kapi, Your BSP PLATINUM card is now ready.', 'delivered', now() - interval '3 days', 'Tessa Aila'),
-- Card 22: Collected
('d0000001-0000-0000-0000-000000000022', 'c0000001-0000-0000-0000-000000000022', 'sms', 'Your BSP GOLD card is ready for collection at branch 943.', 'delivered', now() - interval '4 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000022', 'c0000001-0000-0000-0000-000000000022', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Priya Lae, Your BSP GOLD card is now ready.', 'delivered', now() - interval '4 days', 'Tessa Aila'),
-- Card 24: Expired, reminded
('d0000001-0000-0000-0000-000000000024', 'c0000001-0000-0000-0000-000000000024', 'sms', 'Your BSP GOLD card is ready for collection at branch 951.', 'delivered', now() - interval '63 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000024', 'c0000001-0000-0000-0000-000000000024', 'sms', 'Reminder — your BSP GOLD card is still waiting at branch 951.', 'delivered', now() - interval '58 days', 'Tessa Aila'),
-- Card 29: Notified
('d0000001-0000-0000-0000-000000000029', 'c0000001-0000-0000-0000-000000000029', 'sms', 'Your BSP PLATINUM card is ready for collection at branch 968.', 'delivered', now() - interval '9 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000029', 'c0000001-0000-0000-0000-000000000029', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Elias Toua, Your BSP PLATINUM card is now ready.', 'delivered', now() - interval '9 days', 'Tessa Aila'),
-- Card 30: Notified (no email)
('d0000001-0000-0000-0000-000000000030', 'c0000001-0000-0000-0000-000000000030', 'sms', 'Your BSP GOLD card is ready for collection at branch 943.', 'delivered', now() - interval '10 days', 'Tessa Aila'),
-- Card 31: Reminded
('d0000001-0000-0000-0000-000000000031', 'c0000001-0000-0000-0000-000000000031', 'sms', 'Your BSP FIRST card is ready for collection at branch 970.', 'delivered', now() - interval '11 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000031', 'c0000001-0000-0000-0000-000000000031', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Aaron Mek, Your BSP FIRST card is now ready.', 'delivered', now() - interval '11 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000031', 'c0000001-0000-0000-0000-000000000031', 'sms', 'Reminder — your BSP FIRST card is still waiting at branch 970.', 'delivered', now() - interval '6 days', 'Tessa Aila'),
-- Card 32: Notified, failed SMS
('d0000001-0000-0000-0000-000000000032', 'c0000001-0000-0000-0000-000000000032', 'sms', 'Your BSP GOLD card is ready for collection at branch 951.', 'failed', now() - interval '12 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000032', 'c0000001-0000-0000-0000-000000000032', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Cynthia Sioni, Your BSP GOLD card is now ready.', 'delivered', now() - interval '12 days', 'Tessa Aila'),
-- Card 33: Collected
('d0000001-0000-0000-0000-000000000033', 'c0000001-0000-0000-0000-000000000033', 'sms', 'Your BSP PLATINUM card is ready for collection at branch 968.', 'delivered', now() - interval '13 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000033', 'c0000001-0000-0000-0000-000000000033', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Lepa Aila, Your BSP PLATINUM card is now ready.', 'delivered', now() - interval '13 days', 'Tessa Aila'),
-- Card 34: Collected
('d0000001-0000-0000-0000-000000000034', 'c0000001-0000-0000-0000-000000000034', 'sms', 'Your BSP GOLD card is ready for collection at branch 943.', 'delivered', now() - interval '14 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000034', 'c0000001-0000-0000-0000-000000000034', 'email', 'Your BSP Card Is Ready for Collection\n\nDear Kesna Kepas, Your BSP GOLD card is now ready.', 'delivered', now() - interval '14 days', 'Tessa Aila'),
-- Card 36: Expired, reminded
('d0000001-0000-0000-0000-000000000036', 'c0000001-0000-0000-0000-000000000036', 'sms', 'Your BSP GOLD card is ready for collection at branch 951.', 'delivered', now() - interval '75 days', 'Tessa Aila'),
('d0000001-0000-0000-0000-000000000036', 'c0000001-0000-0000-0000-000000000036', 'sms', 'Reminder — your BSP GOLD card is still waiting at branch 951.', 'delivered', now() - interval '70 days', 'Tessa Aila');

-- Initial audit entry
INSERT INTO audit_logs (user_name, action, entity, entity_id, detail) VALUES
('System', 'Demo data initialised', 'system', '-', '38 customers, 38 cards seeded');
