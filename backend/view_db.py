import os
from pathlib import Path
from sqlalchemy import inspect, text
from database import engine
from config import DATABASE_URL

print("=" * 80)
print(f"DATABASE INSPECTOR")
print(f"URL: {DATABASE_URL}")
print("=" * 80)

inspector = inspect(engine)
tables = inspector.get_table_names()

with engine.connect() as conn:
    for table in tables:
        print(f"\nTABLE: {table.upper()}")
        print("-" * 80)
        
        columns = [c["name"] for c in inspector.get_columns(table)]
        print(" | ".join(columns[:6]))
        print("-" * 80)
        
        result = conn.execute(text(f"SELECT * FROM {table} LIMIT 10;"))
        rows = result.fetchall()
        if not rows:
            print("  (Empty table)")
        else:
            for r in rows:
                display_row = [str(x)[:20] for x in r[:6]]
                print(" | ".join(display_row))
        print(f"Total shown: {len(rows)} rows")

print("\n" + "=" * 80)

