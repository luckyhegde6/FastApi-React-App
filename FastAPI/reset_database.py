"""
Reset database script - Deletes the existing database and recreates it with the new schema.
WARNING: This will delete all existing data!
Use this if you don't need to preserve existing transactions.
"""

import os
from pathlib import Path

DB_PATH = Path(__file__).parent / "finance.db"

def reset_database():
    """Delete and recreate the database."""
    if DB_PATH.exists():
        print(f"Deleting existing database: {DB_PATH}")
        os.remove(DB_PATH)
        print("✅ Database deleted.")
    else:
        print("Database file not found.")
    
    print("\nThe database will be recreated automatically when you start the FastAPI server.")
    print("Default categories will be seeded on startup.")

if __name__ == "__main__":
    response = input("⚠️  WARNING: This will delete all existing data. Continue? (yes/no): ")
    if response.lower() == "yes":
        reset_database()
    else:
        print("Cancelled.")

