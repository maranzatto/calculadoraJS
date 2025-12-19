const screen = document.getElementById("screen");
const historyDisplay = document.getElementById("history");
let displayValue = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
function toNumber(value) {
    return parseFloat(value.replace(",", "."));
}

function toDisplay(value) {
    return String(value).replace(".", ",");
}
function getSymbol(op) {
    const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
    return symbols[op] || op;
}
function updateDisplay() {
    screen.value = displayValue;

    if (firstOperand === null) {
        historyDisplay.textContent = "";
        return;
    }

    let historyText = String(firstOperand);

    if (operator) {
        historyText += ` ${getSymbol(operator)}`;
        if (!waitingForSecondOperand && displayValue !== "0") {
            historyText += ` ${displayValue}`;
        }
    }

    historyDisplay.textContent = historyText;
}
function inputDigit(digit) {
    if (waitingForSecondOperand) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === "0" ? digit : displayValue + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecondOperand) {
        displayValue = "0,";
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }

    if (!displayValue.includes(",")) {
        displayValue += ",";
        updateDisplay();
    }
}
function clearAll() {
    displayValue = "0";
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function backspace() {
    if (waitingForSecondOperand) return;

    if (displayValue.length <= 1 || displayValue === "0,") {
        displayValue = "0";
    } else {
        displayValue = displayValue.slice(0, -1);
    }
    updateDisplay();
}
function calculate(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return a / b;
    return b;
}

function handleOperator(nextOperator) {
    const inputValue = toNumber(displayValue);

    if (firstOperand === null) {
        firstOperand = inputValue || 0;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

        if (!isFinite(result)) {
            alert("Erro: Operação inválida (ex: divisão por zero)!");
            clearAll();
            return;
        }

        displayValue = toDisplay(result);
        firstOperand = result;
        updateDisplay();
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    updateDisplay();
}

function performCalculation() {
    if (!operator || waitingForSecondOperand) return;

    const secondOperand = toNumber(displayValue);

    const result = calculate(firstOperand, secondOperand, operator);

    if (!isFinite(result)) {
        alert("Erro: Operação inválida!");
        clearAll();
        return;
    }

    historyDisplay.textContent = `${firstOperand} ${getSymbol(
        operator,
    )} ${displayValue} =`;

    displayValue = toDisplay(result);
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = true;
    updateDisplay();
}
document.querySelector(".calculator-keys").addEventListener("click", e => {
    const button = e.target.closest("button");
    if (!button) return;

    const { value, action } = button.dataset;

    if (value >= "0" && value <= "9") {
        inputDigit(value);
        return;
    }

    if (value === "," || value === ".") {
        inputDecimal();
        return;
    }

    if (["+", "-", "*", "/"].includes(value)) {
        handleOperator(value);
        return;
    }

    if (action === "clear") clearAll();
    if (action === "delete") backspace();
    if (action === "calculate") performCalculation();
});
updateDisplay();
