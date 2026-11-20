CREATE DATABASE IF NOT EXISTS ucu_lost_found;
USE ucu_lost_found;

-- Rebuild these tables so the script can be run again safely
DROP TABLE IF EXISTS claims;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS revoked_tokens;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporter_id INT NOT NULL,
  type ENUM('lost','found') NOT NULL,
  title VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  public_description TEXT NOT NULL,
  campus_location VARCHAR(100) NOT NULL,
  event_date DATE NOT NULL,
  image_url VARCHAR(255) NULL,
  private_details TEXT NULL,          -- found items only; reporter and admin see it
  status ENUM('open','returned') NOT NULL DEFAULT 'open',
  returned_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id),
  INDEX idx_type_status (type, status),
  INDEX idx_category (category),
  INDEX idx_location (campus_location),
  INDEX idx_event_date (event_date)
);

CREATE TABLE claims (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  claimant_id INT NOT NULL,
  evidence TEXT NOT NULL,             -- private; claimant and admin only
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  admin_reason TEXT NULL,
  decided_by INT NULL,
  decided_at TIMESTAMP NULL,
  collected_at TIMESTAMP NULL,        -- set when the admin confirms collection
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Holds the item id only while the claim is approved, otherwise NULL
  approved_item_id INT GENERATED ALWAYS AS (CASE WHEN status = 'approved' THEN item_id ELSE NULL END) STORED,
  UNIQUE KEY uq_one_approved_per_item (approved_item_id),
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (claimant_id) REFERENCES users(id),
  FOREIGN KEY (decided_by) REFERENCES users(id)
);

-- Used for real logout: a logged-out token is stored here and refused afterwards
CREATE TABLE revoked_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jti VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL
);

SHOW TABLES FROM ucu_lost_found;
