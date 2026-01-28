// Quick Diagnostic Script - วางใน Server folder

console.log('🔍 Running Diagnostics...\n');

const db = require('./config/database');

async function diagnose() {
  try {
    // 1. Test Database Connection
    console.log('1️⃣  Testing database connection...');
    const conn = await db.getConnection();
    console.log('✅ Database connected\n');

    // 2. Check if repair table exists
    console.log('2️⃣  Checking repair table...');
    const [tables] = await db.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'repair'",
      [process.env.DB_NAME || 'servicereq_db']
    );

    if (tables.length === 0) {
      console.log('❌ repair table NOT found\n');
      console.log('Creating repair table...');
      
      const createTable = `
        CREATE TABLE IF NOT EXISTS repair (
          id INT NOT NULL AUTO_INCREMENT,
          user_id INT NOT NULL,
          user_name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          type_work VARCHAR(100) NOT NULL,
          detail TEXT NOT NULL,
          img LONGTEXT,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await db.execute(createTable);
      console.log('✅ repair table created\n');
    } else {
      console.log('✅ repair table found\n');

      // 3. Check table structure
      console.log('3️⃣  Checking table columns...');
      const [columns] = await db.execute(
        'DESCRIBE repair'
      );
      
      console.log('Columns:');
      columns.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type})`);
      });
      console.log();
    }

    // 4. Test insert
    console.log('4️⃣  Testing insert...');
    const [result] = await db.execute(
      'INSERT INTO repair (user_id, user_name, location, type_work, detail) VALUES (?, ?, ?, ?, ?)',
      [1, 'Test User', 'Test Location', 'electric', 'Test Detail']
    );
    console.log(`✅ Insert successful (ID: ${result.insertId})\n`);

    // 5. Test select
    console.log('5️⃣  Testing select...');
    const [repairs] = await db.execute('SELECT * FROM repair ORDER BY id DESC LIMIT 1');
    if (repairs.length > 0) {
      console.log('✅ Latest repair:', repairs[0], '\n');
    }

    console.log('✅ All diagnostics passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }

  process.exit(0);
}

diagnose();
