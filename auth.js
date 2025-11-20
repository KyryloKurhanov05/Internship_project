// Demo users database
const users = [
  { username: 'admin', password: 'admin123', role: 'supervisor', fullName: 'Admin Supervisor' },
  { username: 'operator', password: 'oper123', role: 'operator', fullName: 'John Operator' }
];

// Check if user is already logged in
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    return currentUser;
  }
  return null;
}

// Redirect to login if not authenticated
function requireAuth() {
  const user = checkAuth();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

// Login form handler
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Store user without password
      const userSession = {
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      
      // Log the login action
      addLog('User logged in', `${user.fullName} (${user.role})`);
      
      window.location.href = 'index.html';
    } else {
      alert('Invalid username or password');
    }
  });
}

// Logout function
function logout() {
  const user = checkAuth();
  if (user) {
    addLog('User logged out', `${user.fullName} (${user.role})`);
  }
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Add log entry
function addLog(action, details = '') {
  const logs = JSON.parse(localStorage.getItem('activityLogs')) || [];
  const user = checkAuth();
  
  const logEntry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    user: user ? user.fullName : 'Unknown',
    role: user ? user.role : 'unknown',
    action: action,
    details: details
  };
  
  logs.unshift(logEntry); // Add to beginning
  
  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.pop();
  }
  
  localStorage.setItem('activityLogs', JSON.stringify(logs));
}

// Check role permission
function hasPermission(requiredRole) {
  const user = checkAuth();
  if (!user) return false;
  
  if (requiredRole === 'supervisor') {
    return user.role === 'supervisor';
  }
  
  return true; // All authenticated users have operator permissions
}
