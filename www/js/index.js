document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    setupTabs();
    setupDialer();
    setupPhoneCallTrap();
    requestPermissions();
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
}

function setupDialer() {
    const phoneNumberInput = document.getElementById('phone-number');
    const keypadButtons = document.querySelectorAll('.keypad-button');
    const callButton = document.getElementById('call-button');

    keypadButtons.forEach(button => {
        button.addEventListener('click', () => {
            phoneNumberInput.value += button.textContent;
        });
    });

    callButton.addEventListener('click', () => {
        const number = phoneNumberInput.value;
        if (number) {
            cordova.plugins.phonecalltrap.makeCall(number, function() {
                console.log('Call initiated successfully');
            }, function(err) {
                console.error('Error making call:', err);
            });
        }
    });
}

function setupPhoneCallTrap() {
    cordova.plugins.phonecalltrap.onCall(function(callInfo) {
        console.log('Call info:', callInfo);
        updateCallList(callInfo);
    });
}

function requestPermissions() {
    cordova.plugins.permissions.requestPermissions([
        cordova.plugins.permissions.READ_PHONE_STATE,
        cordova.plugins.permissions.READ_CALL_LOG,
        cordova.plugins.permissions.PROCESS_OUTGOING_CALLS,
        cordova.plugins.permissions.CALL_PHONE
    ], function() {
        console.log('Permissions granted');
        fetchCallLogs();
    }, function() {
        console.error('Permissions not granted');
    });
}

function fetchCallLogs() {
    cordova.plugins.phonecalltrap.getCallLog(function(calls) {
        const incoming = calls.filter(call => call.type === 'INCOMING');
        const outgoing = calls.filter(call => call.type === 'OUTGOING');
        const missed = calls.filter(call => call.type === 'MISSED');

        displayCalls('incoming', incoming);
        displayCalls('outgoing', outgoing);
        displayCalls('missed', missed);
    }, function(error) {
        console.error('Error fetching call logs:', error);
    });
}

function displayCalls(tabId, calls) {
    const tabContent = document.getElementById(tabId);
    tabContent.innerHTML = calls.map(call => `
        <div class="call-item">
            <span class="number">${call.number}</span>
            <span class="date">${new Date(call.date).toLocaleString()}</span>
        </div>
    `).join('');
}

function updateCallList(callInfo) {
    fetchCallLogs(); // Refresh all call logs when a new call is detected
}