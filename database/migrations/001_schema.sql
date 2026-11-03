CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE utilizador (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  telefone VARCHAR(30),
  role VARCHAR(20) NOT NULL CHECK (role IN ('candidato','mentor','administrador')),
  estado VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (estado IN ('ativo','suspenso')),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE candidato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilizador_id UUID NOT NULL UNIQUE REFERENCES utilizador(id) ON DELETE CASCADE,
  nivel_academico VARCHAR(60),
  instituicao VARCHAR(160),
  area_formacao VARCHAR(160)
);

CREATE TABLE mentor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilizador_id UUID NOT NULL UNIQUE REFERENCES utilizador(id) ON DELETE CASCADE,
  especialidade VARCHAR(160),
  biografia TEXT,
  avaliacao NUMERIC(2,1) CHECK (avaliacao BETWEEN 0 AND 5)
);

CREATE TABLE administrador (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilizador_id UUID NOT NULL UNIQUE REFERENCES utilizador(id) ON DELETE CASCADE
);

CREATE TABLE categoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(80) NOT NULL UNIQUE,
  descricao TEXT
);

CREATE TABLE bolsa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID REFERENCES categoria(id) ON DELETE SET NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,
  pais VARCHAR(80),
  nivel_academico VARCHAR(60),
  data_limite DATE NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'aberta' CHECK (estado IN ('aberta','fechada')),
  criado_por UUID REFERENCES utilizador(id) ON DELETE SET NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE candidatura (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES candidato(id) ON DELETE CASCADE,
  bolsa_id UUID NOT NULL REFERENCES bolsa(id) ON DELETE CASCADE,
  data_candidatura TIMESTAMPTZ NOT NULL DEFAULT now(),
  estado VARCHAR(20) NOT NULL DEFAULT 'rascunho'
    CHECK (estado IN ('rascunho','submetida','em_analise','aprovada','rejeitada')),
  documentos JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (candidato_id, bolsa_id)
);

CREATE TABLE mentoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES mentor(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categoria(id) ON DELETE SET NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,
  preco NUMERIC(12,2) NOT NULL CHECK (preco >= 0),
  modalidade VARCHAR(20) NOT NULL CHECK (modalidade IN ('online','presencial','hibrida')),
  estado VARCHAR(20) NOT NULL DEFAULT 'ativa' CHECK (estado IN ('ativa','inativa')),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE contratacao_mentoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES candidato(id) ON DELETE CASCADE,
  mentoria_id UUID NOT NULL REFERENCES mentoria(id) ON DELETE CASCADE,
  candidatura_id UUID UNIQUE REFERENCES candidatura(id) ON DELETE SET NULL,
  data_contratacao TIMESTAMPTZ NOT NULL DEFAULT now(),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (estado IN ('pendente','ativa','cancelada'))
);

CREATE TABLE pagamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contratacao_id UUID NOT NULL REFERENCES contratacao_mentoria(id) ON DELETE CASCADE,
  valor NUMERIC(12,2) NOT NULL CHECK (valor >= 0),
  metodo VARCHAR(40) NOT NULL DEFAULT 'gateway',
  estado VARCHAR(20) NOT NULL DEFAULT 'pendente'
    CHECK (estado IN ('pendente','aprovado','falhado','cancelado','reembolsado')),
  referencia_gateway VARCHAR(80) NOT NULL UNIQUE,
  data_pagamento TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE perfil_interesse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL UNIQUE REFERENCES candidato(id) ON DELETE CASCADE,
  nivel_academico VARCHAR(60),
  pais_preferido VARCHAR(80)
);

CREATE TABLE interesse_categoria (
  candidato_id UUID NOT NULL REFERENCES candidato(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES categoria(id) ON DELETE CASCADE,
  peso SMALLINT NOT NULL DEFAULT 3 CHECK (peso BETWEEN 1 AND 5),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (candidato_id, categoria_id)
);

CREATE TABLE historico_interesse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES candidato(id) ON DELETE CASCADE,
  tipo_interacao VARCHAR(30) NOT NULL,
  descricao TEXT,
  referencia_id UUID,
  data_interacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE recomendacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil_id UUID NOT NULL REFERENCES perfil_interesse(id) ON DELETE CASCADE,
  bolsa_id UUID REFERENCES bolsa(id) ON DELETE CASCADE,
  mentoria_id UUID REFERENCES mentoria(id) ON DELETE CASCADE,
  pontuacao NUMERIC(5,2) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('bolsa','mentoria')),
  estado VARCHAR(20) NOT NULL DEFAULT 'sugerida',
  data_geracao TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((bolsa_id IS NULL) <> (mentoria_id IS NULL))
);

CREATE INDEX idx_bolsa_prazo ON bolsa (estado, data_limite);
CREATE INDEX idx_mentoria_categoria ON mentoria (categoria_id, estado);
CREATE INDEX idx_historico_candidato ON historico_interesse (candidato_id, data_interacao DESC);
CREATE INDEX idx_pagamento_contratacao ON pagamento (contratacao_id);
