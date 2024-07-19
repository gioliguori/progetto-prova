-- Crea la tabella "partners"
CREATE TABLE partners (
    partner_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),  -- UUID come ID univoco per ogni partner
    partner_name VARCHAR(100) NOT NULL,                -- Nome del partner
    partner_type ENUM('hotel', 'ristorante', 'altro') NOT NULL,  -- Tipo di partner
    latitude DECIMAL(10, 8),                           -- Latitudine
    longitude DECIMAL(11, 8),                          -- Longitudine
    count_bike INT DEFAULT 0                           -- Conteggio delle bici
);

-- Crea la tabella "bikes"
CREATE TABLE bikes (
    bike_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),     -- UUID come ID univoco per ogni bici
    bike_type VARCHAR(100) NOT NULL,                   -- Tipo di bici
    battery_level INT,                                 -- Livello della batteria
    latitude DECIMAL(10, 8),                           -- Latitudine
    longitude DECIMAL(11, 8),                          -- Longitudine
    partner_id CHAR(36),                               -- UUID del partner (chiave esterna)
    reserved ENUM('yes', 'no') DEFAULT 'no',           -- Stato di prenotazione
    count_run INT DEFAULT 0,                           -- Conteggio delle corse
    FOREIGN KEY (partner_id) REFERENCES partners(partner_id) -- Chiave esterna
);

-- Crea la tabella "users"
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),     -- UUID come ID univoco per ogni utente
    username VARCHAR(100) NOT NULL,                    -- Username dell'utente
    email VARCHAR(100) NOT NULL,                       -- Email dell'utente
    first_name VARCHAR(100) NOT NULL,                  -- Nome dell'utente
    last_name VARCHAR(100) NOT NULL,                   -- Cognome dell'utente
    password VARCHAR(100) NOT NULL,                    -- Password dell'utente
    profile_creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Data di creazione del profilo
);

-- Crea la tabella "admin"
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Crea la tabella "partner_auth"
CREATE TABLE partner_auth (
    uuid CHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Crea di nuovo la tabella "reservations" con una chiave primaria composta
CREATE TABLE reservations (
    reservation_id CHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID come ID univoco per ogni prenotazione
    user_id CHAR(36) NOT NULL,                           -- UUID dell'utente (chiave esterna)
    bike_id CHAR(36) NOT NULL,                           -- UUID della bici (chiave esterna)
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- Data di prenotazione
    expiration_date TIMESTAMP,                           -- Data di scadenza della prenotazione
    status ENUM('active', 'cancelled') DEFAULT 'active', -- Stato della prenotazione
    UNIQUE (user_id, bike_id),                           -- Chiave unica composta
    FOREIGN KEY (user_id) REFERENCES users(user_id),     -- Chiave esterna
    FOREIGN KEY (bike_id) REFERENCES bikes(bike_id)      -- Chiave esterna
);
-- Crea il trigger per impostare la data di scadenza
DELIMITER $$

CREATE TRIGGER set_expiration_date
BEFORE INSERT ON reservations
FOR EACH ROW
BEGIN
  SET NEW.expiration_date = DATE_ADD(NEW.reservation_date, INTERVAL 15 MINUTE);
END$$

DELIMITER ;

-- Crea la procedura per aggiornare lo stato delle prenotazioni scadute
DELIMITER //

CREATE PROCEDURE expire_reservations()
BEGIN
  UPDATE reservations
  SET status = 'cancelled'
  WHERE status = 'active'
    AND expiration_date <= NOW();
END//

DELIMITER ;


-- Crea la tabella "rentals"
CREATE TABLE rentals (
    rental_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),       -- UUID come ID univoco per ogni noleggio
    user_id CHAR(36) NOT NULL,                             -- UUID dell'utente che ha noleggiato la bici
    bike_id CHAR(36) NOT NULL,                             -- UUID della bici noleggiata
    rental_type ENUM('hourly', 'daily', 'weekly') NOT NULL, -- Tipo di noleggio
    rental_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Data e ora di inizio del noleggio
    rental_end TIMESTAMP,                                  -- Data e ora di fine del noleggio
    amount DECIMAL(10, 2) NOT NULL,                        -- Importo del noleggio
    FOREIGN KEY (user_id, bike_id) REFERENCES reservations(user_id, bike_id) -- Chiave esterna composta
);

-- Crea la tabella "payments"
CREATE TABLE payments (
    payment_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),      -- UUID come ID univoco per ogni pagamento
    rental_id CHAR(36) NOT NULL,                           -- UUID del noleggio associato al pagamento
    user_id CHAR(36) NOT NULL,                             -- UUID dell'utente che ha effettuato il pagamento
    amount DECIMAL(10, 2) NOT NULL,                        -- Importo del pagamento
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Data e ora del pagamento
    payment_method ENUM('credit_card', 'paypal', 'other') NOT NULL,  -- Metodo di pagamento
    FOREIGN KEY (rental_id) REFERENCES rentals(rental_id), -- Chiave esterna verso la tabella rentals
    FOREIGN KEY (user_id) REFERENCES users(user_id)        -- Chiave esterna verso la tabella users
);
