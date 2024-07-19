
-- Inserisci tre nuovi partner
INSERT INTO partners (partner_id, partner_name, partner_type, latitude, longitude, count_bike)
VALUES (UUID(), 'Hotel Bella Vista', 'hotel', 45.464211, 9.191383, 1),
       (UUID(), 'Ristorante La Pergola', 'ristorante', 45.465421, 9.192593, 1),
       (UUID(), 'Altro', 'altro', 45.463001, 9.190173, 1);

-- Inserisci tre nuove bici associate ai partner
INSERT INTO bikes (bike_id, bike_type, battery_level, latitude, longitude, partner_id, reserved, count_run)
VALUES (UUID(), 'Electric Bike', 80, 45.464200, 9.191370, 
        (SELECT partner_id FROM partners WHERE partner_name = 'Hotel Bella Vista'), 'no', 0),
       (UUID(), 'Mountain Bike', 75, 45.465400, 9.192580, 
        (SELECT partner_id FROM partners WHERE partner_name = 'Ristorante La Pergola'), 'no', 0),
       (UUID(), 'Road Bike', 90, 45.463000, 9.190160, 
        (SELECT partner_id FROM partners WHERE partner_name = 'Altro'), 'no', 0);


-- Inserisci tre nuovi utenti
INSERT INTO users (user_id, username, email, first_name, last_name, password)
VALUES (UUID(), 'mario.rossi', 'mario.rossi@example.com', 'Mario', 'Rossi', 'password123'),
       (UUID(), 'luigi.bianchi', 'luigi.bianchi@example.com', 'Luigi', 'Bianchi', 'password456'),
       (UUID(), 'anna.verdi', 'anna.verdi@example.com', 'Anna', 'Verdi', 'password789');

       
INSERT INTO admin (username, password) VALUES 
('admin1', 'password1'),
('admin2', 'password2'),
('admin3', 'password3');

-- Inserisci tre nuovi partner nella tabella partner_auth rispettando gli UUID
-- Inserisci i partner nella tabella partner_auth rispettando gli UUID esistenti
INSERT INTO partner_auth (uuid, username, password) VALUES 
('3397a676-3b87-11ef-9df2-a4bfcecd978d', 'HotelBellaVista', 'password1'),
('3397ab8a-3b87-11ef-9df2-a4bfcecd978d', 'RistoranteLaPergola', 'password2'),
('3397ac98-3b87-11ef-9df2-a4bfcecd978d', 'Altro', 'password3');
