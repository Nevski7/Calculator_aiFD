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

    // Round long decimals to prevent screen overflowi
    if (typeof result === 'number') {
        return Math.round(result * 100000) / 100000;
    }
    return result; 
}

// SECTION: STATE & DISPLAY

// SECTION: VALIDATION & EVENTS