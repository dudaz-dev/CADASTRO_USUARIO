const modalOverlay = document.querySelector('.modalOverlay');
const employeeListContainer = document.querySelector('#employeeList');
const inputName = document.querySelector('#employeeName');
const inputRole = document.querySelector('#employeeRole');
const inputEmail = document.querySelector('#employeeEmail');
const inputCPF = document.querySelector('#employeeCPF');
const inputAddress = document.querySelector('#employeeAddress');
const btnSaveEmployee = document.querySelector('#btnSaveEmployee');

let employeeList = [];
let currentId;

function openModal(isEdit = false, index = null) {
  modalOverlay.classList.add('active');

  if (isEdit && index !== null) {
    inputName.value = employeeList[index].name;
    inputRole.value = employeeList[index].role;
    inputEmail.value = employeeList[index].email;
    inputCPF.value = employeeList[index].cpf;
    inputAddress.value = employeeList[index].address;
    currentId = index;
  } else {
    inputName.value = '';
    inputRole.value = '';
    inputEmail.value = '';
    inputCPF.value = '';
    inputAddress.value = '';
    currentId = null;
  }
}

function closeModal() {
  modalOverlay.classList.remove('active');
}

modalOverlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('modalOverlay')) {
    closeModal();
  }
});

btnSaveEmployee.addEventListener('click', (e) => {
  e.preventDefault();

  if (!inputName.value || !inputRole.value || !inputEmail.value || !inputCPF.value || !inputAddress.value) return;

  const employeeData = {
    name: inputName.value,
    role: inputRole.value,
    email: inputEmail.value,
    cpf: inputCPF.value,
    address: inputAddress.value,
  };

  if (currentId !== null) {
    employeeList[currentId] = employeeData;
  } else {
    employeeList.push(employeeData);
  }

  saveEmployeesToStorage();
  loadEmployeeList();
  closeModal();
});

function loadEmployeeList() {
  employeeListContainer.innerHTML = '';
  employeeList = getEmployeesFromStorage();

  employeeList.forEach((employee, index) => {
    const card = document.createElement('div');
    card.classList.add('employeeCard');

    card.innerHTML = `
      <div class="tags">
        <span><strong>Nome</strong>: ${employee.name}</span>
        <span><strong>Função</strong>: ${employee.role}</span>
        <span><strong>Email</strong>: ${employee.email}</span>
        <span><strong>CPF</strong>: ${employee.cpf}</span>
        <span><strong>Endereço</strong>: ${employee.address}</span>
      </div>
      <div class="actionButtons">
        <button onclick="openModal(true, ${index})">
          <span class="material-symbols-outlined">edit_square</span>
        </button>
        <button onclick="deleteEmployee(${index})">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    `;

    employeeListContainer.appendChild(card);
  });
}

function deleteEmployee(index) {
  employeeList.splice(index, 1);
  saveEmployeesToStorage();
  loadEmployeeList();
}

function getEmployeesFromStorage() {
  return JSON.parse(localStorage.getItem('employeeData')) || [];
}

function saveEmployeesToStorage() {
  localStorage.setItem('employeeData', JSON.stringify(employeeList));
}

loadEmployeeList();