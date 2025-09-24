// User data and authentication
const users = JSON.parse(localStorage.getItem('bitcoinUsers')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
const WELCOME_BONUS = 200.00;

// Bitcoin wallet links
const bitcoinWallets = [
    "https://blockchain.com/wallet",
    "https://www.blockchain.com/explorer",
    "https://www.coinbase.com/wallet",
    "https://metamask.io/",
    "https://trustwallet.com/",
    "https://www.exodus.com/",
    "https://atomicwallet.io/",
    "https://electrum.org/",
    "https://bluewallet.io/",
    "https://brd.com/"
];

// DOM Elements
const authContainer = document.getElementById('authContainer');
const dashboard = document.getElementById('dashboard');
const loadingScreen = document.getElementById('loadingScreen');
const welcomeBonus = document.getElementById('welcomeBonus');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAvatar = document.getElementById('userAvatar');
const balanceDisplay = document.getElementById('balance');
const logoutBtn = document.getElementById('logoutBtn');
const authTabs = document.getElementById('authTabs');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const depositBtn = document.getElementById('depositBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const buyBtcBtn = document.getElementById('buyBtcBtn');
const bonusBtn = document.getElementById('bonusBtn');
const randomWalletLink = document.getElementById('randomWalletLink');

// Modals
const withdrawModal = document.getElementById('withdrawModal');
const depositModal = document.getElementById('depositModal');
const buyBtcModal = document.getElementById('buyBtcModal');
const paystackModal = document.getElementById('paystackModal');

// Close buttons
const withdrawClose = document.getElementById('withdrawClose');
const depositClose = document.getElementById('depositClose');
const buyBtcClose = document.getElementById('buyBtcClose');
const paystackClose = document.getElementById('paystackClose');

// Form elements
const btcAmountInput = document.getElementById('btcAmount');
const nairaAmountInput = document.getElementById('nairaAmount');
const paystackAmount = document.getElementById('paystackAmount');

// Action buttons
const goToDeposit = document.getElementById('goToDeposit');
const cancelWithdraw = document.getElementById('cancelWithdraw');
const confirmDeposit = document.getElementById('confirmDeposit');
const cancelDeposit = document.getElementById('cancelDeposit');
const payWithPaystack = document.getElementById('payWithPaystack');
const cancelBuy = document.getElementById('cancelBuy');
const confirmPaystack = document.getElementById('confirmPaystack');
const cancelPaystack = document.getElementById('cancelPaystack');

// Copy buttons
const copyButtons = document.querySelectorAll('.copy-btn');

// Set random Bitcoin wallet link
function setRandomWalletLink() {
    const randomIndex = Math.floor(Math.random() * bitcoinWallets.length);
    randomWalletLink.href = bitcoinWallets[randomIndex];
}

// Password validation
function validatePassword(password) {
    // At least 8 characters with both letters and numbers
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return regex.test(password);
}

// Check if user is already logged in
if (currentUser) {
    showDashboard();
} else {
    authContainer.style.display = 'flex';
}

// Set random wallet link on page load
setRandomWalletLink();

// Auth tabs functionality
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        loginForm.classList.remove('active');
        signupForm.classList.remove('active');
        
        document.getElementById(`${tab.dataset.tab}Form`).classList.add('active');
    });
});

// Login functionality
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showLoading(false); // false means no bonus for login
    } else {
        alert('Invalid email or password');
    }
});

// Signup functionality
signupBtn.addEventListener('click', () => {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!validatePassword(password)) {
        alert('Password must be at least 8 characters long and contain both letters and numbers');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    const newUser = { 
        name, 
        email, 
        password, 
        balance: WELCOME_BONUS,
        hasReceivedBonus: true // Track if user has received the welcome bonus
    };
    users.push(newUser);
    localStorage.setItem('bitcoinUsers', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showLoading(true); // true means show bonus for new user
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    hideDashboard();
});

// Deposit button
depositBtn.addEventListener('click', () => {
    depositModal.style.display = 'flex';
});

// Withdraw button
withdrawBtn.addEventListener('click', () => {
    withdrawModal.style.display = 'flex';
});

// Buy Bitcoin button
buyBtcBtn.addEventListener('click', () => {
    buyBtcModal.style.display = 'flex';
});

// Close modals
withdrawClose.addEventListener('click', () => {
    withdrawModal.style.display = 'none';
});

depositClose.addEventListener('click', () => {
    depositModal.style.display = 'none';
});

buyBtcClose.addEventListener('click', () => {
    buyBtcModal.style.display = 'none';
});

paystackClose.addEventListener('click', () => {
    paystackModal.style.display = 'none';
});

// Go to deposit from withdraw modal
goToDeposit.addEventListener('click', () => {
    withdrawModal.style.display = 'none';
    depositModal.style.display = 'flex';
});

// Cancel withdraw
cancelWithdraw.addEventListener('click', () => {
    withdrawModal.style.display = 'none';
});

// Confirm deposit
confirmDeposit.addEventListener('click', () => {
    alert('Thank you! We will verify your transfer and credit your account within 24 hours.');
    depositModal.style.display = 'none';
});

// Cancel deposit
cancelDeposit.addEventListener('click', () => {
    depositModal.style.display = 'none';
});

// Pay with Paystack
payWithPaystack.addEventListener('click', () => {
    const amount = btcAmountInput.value;
    if (!amount || amount < 10) {
        alert('Minimum purchase amount is $10');
        return;
    }
    
    paystackAmount.textContent = `$${parseFloat(amount).toFixed(2)}`;
    buyBtcModal.style.display = 'none';
    paystackModal.style.display = 'flex';
});

// Cancel buy
cancelBuy.addEventListener('click', () => {
    buyBtcModal.style.display = 'none';
});

// Confirm Paystack payment
confirmPaystack.addEventListener('click', () => {
    alert('Thank you! We will verify your transfer and deliver your Bitcoin within 24 hours.');
    paystackModal.style.display = 'none';
    btcAmountInput.value = '';
    nairaAmountInput.value = '';
});

// Cancel Paystack
cancelPaystack.addEventListener('click', () => {
    paystackModal.style.display = 'none';
});

// Bonus button
bonusBtn.addEventListener('click', () => {
    welcomeBonus.style.display = 'none';
    dashboard.style.display = 'block';
});

// BTC to Naira conversion
btcAmountInput.addEventListener('input', () => {
    const amount = parseFloat(btcAmountInput.value) || 0;
    const nairaAmount = amount * 1500;
    nairaAmountInput.value = `₦${nairaAmount.toLocaleString()}`;
});

// Copy button functionality
copyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const text = button.dataset.text;
        navigator.clipboard.writeText(text).then(() => {
            const originalHtml = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                button.innerHTML = originalHtml;
            }, 2000);
        });
    });
});

// Show loading screen
function showLoading(showBonus) {
    authContainer.style.display = 'none';
    loadingScreen.style.display = 'flex';
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        if (showBonus && currentUser && !currentUser.hasReceivedBonus) {
            // Update user to mark bonus as received
            currentUser.hasReceivedBonus = true;
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('bitcoinUsers', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            welcomeBonus.style.display = 'flex';
        } else {
            dashboard.style.display = 'block';
        }
    }, 3000);
}

// Show dashboard
function showDashboard() {
    userName.textContent = currentUser.name;
    userEmail.textContent = currentUser.email;
    userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    balanceDisplay.textContent = currentUser.balance.toFixed(2);
    
    // Hide auth tabs when logged in
    authTabs.style.display = 'none';
    
    dashboard.style.display = 'block';
    authContainer.style.display = 'none';
}

// Hide dashboard
function hideDashboard() {
    dashboard.style.display = 'none';
    authContainer.style.display = 'flex';
    
    // Show auth tabs when logged out
    authTabs.style.display = 'flex';
    
    // Clear form fields
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
}

// Initialize
if (currentUser) {
    showDashboard();
}
