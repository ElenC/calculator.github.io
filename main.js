class Calculator{
    constructor(input, output){
        this.inptDisplay = input;
        this.outptDisplay = output;
        this.inptHistory = [];
    }

/*Funções Principais*/

    clearAll(){
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
            alert("Ops! O limite de 8 dígitos foram ultrapassados!");
        }
        else if(this.getLastInptType() === "operator" || this.getLastInptType() === null){
            this.addInpt(value, "number");
        }
    }

    insertOperation(value){
        limitNumber = 1;
        switch(this.getLastInptType()){
            case "number":
                this.addInpt(value, "operator");
                break;
            case "operator":
                this.editLastInpt(value, "operator");
                break;
            case "equals":
                let output = this.getOutptValue();
                this.clearAll();
                this.addInpt(output, "number");
                this.addInpt(value, "operator");
                break;
            default:
                return;
        }
    }
    
    negateNumber(){
        if(this.getLastInptType() === "number"){
            this.editLastInpt(parseFloat(this.getLastInptValue()) * - 1, "number");
        }
    }

    insertDecimalPoint(){
        if(this.getLastInptType() === "number" && !this.getLastInptValue().includes(".")){
            this.appendToLastInpt(".");
        }else if(this.getLastInptType() === "operator" || this.getLastInptType() === null){
            this.addInpt("0.", "number");
        }
    }

    generateResult(){
        if(this.getLastInptType() === "number"){
            const auto = this;
            const simplifyExpression = function(currentExpression, operator){
                if(currentExpression.indexOf(operator) === - 1){
                    return currentExpression;
                }else{
                    let operatorIndex = currentExpression.indexOf(operator);
                    let leftIndex = operatorIndex - 1;
                    let rightIndex = operatorIndex + 1;

                    let partialSolution = auto.CalcOperator(...currentExpression.slice(leftIndex, rightIndex + 1));
                    
                    currentExpression.splice(leftIndex, 3, partialSolution.toString());

                    return simplifyExpression(currentExpression, operator);
                }
            }
        

            let result = ["x", "/", "+", "-"].reduce(simplifyExpression, this.getAllInptValues());

            this.addInpt("=", "equals");
            this.updateOutptDisplay(result.toString());
        }
   
    }



    /*Funções Auxiliares*/

    updateInptDisplay(){
        this.inptDisplay.value = this.getAllInptValues().join(" ");
    }

    updateOutptDisplay(value){
        this.outptDisplay.value = Number(value).toLocaleString();
    }

    getLastInptType(){
        return (this.inptHistory.length === 0) ? null : this.inptHistory[this.inptHistory.length -1].type
    }

    getLastInptValue(){
        return (this.inptHistory.length === 0) ? null : this.inptHistory[this.inptHistory.length -1].value
    }

    getOutptValue(){
        return this.outptDisplay.value.replace(/,/g,'');
    }
    
    getAllInptValues(){
        return this.inptHistory.map(enter => enter.value); 
    }

    addInpt(value, type){
        this.inptHistory.push({"type": type, "value": value.toString() });
        this.updateInptDisplay()
    }

    appendToLastInpt(value){
        this.inptHistory[this.inptHistory.length - 1].value += value.toString();
        this.updateInptDisplay();
    }

    editLastInpt(value, type){
        this.inptHistory.pop();
        this.addInpt(value, type);
    }

    delLastInpt(){
        this.inptHistory.pop()
        this.updateInptDisplay();
    }

    CalcOperator (left, operation, right){
        left = parseFloat(left);
        right = parseFloat(right);

        if(Number.isNaN(left) || Number.isNaN(right)){
            return;
        }

        switch(operation){
            case "x":
                return left * right;
            case "/":
                return left / right;
            case  "+":
                return left + right;
            case "-":
                return left - right;
            default:
                return;
        }
    }
}

limitNumber = 0;

const inptDisplay = document.querySelector('#inputHistory');
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
    calculator.clearAll();
});

backspaceButton.addEventListener("click", ()=>{
    calculator.backspace();
});

percentButton.addEventListener("click", () => {
    calculator.changePercentToDecimal();
});

operationButtons.forEach(button => {
    button.addEventListener("click", () =>{
        calculator.insertOperation(button.innerText)
    })
});

numberButtons.forEach(button =>{
    button.addEventListener("click", () =>{
        calculator.insertNumber(button.innerText);
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