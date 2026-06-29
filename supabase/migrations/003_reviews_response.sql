-- Coluna de resposta do profissional nas avaliações
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response_at TIMESTAMP;
