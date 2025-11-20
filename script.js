// Check authentication and load user
const currentUser = requireAuth();

if (currentUser) {
  document.getElementById('nav-username').textContent = currentUser.fullName;
  document.getElementById('nav-role').textContent = currentUser.role.toUpperCase();
  document.getElementById('nav-role').className = `role-badge ${currentUser.role}`;
  
  // Hide add batch section for operators
  if (currentUser.role === 'operator') {
    const addSection = document.getElementById('add-batch-section');
    if (addSection) {
      addSection.style.display = 'none';
    }
  }
  
  // Hide logs button for operators
  if (currentUser.role === 'operator') {
    const logsBtn = document.getElementById('logs-btn');
    if (logsBtn) {
      logsBtn.style.display = 'none';
    }
  }
}

// Load batches from LocalStorage or use default data
let batches = JSON.parse(localStorage.getItem("batches")) || [
  { id: 1, number: "A102", result: "OK", date: "2025-09-14" },
  { id: 2, number: "B244", result: "FAIL", date: "2025-09-15" },
  { id: 3, number: "C311", result: "OK", date: "2025-09-16" },
];

let currentFilter = "all";
let searchQuery = "";

// Save batches to LocalStorage
function saveBatches() {
  localStorage.setItem("batches", JSON.stringify(batches));
}

// Update summary statistics
function updateSummary() {
  document.getElementById("total").textContent = batches.length;
  document.getElementById("passed").textContent = batches.filter(
    (b) => b.result === "OK"
  ).length;
  document.getElementById("failed").textContent = batches.filter(
    (b) => b.result === "FAIL"
  ).length;
}

// Render batches with delete buttons and click to view details
function renderBatches(list) {
  const container = document.getElementById("batch-list");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = '<p class="no-results">No batches found</p>';
    return;
  }

  list.forEach((b) => {
    const div = document.createElement("div");
    div.className = "batch";

    const info = document.createElement("div");
    info.className = "batch-info";
    info.innerHTML = `<strong>${b.number}</strong> — ${b.result} — ${b.date}`;
    info.onclick = () => viewDetails(b.id);

    // Only show delete button for supervisors
    if (currentUser && currentUser.role === 'supervisor') {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteBatch(b.id);
      };
      div.appendChild(deleteBtn);
    }

    div.appendChild(info);
    container.appendChild(div);
  });
}

// Filter batches by status
function filterBatches(type) {
  currentFilter = type;

  // Update active button
  document.querySelectorAll(".filters button").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  applyFilters();
}

// Apply both search and filter
function applyFilters() {
  let filtered = batches;

  // Apply status filter
  if (currentFilter !== "all") {
    filtered = filtered.filter((b) => b.result === currentFilter);
  }

  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter((b) =>
      b.number.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  renderBatches(filtered);
}

// Add new batch
const addBatchForm = document.getElementById("add-batch-form");
if (addBatchForm) {
  addBatchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Check supervisor permission
    if (!hasPermission('supervisor')) {
      alert('Only supervisors can add new batches');
      return;
    }

    const number = document.getElementById("batch-number").value;
    const result = document.getElementById("batch-result").value;
    const date = document.getElementById("batch-date").value;

    const newBatch = {
      id: Date.now(),
      number: number,
      result: result,
      date: date,
    };

    batches.push(newBatch);
    saveBatches();
    updateSummary();
    applyFilters();

    // Log action
    addLog('Batch added', `Batch ${number} - ${result}`);

    // Reset form
    this.reset();

    alert("Batch added successfully!");
  });
}

// Delete batch with confirmation
function deleteBatch(id) {
  // Check supervisor permission
  if (!hasPermission('supervisor')) {
    alert('Only supervisors can delete batches');
    return;
  }

  const batch = batches.find((b) => b.id === id);

  if (confirm(`Are you sure you want to delete batch ${batch.number}?`)) {
    batches = batches.filter((b) => b.id !== id);
    saveBatches();
    updateSummary();
    applyFilters();
    
    // Log action
    addLog('Batch deleted', `Batch ${batch.number} was removed`);
  }
}

// View batch details
function viewDetails(id) {
  localStorage.setItem("selectedBatchId", id);
  window.location.href = "details.html";
}

// Search functionality
document.getElementById("search-input").addEventListener("input", function (e) {
  searchQuery = e.target.value;
  applyFilters();
});

// Export data function
function exportData() {
  if (batches.length === 0) {
    alert('No data to export');
    return;
  }
  
  const csv = [
    ['Batch Number', 'Result', 'Date'],
    ...batches.map(b => [b.number, b.result, b.date])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `batches-export-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  // Log action
  addLog('Data exported', `${batches.length} batches exported to CSV`);
  
  alert('Data exported successfully!');
}

// Initialize
updateSummary();
renderBatches(batches);
