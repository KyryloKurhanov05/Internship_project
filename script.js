
const batches = [
  { number: 'A102', result:'OK', date:'2025-09-14' },
  { number: 'B244', result:'FAIL', date:'2025-09-15' },
  { number: 'C311', result:'OK', date:'2025-09-16' }
];

function updateSummary(){
  document.getElementById('total').textContent = batches.length;
  document.getElementById('passed').textContent = batches.filter(b=>b.result==='OK').length;
  document.getElementById('failed').textContent = batches.filter(b=>b.result==='FAIL').length;
}

function renderBatches(list){
  const container = document.getElementById('batch-list');
  container.innerHTML = '';
  list.forEach(b=>{
    const div = document.createElement('div');
    div.className='batch';
    div.textContent = `${b.number} — ${b.result} — ${b.date}`;
    container.appendChild(div);
  });
}

function filterBatches(type){
  if(type==='all'){ renderBatches(batches); }
  else { renderBatches(batches.filter(b=>b.result===type)); }
}

updateSummary();
renderBatches(batches);
