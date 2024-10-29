const generatePassword = () => {
    const length = parseInt(document.getElementById('length').value, 10); 
    const includeUpper = document.getElementById('includeUpper').checked;
    const includeLower = document.getElementById('includeLower').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    const excludeChars = document.getElementById('exclude').value.split('');

    const lowerChars = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c => !excludeChars.includes(c));
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(c => !excludeChars.includes(c));
    const numberChars = '0123456789'.split('').filter(c => !excludeChars.includes(c));
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:",.<>?'.split('').filter(c => !excludeChars.includes(c));

    let passwordChars = [];
    if (includeLower) passwordChars = passwordChars.concat(lowerChars);
    if (includeUpper) passwordChars = passwordChars.concat(upperChars);
    if (includeNumbers) passwordChars = passwordChars.concat(numberChars);
    if (includeSymbols) passwordChars = passwordChars.concat(symbolChars);

    if (passwordChars.length === 0) {
        alert('Please select at least one character type.');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * passwordChars.length);
        password += passwordChars[randomIndex];
    }

    document.getElementById('password').value = password;
    updateStrengthIndicator(password); 
    saveToHistory(password);
};

const updateStrengthIndicator = (password) => {
    const strengthIndicator = document.getElementById('strength');
    const length = password.length;

    let strength = 'Too Weak'; 

    if (length < 2) {
        strength = 'Too Weak'; 
    } else if (length >= 2 && length <= 4) {
        strength = 'Weak'; 
    } else if (length >= 5 && length <= 16) {
        strength = 'Medium';
    } else if (length >= 17) {
        strength = 'Strong';
    }

    strengthIndicator.textContent = strength; 
};

const saveToHistory = (password) => {
    let history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    history.push(password);
    localStorage.setItem('passwordHistory', JSON.stringify(history));
    displayHistory();
};

const deleteFromHistory = (index) => {
    let history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    history.splice(index, 1); 
    localStorage.setItem('passwordHistory', JSON.stringify(history));
    displayHistory(); 
};

const displayHistory = () => {
    const historyList = document.getElementById('history');
    historyList.innerHTML = '';
    let history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    history.forEach((pass, index) => {
        const li = document.createElement('li');
        li.classList.add('history-item');
        li.textContent = pass;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteFromHistory(index);

        li.appendChild(deleteButton);
        historyList.appendChild(li);
    });
};

const downloadPasswords = () => {
    const history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    const blob = new Blob([history.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

document.getElementById('generate').addEventListener('click', generatePassword);
document.getElementById('download').addEventListener('click', downloadPasswords); 
document.addEventListener('DOMContentLoaded', displayHistory);
