-- Profissionais de teste (já aprovados para testar a busca)
INSERT INTO professionals (name, bio, city, state, phone, status) VALUES
  ('João Eletricista', 'Eletricista com 10 anos de experiência. Instalações residenciais e comerciais, quadros elétricos, tomadas e iluminação.', 'São Paulo', 'SP', '(11) 99999-0001', 'approved'),
  ('Carlos Pedreiro', 'Pedreiro e azulejista. Reformas completas, banheiros, cozinhas e área de serviço. Trabalho limpo e pontual.', 'São Paulo', 'SP', '(11) 99999-0002', 'approved'),
  ('Ana Diarista', 'Diarista com 8 anos de experiência. Limpeza residencial completa, organização e passar roupa.', 'São Paulo', 'SP', '(11) 99999-0003', 'approved'),
  ('Pedro Jardineiro', 'Jardineiro e paisagista. Manutenção de jardins, poda, plantio e projetos paisagísticos.', 'Campinas', 'SP', '(11) 99999-0004', 'approved'),
  ('Lucas Encanador', 'Encanador residencial. Consertos de vazamentos, instalação de louças e torneiras, desentupimento.', 'São Paulo', 'SP', '(11) 99999-0005', 'approved'),
  ('Rafael Pintor', 'Pintor residencial e comercial. Pintura interna, externa, textura e grafiato. Orçamento grátis.', 'Guarulhos', 'SP', '(11) 99999-0006', 'approved'),
  ('Marcos Chaveiro', 'Chaveiro 24h. Abertura de portas, cópias de chaves, instalação de fechaduras e cofres.', 'São Paulo', 'SP', '(11) 99999-0007', 'pending')
ON CONFLICT DO NOTHING;

-- Serviços dos profissionais
WITH prof AS (
  SELECT id, name FROM professionals WHERE name IN (
    'João Eletricista','Carlos Pedreiro','Ana Diarista',
    'Pedro Jardineiro','Lucas Encanador','Rafael Pintor','Marcos Chaveiro'
  )
)
INSERT INTO professional_services (professional_id, category_id, description, price_range)
SELECT p.id,
  CASE p.name
    WHEN 'João Eletricista' THEN 1
    WHEN 'Carlos Pedreiro'  THEN 2
    WHEN 'Ana Diarista'     THEN 8
    WHEN 'Pedro Jardineiro' THEN 3
    WHEN 'Lucas Encanador'  THEN 5
    WHEN 'Rafael Pintor'    THEN 6
    WHEN 'Marcos Chaveiro'  THEN 9
  END,
  CASE p.name
    WHEN 'João Eletricista' THEN 'Instalações elétricas, quadros, tomadas e iluminação'
    WHEN 'Carlos Pedreiro'  THEN 'Reformas completas, revestimentos e alvenaria'
    WHEN 'Ana Diarista'     THEN 'Limpeza residencial completa e organização'
    WHEN 'Pedro Jardineiro' THEN 'Manutenção, poda e projetos paisagísticos'
    WHEN 'Lucas Encanador'  THEN 'Vazamentos, instalações hidráulicas e desentupimento'
    WHEN 'Rafael Pintor'    THEN 'Pintura interna, externa, textura e grafiato'
    WHEN 'Marcos Chaveiro'  THEN 'Abertura de portas, cópias e instalação de fechaduras'
  END,
  CASE p.name
    WHEN 'João Eletricista' THEN 'R$ 150–400 por visita'
    WHEN 'Carlos Pedreiro'  THEN 'R$ 200–500 por diária'
    WHEN 'Ana Diarista'     THEN 'R$ 120–180 por diária'
    WHEN 'Pedro Jardineiro' THEN 'R$ 150–300 por visita'
    WHEN 'Lucas Encanador'  THEN 'R$ 100–300 por visita'
    WHEN 'Rafael Pintor'    THEN 'R$ 200–600 por cômodo'
    WHEN 'Marcos Chaveiro'  THEN 'R$ 80–200 por serviço'
  END
FROM prof p
ON CONFLICT DO NOTHING;
