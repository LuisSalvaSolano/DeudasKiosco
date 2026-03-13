const form = document.getElementById('debt-form');
const debtList = document.getElementById('debt-list');
const totalDisplay = document.getElementById('total-debt');
const submitBtn = document.getElementById('submit-btn');

let debts = JSON.parse(localStorage.getItem('debts')) || [];
let editId = null; // Para saber si estamos editando o creando

function updateUI() {
    debtList.innerHTML = '';
    let total = 0;

    // Dentro de updateUI()...
debts.forEach((debt) => {
    total += parseFloat(debt.amount);
    const row = document.createElement('tr');
    row.innerHTML = `
        <td data-label="Fecha">${debt.date}</td>
        <td data-label="Cliente">${debt.client}</td>
        <td data-label="Monto">$${parseFloat(debt.amount).toLocaleString()}</td>
        <td data-label="Acciones">
            <button class="edit-btn" onclick="prepareEdit('${debt.id}')">Editar</button>
            <button class="delete-btn" onclick="removeDebt('${debt.id}')">Eliminar</button>
        </td>
    `;
    debtList.appendChild(row);
});

    totalDisplay.innerText = `$${total.toLocaleString()}`;
    localStorage.setItem('debts', JSON.stringify(debts));
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const client = document.getElementById('client').value;
    const amount = document.getElementById('amount').value;
    const now = new Date();
    const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

    if (editId) {
        // Modo Edición
        debts = debts.map(d => d.id === editId ? { ...d, client, amount, date: dateStr + " (editado)" } : d);
        editId = null;
        submitBtn.innerText = "Agregar";
    } else {
        // Modo Nuevo
        debts.push({ id: Date.now().toString(), client, amount, date: dateStr });
    }

    form.reset();
    updateUI();
});

function prepareEdit(id) {
    const debt = debts.find(d => d.id === id);
    document.getElementById('client').value = debt.client;
    document.getElementById('amount').value = debt.amount;
    editId = id;
    submitBtn.innerText = "Actualizar";
    document.getElementById('client').focus();
}

function removeDebt(id) {
    if(confirm("¿Eliminar este registro?")) {
        debts = debts.filter(d => d.id !== id);
        updateUI();
    }
}

updateUI();