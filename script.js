const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const exportBtn = document.getElementById('export-btn');

// LocalStorage se data check karein
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Transaction ko UI mein add karna
function addTransactionDOM(transaction) {
  // Sign check (+ ya -)
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  // Class add karein (plus ya minus color ke liye)
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Balance aur Income/Expense ko update karna
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balance.innerText = `₹${total}`;
  money_plus.innerText = `+₹${income}`;
  money_minus.innerText = `-₹${expense}`;
}

// Transaction ko Add karna
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value // string ko number mein badalne ke liye +
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

// Random ID generate karna
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Transaction ko Delete karna
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// LocalStorage mein save karna
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// CSV Export Function (Excel ke liye)
function exportCSV() {
    if(transactions.length === 0) {
        alert("No transactions to export!");
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,ID,Text,Amount\n";
    transactions.forEach(row => {
        csvContent += `${row.id},${row.text},${row.amount}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
}

// App start karna
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

// Event Listeners
form.addEventListener('submit', addTransaction);
exportBtn.addEventListener('click', exportCSV);
