CREATE DATABASE IF NOT EXISTS zanini_chamados
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE zanini_chamados;

CREATE TABLE IF NOT EXISTS chamados (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  cliente_nome VARCHAR(120) NOT NULL,
  cliente_telefone VARCHAR(30) NOT NULL,
  cliente_email VARCHAR(160) NULL,
  equipamento VARCHAR(120) NULL,
  descricao TEXT NOT NULL,
  prioridade ENUM('baixa', 'media', 'alta', 'urgente') NOT NULL DEFAULT 'media',
  status ENUM('aberto', 'em_andamento', 'aguardando_cliente', 'concluido', 'cancelado') NOT NULL DEFAULT 'aberto',
  tecnico_responsavel VARCHAR(120) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_chamados_status (status),
  INDEX idx_chamados_prioridade (prioridade),
  INDEX idx_chamados_criado_em (criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clientes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  telefone VARCHAR(30) NOT NULL,
  email VARCHAR(160) NULL,
  endereco VARCHAR(255) NULL,
  cidade VARCHAR(120) NULL,
  observacoes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_clientes_nome (nome),
  INDEX idx_clientes_cidade (cidade),
  INDEX idx_clientes_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO chamados (
  cliente_nome,
  cliente_telefone,
  cliente_email,
  equipamento,
  descricao,
  prioridade,
  status,
  tecnico_responsavel
)
SELECT
  'Cliente Exemplo',
  '(00) 00000-0000',
  'cliente@example.com',
  'Ar-condicionado split',
  'Chamado inicial de exemplo para validar a instalacao.',
  'media',
  'aberto',
  NULL
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1
  FROM chamados
  WHERE cliente_email = 'cliente@example.com'
    AND descricao = 'Chamado inicial de exemplo para validar a instalacao.'
);

INSERT INTO clientes (
  nome,
  telefone,
  email,
  endereco,
  cidade,
  observacoes
)
SELECT
  'Cliente Exemplo',
  '(00) 00000-0000',
  'cliente@example.com',
  'Rua Exemplo, 123',
  'Sao Paulo',
  'Cliente inicial de exemplo para validar a instalacao.'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1
  FROM clientes
  WHERE email = 'cliente@example.com'
    AND telefone = '(00) 00000-0000'
);
