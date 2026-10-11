// Resumo do mês com a API REST da Snabber: total de receitas/despesas,
// gastos por categoria e as maiores despesas.
//
// Rodar (Node 18+):
//   export SNABBER_API_KEY=snb_live_...
//   npx tsx monthly-summary.ts 2026-09
//
// Referência completa: https://snabber.com.br/developers

const BASE = "https://snabber.com.br/api/v1";
const KEY = process.env.SNABBER_API_KEY;
if (!KEY) throw new Error("Defina SNABBER_API_KEY (crie em https://snabber.com.br/integrations)");

type Transaction = {
  id: number;
  date: string;
  description: string | null;
  amount: number | null;
  type: "income" | "expense";
  category: string;
  account: string;
};

type Bucket = { keys: { category?: string }; income: number; expense: number; net: number; count: number };

async function api<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(`${res.status} ${path}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** Percorre todas as páginas de /transactions usando pagination.next_cursor. */
async function allTransactions(params: Record<string, string>): Promise<Transaction[]> {
  const out: Transaction[] = [];
  let cursor: string | null = null;
  do {
    const page: { data: Transaction[]; pagination: { next_cursor: string | null } } = await api("/transactions", {
      ...params,
      limit: "200",
      ...(cursor ? { cursor } : {}),
    });
    out.push(...page.data);
    cursor = page.pagination.next_cursor;
  } while (cursor);
  return out;
}

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

async function main() {
  const month = process.argv[2] ?? new Date().toISOString().slice(0, 7); // YYYY-MM
  const [y, m] = month.split("-").map(Number);
  const from = `${month}-01`;
  const to = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10); // último dia do mês

  const byCategory = await api<{ buckets: Bucket[]; totals: { income: number; expense: number; net: number } }>(
    "/transactions/aggregate",
    { from, to, group_by: "category" }
  );

  console.log(`\nResumo de ${month}`);
  console.log(`Receitas: ${brl(byCategory.totals.income)}`);
  console.log(`Despesas: ${brl(byCategory.totals.expense)}`);
  console.log(`Saldo:    ${brl(byCategory.totals.net)}\n`);

  console.log("Gastos por categoria:");
  byCategory.buckets
    .filter((b) => b.expense !== 0)
    .sort((a, b) => Math.abs(b.expense) - Math.abs(a.expense))
    .forEach((b) => console.log(`  ${(b.keys.category ?? "—").padEnd(24)} ${brl(Math.abs(b.expense))}`));

  const expenses = await allTransactions({ from, to, type: "expense" });
  console.log("\nMaiores despesas:");
  expenses
    .sort((a, b) => (a.amount ?? 0) - (b.amount ?? 0))
    .slice(0, 5)
    .forEach((t) => console.log(`  ${t.date}  ${(t.description ?? "").padEnd(28)} ${brl(Math.abs(t.amount ?? 0))}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
