const db = require('./database');

// Initialize database tables
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database tables...');

    // Create repair table if not exists
    const createRepairTable = `
      CREATE TABLE IF NOT EXISTS repair (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL COMMENT 'รหัสผู้ใช้',
        user_name VARCHAR(255) NOT NULL COMMENT 'ชื่อผู้แจ้งซ่อม',
        location VARCHAR(255) NOT NULL COMMENT 'สถานที่',
        type_work VARCHAR(100) NOT NULL COMMENT 'ประเภทงาน',
        detail TEXT NOT NULL COMMENT 'รายละเอียด',
        img LONGTEXT COMMENT 'รูปภาพ',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง',
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    try {
      await db.execute(createRepairTable);
      console.log('✅ Repair table created or already exists');
    } catch (tableError) {
      console.warn('⚠️  Could not create repair table:', tableError.message);
      console.warn('❌ Please create the table manually using: Server/database.sql');
    }

    // Create moving table if not exists
    const createMovingTable = `
      CREATE TABLE IF NOT EXISTS moving (
        move_id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL COMMENT 'รหัสผู้ใช้',
        user_name VARCHAR(255) NOT NULL COMMENT 'ชื่อผู้ขอย้ายของ',
        location VARCHAR(255) NOT NULL COMMENT 'สถานที่ย้ายไป',
        type_work VARCHAR(100) NOT NULL COMMENT 'ประเภทงาน',
        detail TEXT NOT NULL COMMENT 'รายละเอียด',
        img LONGTEXT COMMENT 'รูปภาพ',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง',
        PRIMARY KEY (move_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    try {
      await db.execute(createMovingTable);
      console.log('✅ Moving table created or already exists');
    } catch (tableError) {
      console.warn('⚠️  Could not create moving table:', tableError.message);
      console.warn('❌ Please create the table manually');
    }

  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
};

module.exports = initializeDatabase;
