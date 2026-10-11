<p align="center">
  <img src="icon.png" alt="Snabber" width="96" height="96">
</p>

<h1 align="center">Snabber MCP</h1>

<p align="center">
  Suas finanças no Claude, no ChatGPT e em qualquer cliente MCP — com os dados reais dos seus bancos via Open Finance.
  <br>
  <a href="#english">English below</a>
</p>

<p align="center">
  <a href="https://smithery.ai/servers/snabberfinance/snabber"><img src="https://smithery.ai/badge/snabberfinance/snabber" alt="Smithery"></a>
  <a href="https://registry.modelcontextprotocol.io/v0.1/servers?search=br.com.snabber/snabber"><img src="https://img.shields.io/badge/MCP%20Registry-br.com.snabber%2Fsnabber-7c2ea0" alt="MCP Registry"></a>
  <a href="https://claude.ai/directory/snabber"><img src="https://img.shields.io/badge/Claude-conector%20oficial-f98c39" alt="Conector oficial do Claude"></a>
</p>

A [Snabber](https://snabber.com.br) é um app brasileiro de finanças pessoais, para casais e para empresas. Contas, cartões e
investimentos dos principais bancos chegam pelo Open Finance do Banco Central. Este repositório reúne:

- **Plugin do Claude Code** com o servidor MCP da Snabber e uma skill que ensina o Claude a usá-lo bem
- **Configuração** para Claude, ChatGPT, Cursor, VS Code e outros clientes MCP
- **Exemplos da API REST** em curl, TypeScript e Python

URL do servidor MCP: `https://snabber.com.br/api/mcp` (HTTP streamable, OAuth 2.0)

## Conectar

### Claude (claude.ai, desktop e mobile)

Abra [claude.ai/directory/snabber](https://claude.ai/directory/snabber), clique em **Conectar ao Claude**, entre na Snabber e
escolha quais workspaces o Claude pode ver. Conectores do claude.ai também ficam disponíveis no Claude Code de quem está logado
com a mesma conta.

### Claude Code (plugin)

```
/plugin marketplace add Snabber/snabber-mcp
/plugin install snabber@snabber-mcp
```

Depois rode `/mcp`, escolha `snabber` e faça login. O plugin traz o servidor MCP e a skill `/snabber:snabber`.

Sem plugin, só o servidor:

```bash
claude mcp add --transport http snabber https://snabber.com.br/api/mcp
```

> Se você já conectou a Snabber pelo claude.ai, não precisa do plugin: o conector já aparece no Claude Code.

### ChatGPT

Em Configurações → Plugins, ative o Modo Desenvolvedor, adicione um plugin com a URL `https://snabber.com.br/api/mcp`, entre na
Snabber e chame `@Snabber` na conversa. Passo a passo com vídeo em [snabber.com.br/chatgpt](https://snabber.com.br/chatgpt).

### Cursor, VS Code e outros

| Cliente | Arquivo |
|---|---|
| Cursor | [`clients/cursor.mcp.json`](clients/cursor.mcp.json) → `.cursor/mcp.json` |
| VS Code | [`clients/vscode.mcp.json`](clients/vscode.mcp.json) → `.vscode/mcp.json` |
| Cliente só stdio, com chave de API | [`clients/api-key-stdio.json`](clients/api-key-stdio.json) (via `mcp-remote`) |

## O que dá para perguntar

- "Quanto gastei com delivery esse mês?"
- "Como está a fatura do meu cartão Nubank?"
- "Quanto ainda falta pagar das compras parceladas?"
- "Qual era o saldo dos meus investimentos em 31/12?" (útil para a declaração do IRPF)
- "Lança um almoço de R$ 45 no Nubank hoje"
- "Recategorize os Uber do mês como Transporte"

## Ferramentas

**Consulta** (sempre disponíveis): `list_transactions`, `aggregate_transactions`, `list_accounts`,
`list_account_balance_history`, `get_credit_card_invoice`, `list_credit_card_bills`, `list_bill_transactions`,
`list_installment_plans`, `list_categories`, `list_investments`, `list_investment_positions`,
`list_investment_transactions`, `list_workspaces`, `search_snabber_help`.

**Escrita** (só nos workspaces em que você liberar): `create_transactions`, `update_transaction(s)`, `create_category`,
`update_category`, `create_account`, `update_account`, `create_investment_balances`, `create_investment_transactions`,
`preview_delete_*` / `delete_*` (sempre com resumo e confirmação) e `undo_action` (desfaz qualquer alteração por 30 dias).

Lista completa e descrições em [snabber.com.br/api-mcp](https://snabber.com.br/api-mcp#ferramentas).

## API REST

Para integrar sem IA: crie uma chave em [snabber.com.br/integrations](https://snabber.com.br/integrations) e envie
`Authorization: Bearer snb_live_...`.

| Exemplo | O que faz |
|---|---|
| [`examples/api/curl/examples.sh`](examples/api/curl/examples.sh) | workspaces, contas, transações, agregação por categoria, faturas e criação com `Idempotency-Key` |
| [`examples/api/typescript/monthly-summary.ts`](examples/api/typescript/monthly-summary.ts) | resumo do mês: totais, gastos por categoria e maiores despesas (com paginação por cursor) |
| [`examples/api/python/export_csv.py`](examples/api/python/export_csv.py) | exporta as transações de um período para CSV, sem dependências |

Referência: [snabber.com.br/developers](https://snabber.com.br/developers) · Especificação OpenAPI:
[`/api/v1/openapi.json`](https://snabber.com.br/api/v1/openapi.json)

## Segurança e privacidade

- A conexão bancária é feita pelo Open Finance, com autorização no ambiente do banco. A senha do banco nunca chega à Snabber.
- No MCP, você escolhe por OAuth quais workspaces cada IA pode ver e se ela pode escrever.
- Exclusões pedem confirmação, e toda alteração feita pela conexão pode ser desfeita por 30 dias.
- Descrições e valores das transações ficam criptografados (AES-256-GCM).
- [Política de privacidade](https://snabber.com.br/politica-privacidade) · [Termos de serviço](https://snabber.com.br/termos-de-servico)

API e MCP fazem parte dos planos pagos, a partir do Basic. Veja os [planos](https://snabber.com.br/pricing).

---

<a id="english"></a>

## English

[Snabber](https://snabber.com.br) is a Brazilian personal, family and business finance app. Bank accounts, credit cards and
investments from Brazil's main banks arrive through Open Finance (regulated by the Central Bank of Brazil). This repository has:

- A **Claude Code plugin** with the Snabber MCP server and a skill that teaches Claude how to use it
- **Client configs** for Claude, ChatGPT, Cursor, VS Code and other MCP clients
- **REST API examples** in curl, TypeScript and Python

MCP server URL: `https://snabber.com.br/api/mcp` (streamable HTTP, OAuth 2.0)

### Connect

- **Claude**: open [claude.ai/directory/snabber](https://claude.ai/directory/snabber) and click *Connect*.
- **Claude Code**: `/plugin marketplace add Snabber/snabber-mcp`, then `/plugin install snabber@snabber-mcp`, then log in
  from `/mcp`. Or, without the plugin: `claude mcp add --transport http snabber https://snabber.com.br/api/mcp`.
- **ChatGPT**: enable Developer Mode, add a plugin with the MCP URL above, then use `@Snabber`.
- **Cursor / VS Code / others**: see [`clients/`](clients/).

### What it can do

Read tools cover transactions (with filters and aggregation by category, account, month or merchant), accounts and balance
history, credit card bills and installments, categories and budgets, and investment positions and flows. Write tools (only in
workspaces where you enable writing) create, edit, recategorize and delete records. Deletions always ask for confirmation, and
any change can be undone for 30 days.

### REST API

Create a key at [snabber.com.br/integrations](https://snabber.com.br/integrations) and send
`Authorization: Bearer snb_live_...`. See [`examples/api/`](examples/api/), the
[reference](https://snabber.com.br/developers) and the [OpenAPI spec](https://snabber.com.br/api/v1/openapi.json).

API and MCP access are included in paid plans, starting with Basic. See [pricing](https://snabber.com.br/pricing).

## Licença / License

Os exemplos e configurações deste repositório estão sob a licença [MIT](LICENSE). O serviço Snabber segue os
[termos de serviço](https://snabber.com.br/termos-de-servico).
