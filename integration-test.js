#!/usr/bin/env node

/**
 * Manual Integration Test Script
 * This script tests the frontend-backend integration without requiring an OpenAI API key
 */

console.log('🚀 Starting AI Web Scraper Integration Test...\n');

// Test 1: Backend Health Check
console.log('1. Testing Backend Health...');
fetch('http://localhost:8000/api/status')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Backend Status:', data);
    
    // Test 2: Frontend Accessibility
    console.log('\n2. Testing Frontend Accessibility...');
    return fetch('http://localhost:5173/');
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ Frontend accessible at http://localhost:5173');
      
      // Test 3: API Documentation
      console.log('\n3. Testing API Documentation...');
      return fetch('http://localhost:8000/docs');
    } else {
      throw new Error('Frontend not accessible');
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ API Documentation accessible at http://localhost:8000/docs');
      
      // Test 4: Form Validation (Expected to fail without API key)
      console.log('\n4. Testing Form Validation (Expected Error)...');
      return fetch('http://localhost:8000/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'https://example.com',
          prompt: 'Extract the main heading',
          output_format: 'text'
        })
      });
    } else {
      throw new Error('API Documentation not accessible');
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.error && data.message.includes('OpenAI API key not configured')) {
      console.log('✅ Error handling working correctly:', data.message);
      console.log('\n🎯 Integration Test Summary:');
      console.log('   ✅ Backend API: Working');
      console.log('   ✅ Frontend: Working'); 
      console.log('   ✅ API Docs: Working');
      console.log('   ✅ Error Handling: Working');
      console.log('   🔧 Missing: OpenAI API key for full functionality');
      console.log('\n✨ All systems operational! Ready for production with API key setup.');
    } else {
      console.log('⚠️  Unexpected response:', data);
    }
  })
  .catch(error => {
    console.error('❌ Test failed:', error.message);
    console.log('\n📋 Troubleshooting:');
    console.log('   - Ensure backend is running: uvicorn app.main:app --reload');
    console.log('   - Ensure frontend is running: npm run dev');
    console.log('   - Check ports 8000 and 5173 are available');
  });
