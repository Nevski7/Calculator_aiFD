// SECTION: CORE MATH ENGINE

// Basic Math Functions
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
    if (b === 0) return "Nice try, universe breaker!"; 
    return a / b;
}

// Operate Function
function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    let result;
    
    switch (operator) {
        case '+': result = add(a, b); break;
        case '-': result = subtract(a, b); break;
        case '*': result = multiply(a, b); break;
        case '/': result = divide(a, b); break;
        default: return null;
    }

    // Keep ten significant digits, including very small and large results.
    if (typeof result === 'number') {
        return Number.isFinite(result)
            ? Number(result.toPrecision(10))
            : "That's too big for me!";
    }
    return result; 
}

// SECTION: STATE & DISPLAY
const display = document.querySelector('#display');
const decimalButton = document.querySelector('#decimalBtn');
let displayValue = '0';
let firstNumber = null;
let selectedOperator = null;
let waitingForNumber = false;
let hasError = false;

function updateDisplay() {
    display.textContent = displayValue;
    display.classList.toggle('error', hasError);
    decimalButton.disabled = !waitingForNumber && !hasError && displayValue.includes('.');
}

function clearCalculator() {
    displayValue = '0';
    firstNumber = null;
    selectedOperator = null;
    waitingForNumber = false;
    hasError = false;
    updateDisplay();
}

function inputNumber(digit) {
    if (hasError) clearCalculator();
    if (waitingForNumber) {
        displayValue = digit;
        waitingForNumber = false;
    } else if (displayValue === '0') {
        displayValue = digit;
    } else if (displayValue.replace(/[^0-9]/g, '').length < 10) {
        displayValue += digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (hasError) clearCalculator();
    if (waitingForNumber) {
        displayValue = '0';
        waitingForNumber = false;
    }
    if (!displayValue.includes('.')) displayValue += '.';
    updateDisplay();
}

function calculate() {
    const result = operate(selectedOperator, firstNumber, displayValue);
    displayValue = String(result);
    hasError = typeof result !== 'number';
    firstNumber = hasError ? null : result;
    if (hasError) selectedOperator = null;
}

function chooseOperator(operator) {
    if (hasError) return;
    if (selectedOperator && !waitingForNumber) calculate();
    else firstNumber = Number(displayValue);
    if (!hasError) selectedOperator = operator;
    waitingForNumber = true;
    updateDisplay();
}

function equals() {
    if (hasError || selectedOperator === null || waitingForNumber) return;
    calculate();
    selectedOperator = null;
    waitingForNumber = true;
    updateDisplay();
}

function backspace() {
    if (hasError) return clearCalculator();
    if (waitingForNumber) return;
    displayValue = displayValue.slice(0, -1);
    if (displayValue === '' || displayValue === '-') displayValue = '0';
    updateDisplay();
}

// SECTION: VALIDATION & EVENTS
document.querySelectorAll('[data-num]').forEach(button => {
    button.addEventListener('click', () => inputNumber(button.dataset.num));
});
document.querySelectorAll('[data-op]').forEach(button => {
    button.addEventListener('click', () => chooseOperator(button.dataset.op));
});
document.querySelector('#clearBtn').addEventListener('click', clearCalculator);
document.querySelector('#backspaceBtn').addEventListener('click', backspace);
decimalButton.addEventListener('click', inputDecimal);
document.querySelector('#equalsBtn').addEventListener('click', equals);

document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey ||
        event.target.matches('input, textarea, select, [contenteditable="true"]')) return;

    const key = event.key;
    if (/^[0-9]$/.test(key)) inputNumber(key);
    else if (['+', '-', '*', '/'].includes(key)) chooseOperator(key);
    else if (key === '.') inputDecimal();
    else if (key === '=' || key === 'Enter') equals();
    else if (key === 'Backspace') backspace();
    else if (key === 'Escape' || key === 'Delete') clearCalculator();
    else return;
    event.preventDefault();
});

updateDisplay();
