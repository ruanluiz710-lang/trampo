-- Categorias de serviço
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Profissionais
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  bio TEXT,
  city VARCHAR(100) NOT NULL,
  state CHAR(2) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  photo_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Serviços que cada profissional oferece
CREATE TABLE professional_services (
  id SERIAL PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id),
  description TEXT,
  price_range VARCHAR(50)
);

-- Avaliações
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  client_name VARCHAR(150) NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categorias iniciais
INSERT INTO categories (name, icon) VALUES
  ('Eletricista', 'zap'),
  ('Pedreiro', 'hammer'),
  ('Jardineiro', 'leaf'),
  ('Segurança', 'shield'),
  ('Encanador', 'droplets'),
  ('Pintor', 'paintbrush'),
  ('Marceneiro', 'wrench'),
  ('Diarista', 'home'),
  ('Chaveiro', 'key'),
  ('Ar-condicionado', 'wind');
