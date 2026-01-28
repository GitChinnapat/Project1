const axios = require('axios');

// Test API connectivity
async function testRepairAPI() {
  console.log('🧪 Testing Repair API...\n');

  const API_URL = 'http://localhost:5000/api/repair';

  try {
    // Test 1: Server health check
    console.log('1️⃣  Testing server connectivity...');
    const healthCheck = await axios.get('http://localhost:5000/');
    console.log('✅ Server is running:', healthCheck.data);
    console.log();

    // Test 2: Create repair
    console.log('2️⃣  Creating a repair request...');
    const createRes = await axios.post(API_URL, {
      location: 'ห้อง Test 101',
      type_work: 'electric',
      detail: 'ทดสอบระบบแจ้งซ่อม',
      img: 'test-image.jpg'
    });
    console.log('✅ Repair created:', createRes.data);
    console.log();

    const repairId = createRes.data.data?.id;

    // Test 3: Get all repairs
    console.log('3️⃣  Fetching all repairs...');
    const allRes = await axios.get(API_URL);
    console.log(`✅ Found ${allRes.data.data?.length || 0} repairs`);
    console.log();

    // Test 4: Get specific repair
    if (repairId) {
      console.log(`4️⃣  Fetching repair #${repairId}...`);
      const getRes = await axios.get(`${API_URL}/${repairId}`);
      console.log('✅ Repair found:', getRes.data.data);
      console.log();

      // Test 5: Update repair
      console.log(`5️⃣  Updating repair #${repairId}...`);
      const updateRes = await axios.put(`${API_URL}/${repairId}`, {
        location: 'ห้อง Test 102 - Updated',
        type_work: 'plumbing',
        detail: 'ทดสอบการอัปเดต',
        img: 'updated-image.jpg'
      });
      console.log('✅ Repair updated:', updateRes.data);
      console.log();

      // Test 6: Delete repair
      console.log(`6️⃣  Deleting repair #${repairId}...`);
      const deleteRes = await axios.delete(`${API_URL}/${repairId}`);
      console.log('✅ Repair deleted:', deleteRes.data);
    }

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Error during testing:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

// Run tests
testRepairAPI();
