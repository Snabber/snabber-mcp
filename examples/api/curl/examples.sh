#!/usr/bin/env bash
# Exemplos da API REST da Snabber com curl.
# Crie uma chave em https://snabber.com.br/integrations e exporte:
#   export SNABBER_API_KEY=snb_live_...
# Referência completa: https://snabber.com.br/developers
set -euo pipefail

BASE="https://snabber.com.br/api/v1"
AUTH="Authorization: Bearer ${SNABBER_API_KEY:?defina SNABBER_API_KEY}"

# Workspaces que a chave enxerga (e qual é o padrão)
curl -s "$BASE/workspaces" -H "$AUTH"

# Contas com saldo (BANK, CREDIT ou INVESTMENT)
curl -s "$BASE/accounts?type=BANK" -H "$AUTH"

# Despesas de setembro/2026, 50 por página
curl -s "$BASE/transactions?from=2026-09-01&to=2026-09-30&type=expense&limit=50" -H "$AUTH"

# Gastos do mês agrupados por categoria
curl -s "$BASE/transactions/aggregate?from=2026-09-01&to=2026-09-30&type=expense&group_by=category" -H "$AUTH"

# Faturas de cartão de crédito
curl -s "$BASE/credit-card-bills" -H "$AUTH"

# Criar uma transação (precisa de uma chave com permissão de escrita).
# Idempotency-Key evita lançar duas vezes se a requisição for repetida.
curl -s -X POST "$BASE/transactions" -H "$AUTH" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"date":"2026-10-11","description":"Almoço","amount":-45.00,"category":"Alimentação","account":"Nubank"}'

# A resposta traz undo_id; para desfazer:
# curl -s -X POST "$BASE/actions/<undo_id>/undo" -H "$AUTH"
