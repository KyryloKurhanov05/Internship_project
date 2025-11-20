// Check authentication
const currentUser = requireAuth();

if (currentUser) {
  document.getElementById('nav-username').textContent = currentUser.fullName;
  document.getElementById('nav-role').textContent = currentUser.role.toUpperCase();
  document.getElementById('nav-role').className = `role-badge ${currentUser.role}`;
}

// Load and display logs
function loadLogs() {
  const logs = JSON.parse(localStorage.getItem('activityLogs')) || [];
  const searchQuery = document.getElementById('log-search').value.toLowerCase();
  const filterType = document.getElementById('log-filter').value;
  
  let filteredLogs = logs;
  
  // Apply search filter
  if (searchQuery) {
    filteredLogs = filteredLogs.filter(log => 
      log.action.toLowerCase().includes(searchQuery) ||
      log.details.toLowerCase().includes(searchQuery) ||
      log.user.toLowerCase().includes(searchQuery)
    );
  }
  
  // Apply type filter
  if (filterType !== 'all') {
    filteredLogs = filteredLogs.filter(log => {
      if (filterType === 'login') return log.action.includes('logged');
      if (filterType === 'batch') return log.action.includes('Batch') || log.action.includes('batch');
      if (filterType === 'export') return log.action.includes('export');
      return true;
    });
  }
  
  displayLogs(filteredLogs);
}

function displayLogs(logs) {
  const container = document.getElementById('logs-list');
  
  if (logs.length === 0) {
    container.innerHTML = '<div class="no-logs">No activity logs found</div>';
    return;
  }
  
  container.innerHTML = logs.map(log => {
    const date = new Date(log.timestamp);
    const timeString = date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    return `
      <div class="log-entry">
        <div class="log-time">${timeString}</div>
        <div class="log-content">
          <div class="log-header">
            <span class="log-user">${log.user}</span>
            <span class="role-badge ${log.role}">${log.role.toUpperCase()}</span>
          </div>
          <div class="log-action">${log.action}</div>
          ${log.details ? `<div class="log-details">${log.details}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function clearLogs() {
  if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
    addLog('Cleared all activity logs', 'All logs were deleted');
    const lastLog = JSON.parse(localStorage.getItem('activityLogs'))[0];
    localStorage.setItem('activityLogs', JSON.stringify([lastLog]));
    loadLogs();
  }
}

function exportLogs() {
  const logs = JSON.parse(localStorage.getItem('activityLogs')) || [];
  
  if (logs.length === 0) {
    alert('No logs to export');
    return;
  }
  
  const csv = [
    ['Timestamp', 'User', 'Role', 'Action', 'Details'],
    ...logs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.user,
      log.role,
      log.action,
      log.details
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  addLog('Exported activity logs', `${logs.length} log entries`);
}

// Event listeners
document.getElementById('log-search').addEventListener('input', loadLogs);
document.getElementById('log-filter').addEventListener('change', loadLogs);

// Initial load
loadLogs();
