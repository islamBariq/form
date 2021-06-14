let accountInfo = {};
let vehicles = [];
let selectVehicles = document.getElementById('selectVehicle');
let reportChange = document.getElementById('report');
let REPORT_scheduler = null;
let speedValue = null;
let ExtraParameters = document.querySelectorAll('.extraParamter');
let options = [];
let option = { label: '', value: '' };
let bearer = [];
let multiSelect = document.getElementById('sample-select');
let id = 3;
let token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAc2FmZXJvYWQuY29tLnNhIiwiaWF0IjoxNjIzNjU2MjY0fQ.A3jw8cYEHMHxN0YKKYesjX5xMlTmGsvswunvAWcF-UI';

showExtraParamter();
getUser();
getVehicles();

function showExtraParamter() {
  reportChange.addEventListener('change', () => {
    if (
      reportChange.value === 'Over_Speed' ||
      reportChange.value === 'Speed_Over_Duration'
    ) {
      ExtraParameters.forEach((par) => {
        par.classList.remove('hide');
      });
    } else {
      ExtraParameters.forEach((par) => {
        par.classList.add('hide');
      });
    }
  });
}

function getUser() {
  axios
    .get(`http://api.saferoad.net:6010/account/${id}`, {
      headers: {
        Authorization: 'bearer ' + token,
      },
    })
    .then((response) => {
      accountInfo = response;
    });
}
VirtualSelect.init({
  ele: '#sample-select',
  options: [],
  multiple: true,
  search: false,
});
function checkMultiSelect() {
  multiSelect.addEventListener('change', function () {
    if (multiSelect.value.length >= 1) {
      document.querySelector('.vscomp-wrapper').classList.add('green');
    }
  });

  if (multiSelect.value.length === 0) {
    document.querySelector('.vscomp-wrapper').classList.add('red');

    return true;
  } else {
    document.querySelector('.vscomp-wrapper').classList.add('green');

    return false;
  }
}

function getVehicles() {
  axios
    .get(`http://api.saferoad.net:6010/vehicle/?account_id=${id}`, {
      headers: {
        Authorization: 'bearer ' + token,
      },
    })
    .then((response) => {
      vehicles = response.data;
      vehicles.map((vehicle) => {
        option.label = vehicle.PlateNumber;
        option.value = vehicle.PlateNumber;
        options.push(option);
      });
      document.querySelector('#sample-select').setOptions(options);
    });
}

function submitTOServer(event) {
  checkMultiSelect();
  let RecurringValue = null;
  document.getElementsByName('mandatory').forEach((radio) => {
    if (radio.checked) {
      RecurringValue = radio.value;
    }
  });

  event.preventDefault();
  REPORT_scheduler = {
    Account_ID: accountInfo.AccountID,
    Account_Name: accountInfo.AccountName,
    Email_to: document.getElementById('email_to').value,
    Email_cc: document.getElementById('email_cc').value,
    vehicles: multiSelect.value,
    Report_type: document.getElementById('report').value,
    Recurring: RecurringValue,
    Speed: document.getElementById('speed').value
      ? document.getElementById('speed').value
      : null,
    Duration: document.getElementById('duration').value
      ? document.getElementById('duration').value
      : null,
  };
  axios.post('api.saferoad.net:6010/report-scheduler', REPORT_scheduler).then(res=>{
    console.log(res)
  }).catch(err => {
    console.log(err)
  });
}
