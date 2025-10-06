# Abacus.ai Tool Node for n8n
- this package is  provides as is
- created with Claude Sonnet 4.5

# n8n-nodes-abacusai

Este é um node customizado do n8n para integração com a API da Abacus.ai, permitindo usar modelos LLM diretamente no AI Agent do n8n.

## Instalação

### Instalação via npm (quando publicado)

```bash
npm install n8n-nodes-abacusai
```

### Instalação Manual para Desenvolvimento

1. Clone este repositório
2. Navegue até a pasta do projeto
3. Instale as dependências:

```bash
npm install
```

4. Compile o código:

```bash
npm run build
```

5. Link o pacote localmente:

```bash
npm link
```

6. No diretório do seu n8n, execute:

```bash
npm link n8n-nodes-abacusai
```

7. Reinicie o n8n

## Estrutura do Projeto

```
n8n-nodes-abacusai/
├── nodes/
│   └── AbacusAi/
│       ├── AbacusAi.node.ts
│       └── abacusai.svg (ícone opcional)
├── credentials/
│   └── AbacusAiApi.credentials.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Configuração

### 1. Credenciais

Após instalar o node, você precisa configurar as credenciais:

1. Vá até **Credentials** no n8n
2. Clique em **Add Credential**
3. Procure por **Abacus AI API**
4. Insira sua **API Key** da Abacus.ai
5. Salve

### 2. Usando o Node

1. Adicione o node **Abacus AI** ao seu workflow
2. Configure o **Deployment ID** (você encontra isso no painel da Abacus.ai)
3. Configure a mensagem e opções adicionais

### 3. Usando com AI Agent

Para usar com o AI Agent do n8n:

1. Adicione um node **AI Agent**
2. Em **Tools**, adicione o node **Abacus AI**
3. Configure o Deployment ID e outras opções
4. O AI Agent agora pode usar o Abacus AI como uma ferramenta

## Parâmetros

### Obrigatórios

- **Deployment ID**: O ID do deployment do seu modelo na Abacus.ai
- **Message**: A mensagem a ser enviada para o modelo

### Opcionais

- **Temperature** (0-2): Controla a aleatoriedade das respostas (padrão: 0.7)
- **Max Tokens**: Número máximo de tokens a gerar (padrão: 1024)
- **System Prompt**: Prompt do sistema para definir o comportamento do assistente
- **Conversation History**: Histórico da conversa em formato JSON

## Exemplo de Uso

### Exemplo 1: Chat Simples

```json
{
  "deploymentId": "seu-deployment-id",
  "message": "Olá, como você está?"
}
```

### Exemplo 2: Com Histórico de Conversa

```json
{
  "deploymentId": "seu-deployment-id",
  "message": "Continue a conversa",
  "options": {
    "conversationHistory": [
      {"role": "user", "content": "Olá!"},
      {"role": "assistant", "content": "Olá! Como posso ajudar?"}
    ]
  }
}
```

## Obtendo API Key e Deployment ID

1. Acesse [Abacus.ai](https://abacus.ai)
2. Faça login na sua conta
3. Vá em **Settings** > **API Keys** para obter sua API Key
4. Crie ou acesse um deployment existente para obter o Deployment ID

## Desenvolvimento

### Build

```bash
npm run build
```

### Watch Mode (desenvolvimento)

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

## Licença

MIT

## Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

## Suporte

Para problemas ou dúvidas:
- Abra uma issue no GitHub
- Consulte a [documentação da Abacus.ai](https://api.abacus.ai/)
- Consulte a [documentação do n8n](https://docs.n8n.io/)
