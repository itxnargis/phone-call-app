document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    setupTabs();
    setupDialer();
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
            // Attempt to initiate a call
            try {
                window.PhoneCallTrap.makeCall(number);
            } catch (error) {
                console.error('Error making call:', error);
            }
        }
    });
}

function fetchCallLogs() {
    try {
        window.PhoneCallTrap.getCallLog((calls) => {
            displayCalls('incoming', calls.filter(call => call.type === 'INCOMING'));
            displayCalls('outgoing', calls.filter(call => call.type === 'OUTGOING'));
            displayCalls('missed', calls.filter(call => call.type === 'MISSED'));
        }, (error) => {
            console.error('Error fetching call logs:', error);
        });
    } catch (error) {
        console.error('Error setting up call log fetching:', error);
    }
}

function displayCalls(tabId, calls) {
    const tabContent = document.getElementById(tabId);
    tabContent.innerHTML = calls.map(call => `
        <div class="call-item">
            <span>${call.number}</span>
            <span>${new Date(call.date).toLocaleString()}</span>
        </div>
    `).join('');
}
