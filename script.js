const modalOverlay = document.querySelector('.modalOverlay');
const employeeListContainer = document.querySelector('#employeeList');
const inputName = document.querySelector('#employeeName');
const inputRole = document.querySelector('#employeeRole');
const inputEmail = document.querySelector('#employeeEmail');
const inputCPF = document.querySelector('#employeeCPF');
const inputPhone = document.querySelector('#employeePhone');
const inputCEP = document.querySelector('#employeeCEP');
const inputState = document.querySelector('#employeeState');
const inputCountry = document.querySelector('#employeeCountry');
const inputAddress = document.querySelector('#employeeAddress');
const btnSaveEmployee = document.querySelector('#btnSaveEmployee');

let employeeList = [];
let currentId;


function CountryUSER() {
  const countries = ['Brasil', 'Estados Unidos', 'Canadá', 'Argentina', 'Portugal', 'Espanha'];
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    inputCountry.appendChild(option);
  });
}

CountryUSER();


async function fetchAddress() {
  const cep = inputCEP.value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) throw new Error('CEP não encontrado');

    inputState.value = data.uf;
    inputAddress.value = `${data.logradouro}, ${data.bairro}`;
  } catch (error) {
    alert('Erro ao buscar o CEP. Verifique e tente novamente.');
  }
}

function openModal(isEdit = false, index = null) {
  modalOverlay.classList.add('active');

  if (isEdit && index !== null) {
    const employee = employeeList[index];
    inputName.value = employee.name;
    inputRole.value = employee.role;
    inputEmail.value = employee.email;
    inputCPF.value = employee.cpf;
    inputPhone.value = employee.phone;
    inputCEP.value = employee.cep;
    inputState.value = employee.state;
    inputCountry.value = employee.country;
    inputAddress.value = employee.address;
    currentId = index;
  } else {
    inputName.value = '';
    inputRole.value = '';
    inputEmail.value = '';
    inputCPF.value = '';
    inputPhone.value = '';
    inputCEP.value = '';
    inputState.value = '';
    inputCountry.value = '';
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

  const errorMessage = document.querySelector('#errorMessage'); 

  if (
    !inputName.value.trim() ||
    !inputRole.value.trim() ||
    !inputEmail.value.trim() ||
    !inputCPF.value.trim() ||
    !inputPhone.value.trim() ||
    !inputCEP.value.trim() ||
    !inputState.value.trim() ||
    !inputCountry.value.trim() ||
    !inputAddress.value.trim()
  ) {
   
    errorMessage.textContent = 'Por favor, preencha todos os campos antes de salvar.';
    errorMessage.style.display = 'inline'; 
    return; 
  }

  errorMessage.style.display = 'none';

  const employeeData = {
    name: inputName.value,
    role: inputRole.value,
    email: inputEmail.value,
    cpf: inputCPF.value,
    phone: inputPhone.value,
    cep: inputCEP.value,
    state: inputState.value,
    country: inputCountry.value,
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
      <div class="tags ">
        <span><strong>Nome</strong>: ${employee.name}</span>
        <span><strong>Função</strong>: ${employee.role}</span>
        <span><strong>Email</strong>: ${employee.email}</span>
        <span><strong>CPF</strong>: ${employee.cpf}</span>
        <div class="inlineItens">
          <span><strong>Telefone</strong>: ${employee.phone}</span>
          <span><strong>CEP</strong>: ${employee.cep}</span>
        </div>
        <div class="inlineItens">
          <span><strong>Estado</strong>: ${employee.state}</span>
          <span><strong>País</strong>: ${employee.country}</span>
        </div>
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