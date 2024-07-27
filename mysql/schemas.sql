-- Crea la tabella "partners"
CREATE TABLE partners (
    partner_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),  -- UUID come ID univoco per ogni partner
    partner_name VARCHAR(100) NOT NULL,                -- Nome del partner
    partner_type ENUM('hotel', 'ristorante', 'altro') NOT NULL,  -- Tipo di partner
    latitude DECIMAL(10, 8),                           -- Latitudine
    longitude DECIMAL(11, 8),                          -- Longitudine
    address VARCHAR(255),                              -- Indirizzo
    email VARCHAR(100) NOT NULL,                       -- Email del partner
    count_bike INT DEFAULT 0,                          -- Conteggio delle bici
    profile_pic VARCHAR(255),                          -- Percorso dell'immagine del profilo
    is_deleted BOOLEAN DEFAULT FALSE                   -- Cancellazione logica
);



-- Crea la tabella "bikes"
CREATE TABLE bikes (
    bike_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    bike_type ENUM('City Bike Elettrica', 'Mtb Elettrica', 'Pieghevole Elettrica', 'Bici Da Città', 'Bici Per Bambini', 'Mountain Bike') NOT NULL,
    battery_level INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    partner_id CHAR(36),
    state ENUM('disponibile', 'in noleggio', 'riservata', 'dismessa') DEFAULT 'disponibile',
    count_run INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    bike_id_partner INT,
    FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
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
    password VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE                   -- Cancellazione logica
);

-- Crea la tabella "reservations"
CREATE TABLE reservations (
    reservation_id CHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID come ID univoco per ogni prenotazione
    user_id CHAR(36) NOT NULL,                           -- UUID dell'utente (chiave esterna)
    bike_id CHAR(36) NOT NULL,                           -- UUID della bici (chiave esterna)
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- Data di prenotazione
    expiration_date TIMESTAMP,                           -- Data di scadenza della prenotazione
    status ENUM('active', 'expired') DEFAULT 'active', -- Stato della prenotazione
    FOREIGN KEY (user_id) REFERENCES users(user_id),     -- Chiave esterna
    FOREIGN KEY (bike_id) REFERENCES bikes(bike_id)      -- Chiave esterna
);

-- Abilita l'event scheduler
SET GLOBAL event_scheduler = ON;

-- Crea l'evento per annullare le prenotazioni scadute e aggiornare lo stato della bici
CREATE EVENT IF NOT EXISTS expire_reservations_event
ON SCHEDULE EVERY 1 MINUTE
DO
  BEGIN
    -- Aggiorna lo stato delle prenotazioni a 'expired'
    UPDATE reservations
    SET status = 'expired'
    WHERE status = 'active'
      AND expiration_date <= NOW();
    
    -- Aggiorna lo stato delle bici a 'disponibile'
    UPDATE bikes
    SET state = 'disponibile'
    WHERE bike_id IN (
      SELECT bike_id
      FROM reservations
      WHERE status = 'expired'
        AND expiration_date <= NOW()
    );
  END;

-- Crea la tabella "rentals"
CREATE TABLE rentals (
    rental_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),       -- UUID come ID univoco per ogni noleggio
    user_id CHAR(36) NOT NULL,                             -- UUID dell'utente che ha noleggiato la bici
    bike_id CHAR(36) NOT NULL,                             -- UUID della bici noleggiata
    rental_type ENUM('hourly', 'daily', 'weekly') NOT NULL,-- Tipo di noleggio
    rental_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Data e ora di inizio del noleggio
    rental_end TIMESTAMP,                                  -- Data e ora di fine del noleggio
    amount DECIMAL(10, 2) NOT NULL,                        -- Importo del noleggio
    reservation_id CHAR(36),                               -- UUID della prenotazione (opzionale)
    FOREIGN KEY (user_id) REFERENCES users(user_id),       -- Chiave esterna verso la tabella users
    FOREIGN KEY (bike_id) REFERENCES bikes(bike_id),       -- Chiave esterna verso la tabella bikes
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) -- Chiave esterna verso la tabella reservations
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