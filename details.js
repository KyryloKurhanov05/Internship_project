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
  const newNumber = prompt("Enter new batch number:", batch.number);
  if (newNumber && newNumber !== batch.number) {
    batch.number = newNumber;
    saveBatchChanges();
    document.getElementById("detail-number").textContent = batch.number;
    alert("Batch updated successfully!");
  }
}

// Delete batch from details page
function deleteBatchFromDetails() {
  if (confirm(`Are you sure you want to delete batch ${batch.number}?`)) {
    const updatedBatches = batches.filter((b) => b.id !== batchId);
    localStorage.setItem("batches", JSON.stringify(updatedBatches));
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
