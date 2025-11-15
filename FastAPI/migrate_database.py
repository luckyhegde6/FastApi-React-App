"""
Database migration script to update transactions table from category string to category_id foreign key.
This script will:
1. Create the categories table if it doesn't exist
2. Migrate existing category strings to the categories table
3. Update transactions table to use category_id instead of category
"""

import sqlite3
from pathlib import Path
import sys

# Database path
DB_PATH = Path(__file__).parent / "finance.db"

def migrate_database():
    """Migrate the database schema."""
    if not DB_PATH.exists():
        print("Database file not found. It will be created with the new schema.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if migration is needed
        cursor.execute("PRAGMA table_info(transactions)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'category_id' in columns:
            print("Database already migrated. No action needed.")
            return
        
        if 'category' not in columns:
            print("Old 'category' column not found. Database may need to be recreated.")
            return
        
        print("Starting database migration...")
        
        # Clean up any partial migration tables
        cursor.execute("DROP TABLE IF EXISTS categories_new")
        cursor.execute("DROP TABLE IF EXISTS transactions_new")
        
        # Step 1: Create categories table if it doesn't exist
        print("Creating categories table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                is_income BOOLEAN NOT NULL DEFAULT 0,
                is_default BOOLEAN NOT NULL DEFAULT 0
            )
        """)
        # Create unique index on (name, is_income)
        cursor.execute("""
            CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_name_income 
            ON categories_new(name, is_income)
        """)
        
        # Step 2: Get all unique categories from transactions
        print("Extracting unique categories from transactions...")
        cursor.execute("SELECT DISTINCT category, is_income FROM transactions WHERE category IS NOT NULL")
        existing_categories = cursor.fetchall()
        
        # Step 3: Insert categories into the new table
        print("Inserting categories...")
        category_map = {}  # Maps (category_name, is_income) to category_id
        
        for category_name, is_income in existing_categories:
            if not category_name:
                continue
            
            # Check if category already exists
            cursor.execute(
                "SELECT id FROM categories_new WHERE name = ? AND is_income = ?",
                (category_name, is_income)
            )
            existing = cursor.fetchone()
            
            if existing:
                category_id = existing[0]
            else:
                cursor.execute(
                    "INSERT INTO categories_new (name, is_income, is_default) VALUES (?, ?, ?)",
                    (category_name, is_income, 0)
                )
                category_id = cursor.lastrowid
            
            category_map[(category_name, is_income)] = category_id
        
        # Step 4: Add default categories
        print("Adding default categories...")
        default_expense_categories = [
            ("Food", "Groceries and dining out", False),
            ("Transport", "Transportation costs", False),
            ("Shopping", "Shopping and retail", False),
            ("Bills", "Utility bills and subscriptions", False),
            ("Entertainment", "Movies, games, and leisure", False),
            ("Healthcare", "Medical expenses", False),
            ("Education", "Educational expenses", False),
            ("Other", "Miscellaneous expenses", False),
        ]
        
        default_income_categories = [
            ("Salary", "Monthly salary", True),
            ("Freelance", "Freelance work income", True),
            ("Investment", "Investment returns", True),
            ("Gift", "Gifts received", True),
            ("Other Income", "Other income sources", True),
        ]
        
        for name, description, is_income in default_expense_categories + default_income_categories:
            cursor.execute(
                "SELECT id FROM categories_new WHERE name = ? AND is_income = ?",
                (name, is_income)
            )
            if not cursor.fetchone():
                cursor.execute(
                    "INSERT INTO categories_new (name, description, is_income, is_default) VALUES (?, ?, ?, ?)",
                    (name, description, is_income, 1)
                )
        
        conn.commit()
        
        # Step 5: Create new transactions table with category_id
        print("Creating new transactions table...")
        cursor.execute("""
            CREATE TABLE transactions_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount REAL NOT NULL,
                category_id INTEGER NOT NULL,
                description TEXT,
                is_income BOOLEAN NOT NULL DEFAULT 0,
                date TEXT NOT NULL,
                FOREIGN KEY (category_id) REFERENCES categories_new(id)
            )
        """)
        
        # Step 6: Migrate transaction data
        print("Migrating transaction data...")
        cursor.execute("SELECT id, amount, category, description, is_income, date FROM transactions")
        transactions = cursor.fetchall()
        
        migrated_count = 0
        skipped_count = 0
        
        for trans_id, amount, category_name, description, is_income, date in transactions:
            # Find category_id for this transaction
            category_id = category_map.get((category_name, is_income))
            
            if not category_id:
                # Try to find any category with this name and income type
                cursor.execute(
                    "SELECT id FROM categories_new WHERE name = ? AND is_income = ? LIMIT 1",
                    (category_name or "Other", is_income)
                )
                result = cursor.fetchone()
                if result:
                    category_id = result[0]
                    # Add to map for future use
                    category_map[(category_name or "Other", is_income)] = category_id
                else:
                    # Create a new category if not found
                    try:
                        cursor.execute(
                            "INSERT INTO categories_new (name, is_income, is_default) VALUES (?, ?, ?)",
                            (category_name or "Other", is_income, 0)
                        )
                        category_id = cursor.lastrowid
                        category_map[(category_name or "Other", is_income)] = category_id
                    except sqlite3.IntegrityError:
                        # Category already exists, fetch it
                        cursor.execute(
                            "SELECT id FROM categories_new WHERE name = ? AND is_income = ?",
                            (category_name or "Other", is_income)
                        )
                        result = cursor.fetchone()
                        if result:
                            category_id = result[0]
                        else:
                            print(f"Warning: Could not find or create category for '{category_name}' (is_income={is_income})")
                            skipped_count += 1
                            continue
            
            cursor.execute(
                "INSERT INTO transactions_new (id, amount, category_id, description, is_income, date) VALUES (?, ?, ?, ?, ?, ?)",
                (trans_id, amount, category_id, description, is_income, date)
            )
            migrated_count += 1
        
        conn.commit()
        
        # Step 7: Drop old tables and rename new ones
        print("Replacing old tables...")
        cursor.execute("DROP TABLE IF EXISTS transactions")
        cursor.execute("DROP TABLE IF EXISTS categories")
        cursor.execute("ALTER TABLE transactions_new RENAME TO transactions")
        cursor.execute("ALTER TABLE categories_new RENAME TO categories")
        
        # Step 8: Create indexes
        print("Creating indexes...")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name)")
        
        conn.commit()
        
        # Get final category count
        cursor.execute("SELECT COUNT(*) FROM categories")
        final_category_count = cursor.fetchone()[0]
        
        print(f"\n✅ Migration completed successfully!")
        print(f"   - Migrated {migrated_count} transactions")
        if skipped_count > 0:
            print(f"   - Skipped {skipped_count} transactions (no category found)")
        print(f"   - Created categories table with {final_category_count} categories")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()

