document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    setupTabs();
    setupDialer();
    setupPhoneCallTrap();
    fetchCallLogs();
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
            window.PhoneCallTrap.makeCall(number);
        }
    });
}

function setupPhoneCallTrap() {
    window.PhoneCallTrap.onCall((callInfo) => {
        console.log('Call info:', callInfo);
        // Update UI based on call info
        updateCallList(callInfo);
    });
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
    // Implement logic to update the appropriate call list based on callInfo
}