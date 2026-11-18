import sys
import os
from pathlib import Path

# Add backend directory to sys.path so that FastAPI modules and models load properly
current_dir = Path(__file__).resolve().parent
backend_dir = current_dir.parent / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# On Vercel, initialize database in /tmp if not already present
if os.getenv("VERCEL") and not os.getenv("DATABASE_URL"):
    tmp_db = Path("/tmp/sevapath.db")
    if not tmp_db.exists():
        try:
            print("[Vercel] Initializing and seeding database at /tmp/sevapath.db...")
            from seed import seed_database
            seed_database()
            print("[Vercel] Database initialized and seeded successfully.")
        except Exception as e:
            print(f"[Vercel] Error during initial database seed: {e}")

from main import app
