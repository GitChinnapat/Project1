// Test script for repair API
// Run this in your browser console or with curl

// Test 1: Create a repair request
fetch('http://localhost:5000/api/repair', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    location: 'อาคาร A ชั้น 2 ห้อง 201',
    type_work: 'electric',
    detail: 'เต้าเสียบไฟเสีย และไฟวิ่งตัด',
    img: 'photo1.jpg'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Create Response:', data);
  if (data.success) {
    console.log('✅ Repair created with ID:', data.data.id);
  }
})
.catch(error => console.error('Error:', error));

// Test 2: Get all repairs (run after a delay)
setTimeout(() => {
  fetch('http://localhost:5000/api/repair')
    .then(response => response.json())
    .then(data => console.log('All Repairs:', data))
    .catch(error => console.error('Error:', error));
}, 1000);
