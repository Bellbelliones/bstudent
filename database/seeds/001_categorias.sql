INSERT INTO categoria (nome, descricao) VALUES
  ('Tecnologia', 'Programação, dados e inteligência artificial'),
  ('Engenharia', 'Engenharias civil, mecânica, eletrotécnica e afins'),
  ('Saúde', 'Medicina, enfermagem e saúde pública'),
  ('Negócios', 'Gestão, economia e empreendedorismo'),
  ('Artes e Humanidades', 'Artes, letras, comunicação e ciências sociais'),
  ('Ciências', 'Matemática, física, química e biologia')
ON CONFLICT (nome) DO NOTHING;
