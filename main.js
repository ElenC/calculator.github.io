class Calculator{
    constructor(input, output){
        this.inptDisplay = input;
        this.outptDisplay = output;
        this.inptHistory = [];
    }

/*Funções Principais*/

    clearAllHistory(){
        this.inptHistory =[];
        this.updateInptDisplay();
        this.updateOutptDisplay("0");
        limitNumber = 0;
    }

    backspace(){
        switch(this.getLastInptType()){
            case "number":
                if(this.getLastInptValue().length > 1){
                    this.editLastInpt(this.getLastInptValue().slice(0, -1), "number");
                }else{
                    this.delLastInpt();
                }
                break;
            case "operator":
                this.delLastInpt();
                break
                default:
                    return;    
        }
    }
    changePercentToDecimal(){
        if(this.getLastInptType() === "number"){
            this.editLastInpt(this.getLastInptValue() / 100, "number");
        }
    }

    insertNumber(value){
        if(this.getLastInptType() === "number"){
            this.appendToLastInpt(value);
            limitNumber ++;
        }if(limitNumber > 7){
            alert("Erro! Limite de 8 dígitos foram ultrapassados!");
            this.clearAllHistory();
        }
        else if(this.getLastInptType() === "operator" || this.getLastInptType() === null){
            this.addNewInpt(value, "number");
        }
    }

    insertOperation(value){
        limitNumber = 1;
        switch(this.getLastInptType()){
            case "number":
                this.addNewInpt(value, "operator");
                break;
            case "operator":
                this.editLastInpt(value, "operator");
                break;
            case "equals":
                let output = this.getOutptValue();
                this.clearAllHistory();
                this.addNewInpt(output, "number");
                this.addNewInpt(value, "operator");
                break;
            default:
                return;
        }
    }

    negateNumber(){
        limitNumber --;
        if(this.getLastInptType() === "number"){
            this.editLastInpt(parseFloat(this.getLastInptValue()) * - 1, "number");
        }
    }

    insertDecimalPoint(){
        limitNumber --;
        if(this.getLastInptType() === "number" && !this.getLastInptValue().includes(".")){
            this.appendToLastInput(".");
        }else if(this.getLastInptType() === "operator" || this.getLastInptType() === null){
            this.addNewInpt("0.", "number");
        }
    }

    generateResult(){
        if(this.getLastInptType() === "number"){
            const auto = this;
            const simplifyExpression = function(currentExpression, operator){
                if(currentExpression.indexOf(operator) === - 1){
                    return currentExpression;
                }else{
                    let operatorIdx = currentExpression.indexOf(operator);
                    let leftOperandIndex = operatorIdx - 1;
                    let rightOperandIndex = operatorIdx + 1;

                    let partialSolution = auto.performOperation(...currentExpression.slice(leftOperandIndex, rightOperandIndex + 1));
                    
                    currentExpression.splice(leftOperandIndex, 3, partialSolution.toString());

                    return simplifyExpression(currentExpression, operator);
                }
            }

            let result = ["x", "/", "+", "-"].reduce(simplifyExpression, this.getAllInptValues());

            this.addNewInpt("=", "equals");
            this.updateOutptDisplay(result.toString());
        }
    }



    /*Funções Auxiliares*/

    getLastInptType(){
        return (this.inptHistory.length === 0) ? null : this.inptHistory[this.inptHistory.length -1].type
    }

    getLastInptValue(){
        return (this.inptHistory.length === 0) ? null : this.inptHistory[this.inptHistory.length -1].value
    }

    getAllInptValues(){
        return this.inptHistory.map(entry => entry.value);
    }

    getOutptValue(){
        return this.outptDisplay.value.replace(/,/g,'');
    }

    addNewInpt(value, type){
        this.inptHistory.push({"type": type, "value": value.toString() });
        this.updateInptDisplay()
    }

    appendToLastInpt(value){
        this.inptHistory[this.inptHistory.length - 1].value += value.toString();
        this.updateInptDisplay();
    }

    editLastInpt(value, type){
        this.inptHistory.pop();
        this.addNewInpt(value, type);
    }

    delLastInpt(){
        this.inptHistory.pop();
        this.updateInptDisplay();
    }

    updateInptDisplay(){
        this.inptDisplay.value = this.getAllInptValues().join(" ");
    }

    updateOutptDisplay(value){
        this.outptDisplay.value = Number(value).toLocaleString();
    }

    performOperation (leftOper, operation, rightOper){
        leftOper = parseFloat(leftOper);
        rightOper = parseFloat(rightOper);

        if(Number.isNaN(leftOper) || Number.isNaN(rightOper)){
            return;
        }

        switch(operation){
            case "x":
                return leftOper * rightOper;
            case "/":
                return leftOper / rightOper;
            case  "+":
                return leftOper + rightOper;
            case "-":
                return leftOper - rightOper;
            default:
                return;
        }
    }
}

limitNumber = 0;

const inptDisplay = document.querySelector('#history');
const outptDisplay = document.querySelector('#result');


const allClearButton = document.querySelector("[data-all-clear]");
const backspaceButton = document.querySelector("[data-backspace]");
const percentButton = document.querySelector("[data-percent]");
const operationButtons = document.querySelectorAll("[data-operator]");
const numberButtons = document.querySelectorAll("[data-number]");
const negationButton = document.querySelector("[data-negation]");
const decimalButton = document.querySelector("[data-decimal]");
const equalsButton = document.querySelector("[data-equals]");

const calculator = new Calculator(inptDisplay, outptDisplay);

allClearButton.addEventListener("click", ()=>{
    calculator.clearAllHistory();
});

backspaceButton.addEventListener("click", ()=>{
    calculator.backspace();
});

percentButton.addEventListener("click", () => {
    calculator.changePercentToDecimal();
});

operationButtons.forEach(button => {
    button.addEventListener("click", (event) =>{
        let {target} = event;
        calculator.insertOperation(target.dataset.operator)
    })
});

numberButtons.forEach(button =>{
    button.addEventListener("click", (event) =>{
        let{target} = event;
        calculator.insertNumber(target.dataset.number);
    })
});

negationButton.addEventListener("click", () => {
    calculator.negateNumber();
});

decimalButton.addEventListener("click", () => {
    calculator.insertDecimalPoint();
});

equalsButton.addEventListener("click", () => {
    calculator.generateResult();
});