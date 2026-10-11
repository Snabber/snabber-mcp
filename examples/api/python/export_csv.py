"""Exporta as transações de um período da Snabber para CSV.

Rodar (Python 3.9+, sem dependências externas):
    export SNABBER_API_KEY=snb_live_...
    python export_csv.py 2026-01-01 2026-09-30 transacoes.csv

Referência completa: https://snabber.com.br/developers
"""

import csv
import json
import os
import sys
import urllib.parse
import urllib.request

BASE = "https://snabber.com.br/api/v1"
KEY = os.environ.get("SNABBER_API_KEY")
if not KEY:
    sys.exit("Defina SNABBER_API_KEY (crie em https://snabber.com.br/integrations)")


def api(path, params=None):
    url = f"{BASE}{path}?{urllib.parse.urlencode(params or {})}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {KEY}"})
    with urllib.request.urlopen(req) as res:
        return json.load(res)


def all_transactions(date_from, date_to):
    """Percorre todas as páginas usando pagination.next_cursor."""
    cursor = None
    while True:
        params = {"from": date_from, "to": date_to, "limit": 200}
        if cursor:
            params["cursor"] = cursor
        page = api("/transactions", params)
        yield from page["data"]
        cursor = page["pagination"]["next_cursor"]
        if not cursor:
            break


def main():
    if len(sys.argv) != 4:
        sys.exit("uso: python export_csv.py AAAA-MM-DD AAAA-MM-DD arquivo.csv")
    date_from, date_to, out_path = sys.argv[1:]

    fields = ["date", "description", "amount", "type", "category", "category_parent", "account", "paid"]
    count = 0
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for tx in all_transactions(date_from, date_to):
            writer.writerow(tx)
            count += 1
    print(f"{count} transações exportadas para {out_path}")


if __name__ == "__main__":
    main()
