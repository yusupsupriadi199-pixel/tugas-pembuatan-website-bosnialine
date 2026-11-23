CREATE DATABASE IF NOT EXISTS bosnialine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bosnialine;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  addresses JSON NOT NULL DEFAULT '[]',
  avatar TEXT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price BIGINT NOT NULL,
  original_price BIGINT NOT NULL,
  discount INT NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  reviews INT NOT NULL DEFAULT 0,
  sold INT NOT NULL DEFAULT 0,
  image VARCHAR(512) NOT NULL,
  images JSON NOT NULL,
  specs TEXT NOT NULL,
  weight INT NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  badge VARCHAR(50) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL UNIQUE,
  invoice_number VARCHAR(100) NOT NULL,
  user_id INT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  note TEXT NULL,
  shipping_method VARCHAR(100) NOT NULL,
  shipping_label VARCHAR(255) NOT NULL,
  shipping_eta VARCHAR(100) NOT NULL,
  shipping_cost BIGINT NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  subtotal BIGINT NOT NULL,
  total_amount BIGINT NOT NULL,
  total_weight INT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL,
  product_id INT NULL,
  product_name VARCHAR(255) NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  price BIGINT NOT NULL,
  weight INT NOT NULL DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contoh data awal produk
INSERT INTO products (name, category, price, original_price, discount, rating, reviews, sold, image, images, specs, weight, description, badge, stock)
VALUES
('Laptop ASUS VivoBook 15', 'laptop', 8500000, 9500000, 11, 4.7, 234, 1200, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600','https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600','https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600'), 'Intel Core i5-1235U | RAM 8GB DDR4 | SSD 512GB | 15.6" FHD | Windows 11', 1500, 'Laptop tipis dan ringan cocok untuk kerja dan kuliah. Performa tinggi dengan prosesor Intel generasi terbaru.', 'Terlaris', 45),
('PC Gaming BOSNIALINE Titan X', 'komputer', 15000000, 17000000, 12, 4.9, 89, 320, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600','https://images.unsplash.com/photo-1593640408182-31c228b29b5e?w=600','https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600'), 'Intel Core i7-13700K | RAM 16GB DDR5 | RTX 4060 | SSD 1TB NVMe | Windows 11', 8000, 'PC Gaming rakitan premium siap pakai. Cocok untuk gaming AAA dan streaming dengan performa maksimal.', 'Best Seller', 12),
('Laptop Lenovo IdeaPad Slim 3', 'laptop', 6200000, 7000000, 11, 4.5, 412, 2100, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'), 'AMD Ryzen 5 7520U | RAM 8GB | SSD 256GB | 14" FHD | Windows 11', 1400, 'Laptop entry-level terbaik untuk pelajar dan mahasiswa. Ringan, tahan lama, dan harga terjangkau.', 'Hemat', 78),
('Monitor LG UltraWide 27"', 'monitor', 4200000, 4800000, 13, 4.6, 156, 540, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600','https://images.unsplash.com/photo-1593640408182-31c228b29b5e?w=600'), '27" IPS | 2560x1440 QHD | 165Hz | 1ms | HDR400 | HDMI + DisplayPort', 5500, 'Monitor gaming dan kerja resolusi tinggi. Warna akurat dan refresh rate tinggi untuk pengalaman terbaik.', 'Promo', 30),
('Laptop MacBook Air M2', 'laptop', 18500000, 20000000, 8, 4.9, 678, 890, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600','https://images.unsplash.com/photo-1611186871525-9c4f9b855c3e?w=600'), 'Apple M2 | RAM 8GB Unified | SSD 256GB | 13.6" Liquid Retina | macOS', 1250, 'Laptop premium Apple dengan chip M2 revolusioner. Performa luar biasa dengan daya tahan baterai hingga 18 jam.', 'Premium', 20),
('Keyboard Mechanical Rexus MX9', 'aksesoris', 850000, 1000000, 15, 4.4, 320, 1500, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600','https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'), 'Switch Blue | RGB Backlight | TKL Layout | USB | Anti-ghosting', 950, 'Keyboard mechanical gaming dengan RGB yang memukau. Tactile feedback sempurna untuk gaming dan mengetik.', 'Diskon', 200),
('PC All-in-One ASUS Zen AiO', 'komputer', 12000000, 13500000, 11, 4.6, 67, 210, 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600','https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600'), 'Intel Core i5-1240P | RAM 16GB | SSD 512GB | 23.8" FHD Touch | Windows 11', 7000, 'PC All-in-One elegan untuk rumah dan kantor. Desain minimalis tanpa kabel berantakan.', 'Baru', 15),
('Mouse Gaming Logitech G502 X', 'aksesoris', 950000, 1100000, 14, 4.8, 445, 2300, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'), '25600 DPI | HERO 25K Sensor | 13 Programmable Buttons | RGB | USB', 110, 'Mouse gaming flagship Logitech dengan sensor terbaik di kelasnya. Presisi tinggi untuk gaming kompetitif.', 'Terlaris', 150);
