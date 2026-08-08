import * as SQLite from "expo-sqlite";

export const database = SQLite.openDatabaseSync("bille.db");

/** Creates the complete V0.1 local schema. It is safe to run on every launch. */
export function initializeDatabase() {
  database.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      business_name TEXT,
      currency TEXT NOT NULL DEFAULT 'USD',
      theme TEXT,
      last_backup_at TEXT
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY NOT NULL,
      full_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      address TEXT,
      notes TEXT,
      is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0, 1)),
      deleted_at TEXT,
      is_backed_up INTEGER NOT NULL DEFAULT 0 CHECK (is_backed_up IN (0, 1)),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      customer_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('CHARGE', 'PAYMENT', 'ADJUSTMENT')),
      amount INTEGER NOT NULL,
      description TEXT,
      payment_method TEXT,
      reason TEXT,
      notes TEXT,
      date TEXT NOT NULL,
      deleted_at TEXT,
      is_backed_up INTEGER NOT NULL DEFAULT 0 CHECK (is_backed_up IN (0, 1)),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS transactions_by_customer_date
      ON transactions(customer_id, date, created_at);
    CREATE INDEX IF NOT EXISTS transactions_by_date
      ON transactions(date, created_at);
    CREATE INDEX IF NOT EXISTS customers_by_name
      ON customers(full_name);

    INSERT OR IGNORE INTO settings (id, currency) VALUES (1, 'USD');
  `);
}
