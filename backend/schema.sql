-- 최애의 포토 — TiDB / MySQL schema
-- Run once in TiDB SQL Editor or: npm run db:schema (with .env configured)

CREATE TABLE IF NOT EXISTS `user` (
  user_id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NULL,
  points INT NOT NULL DEFAULT 0,
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  upt_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uk_user_email (email),
  UNIQUE KEY uk_user_nickname (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS photo_card (
  photo_card_id INT NOT NULL AUTO_INCREMENT,
  creator_user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  genre VARCHAR(100) NOT NULL,
  grade VARCHAR(50) NOT NULL,
  min_price INT NOT NULL DEFAULT 0,
  total_supply INT NOT NULL DEFAULT 1,
  image_url VARCHAR(500) NULL,
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  upt_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (photo_card_id),
  KEY idx_photo_card_creator (creator_user_id),
  CONSTRAINT fk_photo_card_creator FOREIGN KEY (creator_user_id) REFERENCES `user` (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_card (
  user_card_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  photo_card_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  upt_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_card_id),
  UNIQUE KEY uk_user_photo_card (user_id, photo_card_id),
  KEY idx_user_card_user (user_id),
  KEY idx_user_card_photo (photo_card_id),
  CONSTRAINT fk_user_card_user FOREIGN KEY (user_id) REFERENCES `user` (user_id),
  CONSTRAINT fk_user_card_photo FOREIGN KEY (photo_card_id) REFERENCES photo_card (photo_card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS listing (
  listing_id INT NOT NULL AUTO_INCREMENT,
  user_card_id INT NOT NULL,
  seller_user_id INT NOT NULL,
  sale_type VARCHAR(30) NOT NULL DEFAULT 'SELL',
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  quantity INT NOT NULL,
  price_per_unit INT NOT NULL,
  desired_grade VARCHAR(50) NULL,
  desired_genre VARCHAR(100) NULL,
  desired_desc TEXT NULL,
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  upt_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (listing_id),
  KEY idx_listing_status (status),
  KEY idx_listing_seller (seller_user_id),
  KEY idx_listing_user_card (user_card_id),
  CONSTRAINT fk_listing_user_card FOREIGN KEY (user_card_id) REFERENCES user_card (user_card_id),
  CONSTRAINT fk_listing_seller FOREIGN KEY (seller_user_id) REFERENCES `user` (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS purchase (
  purchase_id INT NOT NULL AUTO_INCREMENT,
  buyer_user_id INT NOT NULL,
  listing_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price INT NOT NULL,
  total_price INT NOT NULL,
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (purchase_id),
  KEY idx_purchase_buyer (buyer_user_id),
  KEY idx_purchase_listing (listing_id),
  CONSTRAINT fk_purchase_buyer FOREIGN KEY (buyer_user_id) REFERENCES `user` (user_id),
  CONSTRAINT fk_purchase_listing FOREIGN KEY (listing_id) REFERENCES listing (listing_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS point_history (
  point_history_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  ref_entity_type VARCHAR(50) NULL,
  ref_entity_id INT NULL,
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (point_history_id),
  KEY idx_point_history_user (user_id),
  CONSTRAINT fk_point_history_user FOREIGN KEY (user_id) REFERENCES `user` (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS point_box_draw (
  point_box_draw_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  point_history_id INT NOT NULL,
  earned_points INT NOT NULL,
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (point_box_draw_id),
  KEY idx_point_box_draw_user (user_id),
  CONSTRAINT fk_point_box_draw_user FOREIGN KEY (user_id) REFERENCES `user` (user_id),
  CONSTRAINT fk_point_box_draw_history FOREIGN KEY (point_history_id) REFERENCES point_history (point_history_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
