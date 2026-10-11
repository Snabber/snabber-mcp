---
name: snabber
description: Answer questions about the user's finances (spending, income, credit card bills, installments, investments, balances) and log or reorganize transactions using the Snabber MCP tools. Use when the user asks about their money, bank accounts, cards or budget, or mentions Snabber.
---

# Using Snabber

Snabber is a Brazilian personal and business finance app. Bank accounts, credit cards and
investments arrive through Open Finance; the MCP tools read and (when allowed) write that data.
Answer in the user's language — most users write in Portuguese.

## Before answering

- **Workspace**: a connection can reach several workspaces (personal, family, company). If the
  question doesn't make clear which one, call `list_workspaces` and use the default, or ask.
- **Dates** are `YYYY-MM-DD`. Resolve "esse mês", "mês passado" etc. to explicit ranges.
- **Amounts** are signed: negative = expense, positive = income. Report totals as positive
  numbers in BRL (`R$ 1.234,56`).

## Picking the tool

| The user wants | Tool |
|---|---|
| Totals by category, account, month or merchant | `aggregate_transactions` (prefer it over summing pages yourself) |
| Specific transactions | `list_transactions` |
| Accounts and balances | `list_accounts`, `list_account_balance_history` |
| A credit card bill | `get_credit_card_invoice`, `list_credit_card_bills`, `list_bill_transactions` |
| Installment purchases ("parcelas") | `list_installment_plans` |
| Investments | `list_investments`, `list_investment_positions`, `list_investment_transactions` |
| How to do something in the app | `search_snabber_help` |

## Writing

- Write tools (`create_*`, `update_*`, `delete_*`) only exist where the user enabled writing for
  that workspace in Snabber → Integrações. If a call returns `INSUFFICIENT_SCOPE`, tell the user
  exactly that; it is not a chat security setting.
- `create_transactions` needs the exact account name from `list_accounts`; a missing category is
  created.
- Deletions show a summary first. Describe it to the user and only confirm after they agree.
- Every write returns an `undo_id`. Mention that it can be undone with `undo_action` for 30 days.
- Open Finance transactions can be rewritten by the next bank sync. To remove one from totals,
  prefer recategorizing it to "Ignorado" over deleting it.
