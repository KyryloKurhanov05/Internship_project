// Check authentication
const currentUser = requireAuth();

if (currentUser) {
  document.getElementById('nav-username').textContent = currentUser.fullName;
  document.getElementById('nav-role').textContent = currentUser.role.toUpperCase();
  document.getElementById('nav-role').className = `role-badge ${currentUser.role}`;
  
  // Hide edit/delete buttons for operators
  if (currentUser.role === 'operator') {
    const editBtn = document.getElementById('edit-btn');
    const deleteBtn = document.getElementById('delete-btn');
    if (editBtn) editBtn.style.display = 'none';
    if (deleteBtn) deleteBtn.style.display = 'none';
  }
}

// Load batch details
const batchId = parseInt(localStorage.getItem("selectedBatchId"));
const batches = JSON.parse(localStorage.getItem("batches")) || [];
const batch = batches.find((b) => b.id === batchId);

if (batch) {
  document.getElementById("detail-number").textContent = batch.number;
  document.getElementById("detail-result").textContent = batch.result;
  document.getElementById("detail-result").className =
    "detail-value " + (batch.result === "OK" ? "ok" : "fail");
  document.getElementById("detail-date").textContent = batch.date;
  document.getElementById("detail-status").textContent =
    batch.result === "OK" ? "Approved" : "Requires Attention";
  document.getElementById("detail-status").className =
    "detail-value " + (batch.result === "OK" ? "ok" : "fail");
} else {
  document.getElementById("batch-details").style.display = "none";
  document.getElementById("not-found").style.display = "block";
}

// Edit batch function
function editBatch() {
  // Check supervisor permission
  if (!hasPermission('supervisor')) {
    alert('Only supervisors can edit batches');
    return;
  }

  const newNumber = prompt("Enter new batch number:", batch.number);
  if (newNumber && newNumber !== batch.number) {
    const oldNumber = batch.number;
    batch.number = newNumber;
    saveBatchChanges();
    document.getElementById("detail-number").textContent = batch.number;
    
    // Log action
    addLog('Batch edited', `Batch ${oldNumber} renamed to ${newNumber}`);
    
    alert("Batch updated successfully!");
  }
}

// Delete batch from details page
function deleteBatchFromDetails() {
  // Check supervisor permission
  if (!hasPermission('supervisor')) {
    alert('Only supervisors can delete batches');
    return;
  }

  if (confirm(`Are you sure you want to delete batch ${batch.number}?`)) {
    const updatedBatches = batches.filter((b) => b.id !== batchId);
    localStorage.setItem("batches", JSON.stringify(updatedBatches));
    
    // Log action
    addLog('Batch deleted', `Batch ${batch.number} was removed`);
    
    alert("Batch deleted successfully!");
    window.location.href = "index.html";
  }
}

// Save batch changes
function saveBatchChanges() {
  const batchIndex = batches.findIndex((b) => b.id === batchId);
  if (batchIndex !== -1) {
    batches[batchIndex] = batch;
    localStorage.setItem("batches", JSON.stringify(batches));
  }
}
