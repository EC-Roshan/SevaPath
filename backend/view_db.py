import sqlite3
import os
from pathlib import Path

db_path = Path(__file__).resolve().parent / "sevapath.db"

if not db_path.exists():
    print(f"Database file not found at: {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=" * 80)
print(f"DATABASE INSPECTOR: {db_path.name}")
print("=" * 80)

# List all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [t[0] for t in cursor.fetchall() if not t[0].startswith("sqlite_")]

for table in tables:
    print(f"\nTABLE: {table.upper()}")
    print("-" * 80)
    
    # Get column names
    cursor.execute(f"PRAGMA table_info({table});")
    cols = [col[1] for col in cursor.fetchall()]
    print(" | ".join(cols[:6]))
    print("-" * 80)
    
    # Fetch rows
    cursor.execute(f"SELECT * FROM {table} LIMIT 10;")
    rows = cursor.fetchall()
    if not rows:
        print("  (Empty table)")
    else:
        for r in rows:
            # Shorten long text for display
            display_row = [str(x)[:20] for x in r[:6]]
            print(" | ".join(display_row))
    print(f"Total shown: {len(rows)} rows")

conn.close()
print("\n" + "=" * 80)
