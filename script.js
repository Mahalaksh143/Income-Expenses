const recordForm = document.getElementById("record-form");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const amountTypeInput = document.getElementById("amount-type");

const totalIncome = document.getElementById("income-total");
const totalExpense = document.getElementById("expense-total");
const totalBalance = document.getElementById("net-balance");

const filterAllRadio = document.getElementById("all");
const filterIncomeRadio = document.getElementById("income");
const filterExpenseRadio = document.getElementById("expense");

const recordSubmitButton = document.getElementById("record-submit");

const formMessage = document.getElementById("message");

const recordList = document.getElementById("record-list");

let records = [];
let editRecordIndex = null;

// Initial load data
const onLoad = () => {
  changeFilter("all");
  getRecords();
  createRecord();
};

// getting records from local storage and assign it in records variable
const getRecords = () => {
  const storage = localStorage.getItem("record");
  const recordData = JSON.parse(storage);
  records = recordData ?? [];
};

// Changes value of radio buttons based on value [filter]
const changeFilter = (filter) => {
  switch (filter) {
    case "income":
      filterAllRadio.checked = false;
      filterIncomeRadio.checked = true;
      filterExpenseRadio.checked = false;
      break;
    case "expense":
      filterAllRadio.checked = false;
      filterIncomeRadio.checked = false;
      filterExpenseRadio.checked = true;
      break;
    default:
      filterAllRadio.checked = true;
      filterIncomeRadio.checked = false;
      filterExpenseRadio.checked = false;
      break;
  }
  createRecord();
};

// Validating record form inputs
const formValidation = () => {
  const titleValue = titleInput.value;
  const amountValue = amountInput.value;
  const typeValue = amountTypeInput.value;
  if (
    titleValue.length === 0 ||
    amountValue.length === 0 ||
    typeValue.length === 0
  ) {
    formMessage.innerHTML = "<b>Please fill all the fields</b>";
  } else {
    formMessage.innerHTML = "";
    updateRecord();
    resetRecord();
  }
};

// Adding event listener for submit of record form
recordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formValidation();
});

// Updating records based on 'editRecordIndex' and store states in local storage for persisting data
const updateRecord = () => {
  const record = {
    title: titleInput.value,
    amount: amountInput.value,
    type: amountTypeInput.value,
  };
  if (editRecordIndex === null) {
    records.push(record);
  } else {
    records.splice(editRecordIndex, 1, record);
    editRecordIndex = null;
    recordSubmitButton.innerText = "Add Record";
  }
  localStorage.setItem("record", JSON.stringify(records));
  createRecord();
};

// Based on records creating Record Cards and updating balance text
const createRecord = () => {
  recordList.innerHTML = "";
  // Updating balance text
  totalIncome.innerText = records.reduce(function (acc, cv) {
    if (cv.type.toLowerCase() === "income") {
      acc += +cv.amount;
    }
    return acc;
  }, 0);
  totalExpense.innerText = records.reduce(function (acc, cv) {
    if (cv.type.toLowerCase() === "expense") {
      acc += +cv.amount;
    }
    return acc;
  }, 0);
  totalBalance.innerText = records.reduce(function (acc, cv) {
    if (cv.type.toLowerCase() === "income") {
      acc += +cv.amount;
    } else {
      acc -= +cv.amount;
    }
    return acc;
  }, 0);
  if (records.length === 0) {
    recordList.innerHTML += `
    <div class="mx-auto h-full flex items-center justify-center" >
    <p class="text-lg text-center">Add expense / income to show them here</p>
    </div>
    `;
    return;
  }
  records
    .filter((ele) => {
      if (filterAllRadio.checked) {
        return true;
      } else if (filterIncomeRadio.checked) {
        return ele.type.toLowerCase() === "income";
      } else {
        return ele.type.toLowerCase() === "expense";
      }
    })
    .map((ele, index) => {
      return (recordList.innerHTML += `
        <div id='record-${index}' class="flex flex-col sm:flex-row justify-between items-center border my-4 rounded-md p-4" >
            <div class="flex-1 self-stretch" >
                <div class="flex gap-4 justify-between sm:justify-start" >
                    <h4 class="text-xl font-semibold " >${ele.title}</h4>
                    <div class="${
                      ele.type.toLowerCase() === "income"
                       ? "bg-purple-100"
                       : "bg-blue-100"
                       
                    } self-center rounded-xl text-sm font-medium py-1 px-3" >${
        ele.type
      }                </div>
                </div>
                <p class="text-base" >Rs. ${ele.amount}</p>
            </div>
            <div class="flex gap-16 sm:gap-8 mt-2 sm:mt-0" >
                <i class="fa-duotone fa-solid fa-pen-to-square cursor-pointer" onclick="editRecord(${index})" ></i>
                <i class="fa-duotone fa-solid fa-trash cursor-pointer" onclick="removeRecord(${index})"></i>
            </div>
        </div>
        `);
    });
};

// To retrieve and update record data in input fields
const editRecord = (recordIndex) => {
  editRecordIndex = recordIndex;
  const record = records.at(recordIndex);
  if (record === null || record === undefined) {
    console.log("Edit record not found", records);
    return;
  }
  titleInput.value = record.title;
  amountInput.value = record.amount;
  amountTypeInput.value = record.type;
  recordSubmitButton.innerText = "Update Record";
};

// Remove record using given record index
const removeRecord = (recordIndex) => {
  records = records.filter((_, index) => recordIndex !== index);
  localStorage.setItem("record", JSON.stringify(records));
  createRecord();
};

// Reset to default value
const resetRecord = () => {
  titleInput.value = "";
  amountInput.value = "";
  amountTypeInput.value = "";
  if (editRecordIndex != null) {
    recordSubmitButton.innerText = "Add Record";
    editRecordIndex = null;
  }
};