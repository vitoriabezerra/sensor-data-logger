# Projeto de Monitoramento de Sensores em Tempo Real

## Descrição do Projeto

Este projeto foi desenvolvido para uma empresa do setor de óleo e gás com o objetivo de monitorar dados em tempo real de sensores instalados em 2.000 equipamentos. A solução envolve a criação de uma API para receber e armazenar dados de sensores, tratamento de dados faltantes via arquivos CSV e uma interface web para visualização de dados.

## Funcionalidades

1. **Recepção de Dados em Tempo Real**: Endpoint para receber dados JSON de sensores.
2. **Tratamento de Dados Faltantes**: Endpoint para upload e processamento de arquivos CSV contendo dados faltantes.
3. **Visualização de Dados**: Interface web para exibir o valor médio dos sensores em diferentes intervalos de tempo com gráficos.

## Tecnologias Utilizadas

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (ou PostgreSQL)
- **Frontend**:
  - React.js
  - Chart.js para gráficos
- **Outras Ferramentas**:
  - Jest (para testes)

## Configuração do Ambiente

### Pré-requisitos

- Node.js

### Instruções de Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/vitoriabezerra/sensor-data-logger.git
   ```

2. Navegue até o diretório do backend e instale as dependências:

   ```bash
   cd sensor-data-logger/backend
   npm install
   ```

3. Navegue até o diretório do frontend e instale as dependências:

   ```bash
   cd ../frontend
   npm install
   ```

4. Configure as variáveis de ambiente necessárias (exemplo para MongoDB).

   ```bash
   // backend/.env
   DB_CONNECTION_STRING=mongodb://localhost:27017/sensors
   PORT=5000
   ```

### Execução

1. Execute o backend:

   ```bash
   cd backend
   npm start
   ```

2. Execute o frontend:

   ```bash
   cd ../frontend
   npm start
   ```

3. Alternativamente, você pode iniciar ambos (frontend e backend) a partir da raiz do projeto:

   ```bash
   npm start
   ```

4. Acesse a aplicação em `http://localhost:3000`.

## Endpoints da API

### Criar Novo Log de Sensor

```http
POST /api/sensors/create-log
```

- Payload:
  ```json
  {
    "equipmentId": "EQ-12495",
    "timestamp": "2023-02-15T01:30:00.000-05:00",
    "value": 78.42
  }
  ```

### Obter Logs de Sensor por Data

```http
GET /api/sensors/logs/:date/:id?
```

- Parâmetros:
  - `date`: Data específica para obter os logs.
  - `id` (opcional): Identificador do equipamento.

### Upload de Arquivo CSV

```http
POST /api/sensors/upload-csv
```

- Formato do CSV:
  ```
  equipmentId,timestamp,value
  EQ-12495,2023-02-15T01:30:00.000-05:00,78.42
  ```

## Interface Web

A interface web permite a visualização de dados médios dos sensores nas últimas 24 horas, 48 horas, 1 semana ou 1 mês. Os gráficos são gerados utilizando Chart.js.

## Testes

Para executar os testes, navegue até o diretório do backend e execute:

```bash
npm test
``
```
