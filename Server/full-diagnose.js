#!/usr/bin/env node

/**
 * 🧪 Comprehensive Repair System Diagnostics
 * ทดสอบระบบแจ้งซ่อมทั้งหมด (Database, Server, API)
 */

const axios = require('axios');
const mysql = require('mysql2/promise');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, symbol, message) {
  console.log(`${color}${symbol} ${message}${colors.reset}`);
}

async function runDiagnostics() {
  log(colors.cyan, '🧪', '========== Repair System Diagnostics ==========\n');

  const results = {
    database: false,
    table: false,
    server: false,
    api: false,
    data: false
  };

  // Test 1: MySQL Connection
  log(colors.blue, '1️⃣ ', 'Testing MySQL Connection...');
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'servicereq_db'
    });
    
    await connection.ping();
    log(colors.green, '✅', 'MySQL Connection: Success');
    results.database = true;

    // Test 2: Check Repair Table Structure
    log(colors.blue, '2️⃣ ', 'Checking Repair Table Structure...');
    const [columns] = await connection.execute('DESCRIBE repair');
    
    const expectedColumns = ['id', 'user_id', 'user_name', 'location', 'type_work', 'detail', 'img', 'created_at'];
    const actualColumns = columns.map(col => col.Field);
    
    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
    
    if (missingColumns.length === 0) {
      log(colors.green, '✅', `Repair Table Structure: Complete (${actualColumns.length} columns)`);
      results.table = true;
      
      console.log('\n   📋 Table Structure:');
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type}`);
      });
    } else {
      log(colors.red, '❌', `Missing columns: ${missingColumns.join(', ')}`);
    }

    // Test 3: Count Records
    log(colors.blue, '3️⃣ ', 'Counting Repair Records...');
    const [[{ count }]] = await connection.execute('SELECT COUNT(*) as count FROM repair');
    log(colors.green, '✅', `Total Records: ${count}`);

    // Test 4: Sample Data
    if (count > 0) {
      log(colors.blue, '4️⃣ ', 'Fetching Sample Data...');
      const [samples] = await connection.execute('SELECT * FROM repair LIMIT 3');
      log(colors.green, '✅', `Sample Records (showing ${samples.length}):`);
      samples.forEach((row, index) => {
        console.log(`\n   Record #${index + 1}:`);
        Object.entries(row).forEach(([key, value]) => {
          const displayValue = value === null ? '[NULL]' : value;
          console.log(`   - ${key}: ${displayValue}`);
        });
      });
    } else {
      log(colors.yellow, '⚠️ ', 'No repair records found. This is normal for a new system.');
    }

    await connection.end();

  } catch (error) {
    log(colors.red, '❌', `MySQL Error: ${error.message}`);
    console.error('   Details:', error);
    return showResults(results);
  }

  // Test 5: Check if Server is Running
  log(colors.blue, '5️⃣ ', 'Checking if Server is Running (Port 5000)...');
  try {
    const response = await axios.get('http://localhost:5000/api/repair', {
      timeout: 3000
    });
    log(colors.green, '✅', `Server is Running: Received ${response.data.data?.length || 0} records from API`);
    results.server = true;
    results.api = true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log(colors.red, '❌', 'Server is NOT running on port 5000');
      log(colors.yellow, '💡', 'Run: cd e:\\Project_Final\\Server && npm start');
    } else {
      log(colors.red, '❌', `Server Error: ${error.message}`);
    }
  }

  // Test 6: Test CREATE API
  log(colors.blue, '6️⃣ ', 'Testing CREATE API (POST /api/repair)...');
  const testData = {
    user_id: 1,
    user_name: 'Test User',
    location: 'Test Location',
    type_work: 'Test Work',
    detail: 'Test detail',
    img: null
  };

  try {
    const response = await axios.post('http://localhost:5000/api/repair', testData, {
      timeout: 3000
    });

    if (response.data.success) {
      log(colors.green, '✅', `CREATE API: Success (ID: ${response.data.data.id})`);
      results.data = true;
    } else {
      log(colors.red, '❌', `CREATE API failed: ${response.data.message}`);
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log(colors.red, '❌', 'Server is not running');
    } else {
      log(colors.red, '❌', `CREATE API Error: ${error.message}`);
      if (error.response?.data) {
        console.log('   Response:', error.response.data);
      }
    }
  }

  showResults(results);
}

function showResults(results) {
  console.log('\n' + colors.cyan + '========== Test Results ==========\n' + colors.reset);
  
  const checks = [
    { name: 'MySQL Database Connection', passed: results.database },
    { name: 'Repair Table Structure', passed: results.table },
    { name: 'Server Running', passed: results.server },
    { name: 'API Working', passed: results.api },
    { name: 'Data Persistence', passed: results.data }
  ];

  checks.forEach(check => {
    const symbol = check.passed ? colors.green + '✅' : colors.red + '❌';
    const status = check.passed ? 'PASS' : 'FAIL';
    console.log(`${symbol}${colors.reset} ${check.name}: ${status}`);
  });

  const totalPassed = Object.values(results).filter(v => v).length;
  const total = Object.values(results).length;

  console.log('\n' + colors.cyan + `Summary: ${totalPassed}/${total} tests passed\n` + colors.reset);

  if (totalPassed === total) {
    log(colors.green, '🎉', 'All tests passed! System is working correctly.');
  } else {
    log(colors.yellow, '⚠️ ', 'Some tests failed. Please check the details above.');
  }

  console.log('\n' + colors.cyan + '========== Next Steps ==========\n' + colors.reset);

  if (!results.database) {
    console.log('1. Make sure MySQL is running');
    console.log('2. Check database credentials in Server/.env');
    console.log('3. Run: CREATE DATABASE servicereq_db CHARACTER SET utf8mb4;\n');
  }

  if (!results.server) {
    console.log('1. Start the server: cd e:\\Project_Final\\Server && npm start\n');
  }

  if (!results.api) {
    console.log('1. Check Server logs for errors\n');
  }

  console.log('\n💡 For more help, see TESTING_GUIDE.md or SYSTEM_README.md\n');
}

// Run diagnostics
runDiagnostics().catch(err => {
  log(colors.red, '❌', `Fatal Error: ${err.message}`);
  process.exit(1);
});
