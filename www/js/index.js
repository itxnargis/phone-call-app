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
            window.PhoneCallTrap.makeCall(number, () => {
                console.log('Call initiated successfully');
            }, (err) => {
                console.error('Error making call:', err);
            });
        }
    });
}

function setupPhoneCallTrap() {
    window.PhoneCallTrap.onCall((callInfo) => {
        console.log('Call info:', callInfo);
        updateCallList(callInfo);
    });
}

function requestPermissions() {
    const permissions = [
        'android.permission.READ_PHONE_STATE',
        'android.permission.READ_CALL_LOG',
        'android.permission.PROCESS_OUTGOING_CALLS',
        'android.permission.CALL_PHONE'
    ];

    cordova.plugins.permissions.requestPermissions(permissions, permissionSuccess, permissionError);
}

function permissionSuccess() {
    console.log('Permissions granted');
    fetchCallLogs();
}

function permissionError() {
    console.error('Permissions not granted');
}

function fetchCallLogs() {
    window.PhoneCallTrap.getCallLog((calls) => {
        const incoming = calls.filter(call => call.type === 'INCOMING');
        const outgoing = calls.filter(call => call.type === 'OUTGOING');
        const missed = calls.filter(call => call.type === 'MISSED');

        displayCalls('incoming', incoming);
        displayCalls('outgoing', outgoing);
        displayCalls('missed', missed);
    }, (error) => {
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