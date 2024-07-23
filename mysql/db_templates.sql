-- Inserisci tre nuovi partner
INSERT INTO partners (partner_id, partner_name, partner_type, latitude, longitude, address, email, count_bike, profile_pic)
VALUES 
('3397a676-3b87-11ef-9df2-a4bfcecd978d', 'Hotel Bella Vista', 'hotel', 40.851798, 14.268120, 'Via Toledo, 323, 80134 Napoli NA, Italia', 'info@hotelbellavista.it', 1, 'rosso.jpg'),
('3397ab8a-3b87-11ef-9df2-a4bfcecd978d', 'Ristorante La Pergola', 'ristorante', 40.851224, 14.263697, 'Via Chiaia, 216, 80121 Napoli NA, Italia', 'info@ristorantelapergola.it', 1, 'giallo.jpg'),
('3397ac98-3b87-11ef-9df2-a4bfcecd978d', 'Altro', 'altro', 40.846760, 14.256930, 'Via Santa Lucia, 17, 80132 Napoli NA, Italia', 'info@altro.it', 1, 'verde.jpg');

-- Inserisci tre nuove bici associate ai partner
INSERT INTO bikes (bike_id, bike_type, battery_level, latitude, longitude, partner_id, state, count_run)
VALUES 
('3398d99c-3b87-11ef-9df2-a4bfcecd978d', 'City Bike Elettrica', 80, 45.464200, 9.191370, '3397a676-3b87-11ef-9df2-a4bfcecd978d', 'disponibile', 0),
('3398a3e6-3b87-11ef-9df2-a4bfcecd978d', 'Mtb Elettrica', 75, 45.465400, 9.192580, '3397ab8a-3b87-11ef-9df2-a4bfcecd978d', 'disponibile', 0),
('3398a5f8-3b87-11ef-9df2-a4bfcecd978d', 'Pieghevole Elettrica', 90, 45.463000, 9.190160, '3397ac98-3b87-11ef-9df2-a4bfcecd978d', 'disponibile', 0);

-- Inserisci altre bici associate ai partner
INSERT INTO bikes (bike_id, bike_type, battery_level, latitude, longitude, partner_id, state, count_run)
VALUES 
(UUID(), 'City Bike Elettrica', 85, 45.464210, 9.191375, '3397a676-3b87-11ef-9df2-a4bfcecd978d', 'disponibile', 0),
(UUID(), 'Mtb Elettrica', 70, 45.465410, 9.192585, '3397ab8a-3b87-11ef-9df2-a4bfcecd978d', 'disponibile', 0),
(UUID(), 'Pieghevole Elettrica', 95, 45.463010, 9.190165, '3397ac98-3b87-11ef-9df2-a4bfcecd978d', 'disponibile', 0),
(UUID(), 'Bici Da Città', 90, 45.464215, 9.191380, '3397a676-3b87-11ef-9df2-a4bfcecd978d', 'disponibile', 0),
(UUID(), 'Bici Per Bambini', 75, 45.465415, 9.192590, '3397ab8a-3b87-11ef-9df2-a4bfcecd978d', 'disponibile', 0),
(UUID(), 'Mountain Bike', 80, 45.463015, 9.190170, '3397ac98-3b87-11ef-9df2-a4bfcecd978d', 'disponibile', 0);

-- Aggiorna il conteggio delle bici per ciascun partner
UPDATE partners
SET count_bike = (
  SELECT COUNT(*)
  FROM bikes
  WHERE bikes.partner_id = partners.partner_id
)
WHERE partner_name = 'Hotel Bella Vista';

UPDATE partners
SET count_bike = (
  SELECT COUNT(*)
  FROM bikes
  WHERE bikes.partner_id = partners.partner_id
)
WHERE partner_name = 'Ristorante La Pergola';

UPDATE partners
SET count_bike = (
  SELECT COUNT(*)
  FROM bikes
  WHERE bikes.partner_id = partners.partner_id
)
WHERE partner_name = 'Altro';

-- Inserisci tre nuovi utenti
INSERT INTO users (user_id, username, email, first_name, last_name, password)
VALUES 
('b011b132-3ef8-11ef-9df2-a4bfcecd978d', 'mario.rossi', 'mario.rossi@example.com', 'Mario', 'Rossi', 'password123'),
('b011b51a-3ef8-11ef-9df2-a4bfcecd978d', 'luigi.bianchi', 'luigi.bianchi@example.com', 'Luigi', 'Bianchi', 'password456'),
('b011b646-3ef8-11ef-9df2-a4bfcecd978d', 'anna.verdi', 'anna.verdi@example.com', 'Anna', 'Verdi', 'password789');

-- Inserisci tre nuovi admin
INSERT INTO admin (username, password) VALUES 
('admin1', 'password1'),
('admin2', 'password2'),
('admin3', 'password3');

-- Inserisci i partner nella tabella partner_auth rispettando gli UUID esistenti
INSERT INTO partner_auth (uuid, username, password) VALUES 
('3397a676-3b87-11ef-9df2-a4bfcecd978d', 'HotelBellaVista', 'password1'),
('3397ab8a-3b87-11ef-9df2-a4bfcecd978d', 'RistoranteLaPergola', 'password2'),
('3397ac98-3b87-11ef-9df2-a4bfcecd978d', 'Altro', 'password3');

-- Inserisci delle nuove prenotazioni con la data di scadenza calcolata
INSERT INTO reservations (reservation_id, user_id, bike_id, reservation_date, expiration_date, status)
VALUES 
(UUID(), 'b011b132-3ef8-11ef-9df2-a4bfcecd978d', '3398d99c-3b87-11ef-9df2-a4bfcecd978d', CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 MINUTE), 'active'),
(UUID(), 'b011b51a-3ef8-11ef-9df2-a4bfcecd978d', '3398a3e6-3b87-11ef-9df2-a4bfcecd978d', CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 MINUTE), 'active'),
(UUID(), 'b011b646-3ef8-11ef-9df2-a4bfcecd978d', '3398a5f8-3b87-11ef-9df2-a4bfcecd978d', CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 MINUTE), 'active');

-- Inserisci dei nuovi noleggi e aggiorna il campo count_run
-- Primo noleggio
INSERT INTO rentals (rental_id, user_id, bike_id, rental_type, rental_start, rental_end, amount)
VALUES (UUID(), 'b011b132-3ef8-11ef-9df2-a4bfcecd978d', '3398d99c-3b87-11ef-9df2-a4bfcecd978d', 'hourly', CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 HOUR), 10.00);
UPDATE bikes SET count_run = count_run + 1 WHERE bike_id = '3398d99c-3b87-11ef-9df2-a4bfcecd978d';

-- Secondo noleggio
INSERT INTO rentals (rental_id, user_id, bike_id, rental_type, rental_start, rental_end, amount)
VALUES (UUID(), 'b011b51a-3ef8-11ef-9df2-a4bfcecd978d', '3398a3e6-3b87-11ef-9df2-a4bfcecd978d', 'daily', CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY), 20.00);
UPDATE bikes SET count_run = count_run + 1 WHERE bike_id = '3398a3e6-3b87-11ef-9df2-a4bfcecd978d';

-- Terzo noleggio
INSERT INTO rentals (rental_id, user_id, bike_id, rental_type, rental_start, rental_end, amount)
VALUES (UUID(), 'b011b646-3ef8-11ef-9df2-a4bfcecd978d', '3398a5f8-3b87-11ef-9df2-a4bfcecd978d', 'weekly', CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 WEEK), 50.00);
UPDATE bikes SET count_run = count_run + 1 WHERE bike_id = '3398a5f8-3b87-11ef-9df2-a4bfcecd978d';

-- Inserisci i pagamenti relativi ai noleggi
-- Pagamento per il primo noleggio
INSERT INTO payments (payment_id, rental_id, user_id, amount, payment_method)
VALUES (
    UUID(), 
    (SELECT rental_id FROM rentals WHERE bike_id = '3398d99c-3b87-11ef-9df2-a4bfcecd978d' AND user_id = 'b011b132-3ef8-11ef-9df2-a4bfcecd978d' LIMIT 1), 
    'b011b132-3ef8-11ef-9df2-a4bfcecd978d', 
    10.00, 
    'credit_card'
);

-- Pagamento per il secondo noleggio
INSERT INTO payments (payment_id, rental_id, user_id, amount, payment_method)
VALUES (
    UUID(), 
    (SELECT rental_id FROM rentals WHERE bike_id = '3398a3e6-3b87-11ef-9df2-a4bfcecd978d' AND user_id = 'b011b51a-3ef8-11ef-9df2-a4bfcecd978d' LIMIT 1), 
    'b011b51a-3ef8-11ef-9df2-a4bfcecd978d', 
    20.00, 
    'paypal'
);

-- Pagamento per il terzo noleggio
INSERT INTO payments (payment_id, rental_id, user_id, amount, payment_method)
VALUES (
    UUID(), 
    (SELECT rental_id FROM rentals WHERE bike_id = '3398a5f8-3b87-11ef-9df2-a4bfcecd978d' AND user_id = 'b011b646-3ef8-11ef-9df2-a4bfcecd978d' LIMIT 1), 
    'b011b646-3ef8-11ef-9df2-a4bfcecd978d', 
    50.00, 
    'credit_card'
);
