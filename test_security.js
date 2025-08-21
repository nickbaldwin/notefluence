// Security Test Script
// Run this in your browser console to test the security fix

console.log('🔒 Testing Notefluence Security...');

// Test 1: Check if user is authenticated
async function testAuthentication() {
  console.log('1. Testing authentication...');
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('❌ Authentication error:', error);
    return false;
  }
  
  if (!user) {
    console.log('⚠️  No user authenticated');
    return false;
  }
  
  console.log('✅ User authenticated:', user.email);
  console.log('   User ID:', user.id);
  return user;
}

// Test 2: Check current projects
async function testProjectAccess() {
  console.log('2. Testing project access...');
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, owner_id, created_at')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error fetching projects:', error);
    return;
  }
  
  console.log('📋 Found projects:', projects.length);
  projects.forEach(project => {
    console.log(`   - ${project.title} (Owner: ${project.owner_id})`);
  });
  
  return projects;
}

// Test 3: Verify RLS is working
async function testRLS() {
  console.log('3. Testing RLS policies...');
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log('⚠️  No user to test RLS with');
    return;
  }
  
  // Try to fetch all projects (RLS should filter)
  const { data: allProjects, error } = await supabase
    .from('projects')
    .select('*');
  
  if (error) {
    console.error('❌ RLS test error:', error);
    return;
  }
  
  // Check if all returned projects belong to current user
  const userProjects = allProjects.filter(p => p.owner_id === user.id);
  const otherProjects = allProjects.filter(p => p.owner_id !== user.id);
  
  console.log(`📊 RLS Results:`);
  console.log(`   - Total projects returned: ${allProjects.length}`);
  console.log(`   - User's projects: ${userProjects.length}`);
  console.log(`   - Other users' projects: ${otherProjects.length}`);
  
  if (otherProjects.length > 0) {
    console.error('❌ SECURITY BREACH: User can see other users\' projects!');
    console.log('   Other projects found:', otherProjects.map(p => p.title));
  } else {
    console.log('✅ RLS working correctly - user can only see their own projects');
  }
}

// Test 4: Clear cache and retest
async function clearCacheAndRetest() {
  console.log('4. Clearing cache and retesting...');
  
  // Clear Supabase cache
  if (window.supabase?.rest?.clearCache) {
    window.supabase.rest.clearCache();
    console.log('   Cleared Supabase cache');
  }
  
  // Clear local storage
  localStorage.clear();
  sessionStorage.clear();
  console.log('   Cleared local storage');
  
  // Wait a moment and retest
  setTimeout(async () => {
    console.log('   Retesting after cache clear...');
    await testProjectAccess();
    await testRLS();
  }, 1000);
}

// Run all tests
async function runSecurityTests() {
  console.log('🚀 Starting security tests...\n');
  
  const user = await testAuthentication();
  if (!user) {
    console.log('❌ Cannot run tests without authentication');
    return;
  }
  
  console.log('');
  await testProjectAccess();
  
  console.log('');
  await testRLS();
  
  console.log('');
  await clearCacheAndRetest();
  
  console.log('\n🏁 Security tests completed!');
  console.log('If you see any ❌ errors above, there is a security issue that needs immediate attention.');
}

// Run the tests
runSecurityTests();
