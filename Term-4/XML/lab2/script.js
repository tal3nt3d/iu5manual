window.onload = function(){ 

    let a = ''
    let b = ''
    let expressionResult = ''
    let selectedOperation = null
    let prevOperation = null
    let calcSystem = 'dec'
    
    outputElement = document.getElementById("result")
    
    digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')
    hexButtons = document.querySelectorAll('[id ^= "btn_digit_A"], [id ^= "btn_digit_B"], [id ^= "btn_digit_C"], [id ^= "btn_digit_D"], [id ^= "btn_digit_E"], [id ^= "btn_digit_F"]');

    function updateHexButtonsState() {
        hexButtons.forEach(button => {
            button.disabled = calcSystem !== 'hex';
        });
    }

    updateHexButtonsState();

    function onDigitButtonClicked(digit) {
        if (!selectedOperation) {
            if (((digit != '.') || (digit == '.' && !a.includes(digit))) && !(a == '0' && digit == '0')) {
                if (a == '0' && digit != ' ') {
                    a = ''
                    a += digit
                    outputElement.innerHTML = a
                    return
                }   
                if (a.length < 12){
                    a += digit
                    outputElement.innerHTML = a
                }
            }
        } 
        else {
            if (((digit != '.') || (digit == '.' && !b.includes(digit))) && !(b == '0' && digit == '0')) {
                if (b == '0' && digit != ' ') {
                    b = ''
                    b += digit
                    outputElement.innerHTML = b
                    return
                }
                if (b.length < 12){
                    b += digit   
                    outputElement.innerHTML = b 
                }
            }    
        }
    }
    
    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML
            onDigitButtonClicked(digitValue)
        }
    });
    
    document.getElementById("btn_op_mult").onclick = function() { 
        if (a === '') return
        selectedOperation = 'x'
        b = ''
    }
    document.getElementById("btn_op_plus").onclick = function() {
        if (a === '') return
        selectedOperation = '+'
        b = ''
    }
    document.getElementById("btn_op_minus").onclick = function() { 
        if (a === '') return
        selectedOperation = '-'
        b = ''
    }
    document.getElementById("btn_op_div").onclick = function() {
        if (a === '') return
        selectedOperation = '/'
        b = ''
    }

    document.getElementById("btn_op_sign").onclick = function() { 
        if (a === '') return
        expressionResult = -(+a)
        a = expressionResult.toString()
        outputElement.innerHTML = a
    }

    document.getElementById("btn_op_percent").onclick = function() { 
        if (a === '') return
        expressionResult = (+a)  / 100
        a = expressionResult.toString()
        outputElement.innerHTML = a
    }

    document.getElementById("btn_op_left_shift").onclick = function() { 
        if (a === '') return
        selectedOperation = '<<'
        b = ''
    }

    document.getElementById("btn_op_right_shift").onclick = function() { 
        if (a === '') return
        selectedOperation = '>>'
        b = ''
    }

    document.getElementById("btn_op_clear").onclick = function() { 
        a = ''
        b = ''
        selectedOperation = ''
        expressionResult = ''
        outputElement.innerHTML = 0
    }

    document.getElementById("btn_op_backspace").onclick = function() { 
        if (a === '') return
        expressionResult = a.slice(0, a.length - 1)
        if (calcSystem == 'hex') a = expressionResult.toString(16)
        else a = expressionResult.toString(10)
        if (a.length == 0) a = '0'
        outputElement.innerHTML = a
    }

    document.getElementById("btn_op_equal").onclick = function() { 
        if (a === '' || b === '' || !selectedOperation)
            return
            
        switch(selectedOperation) { 
            case 'x':
                if (calcSystem == 'hex') expressionResult = parseInt(a, 16) * parseInt(b, 16)
                else expressionResult = (+a) * (+b)
                break;
            case '+':
                if (calcSystem == 'hex') expressionResult = parseInt(a, 16) + parseInt(b, 16)
                else expressionResult = (+a) + (+b)
                break;
            case '-':
                if (calcSystem == 'hex') expressionResult = parseInt(a, 16) - parseInt(b, 16)
                else expressionResult = (+a) - (+b)
                break;
            case '/':
                if (calcSystem == 'hex') expressionResult = parseInt(a, 16) / parseInt(b, 16)
                else expressionResult = (+a) / (+b)
                break;
            case '<<':
                if (calcSystem == 'hex') expressionResult = parseInt(a, 16) * (2**parseInt(b, 16))
                else expressionResult = (+a) * (2**(+b))
                break;
            case '>>':
                if (calcSystem == 'hex') expressionResult = Math.floor(parseInt(a, 16) / (2**parseInt(b, 16)))
                else expressionResult = Math.floor((+a) / (2**(+b)))
                break;
        }
        
        prevOperation = selectedOperation
        expressionResult = Math.round(expressionResult * 1e12) / 1e12
        if (calcSystem == 'hex') a = expressionResult.toString(16).toUpperCase()
        else a = expressionResult.toString(10)
        outputElement.innerHTML = a
    }

    document.getElementById("btn_op_change_system").onclick = function() {
        if (calcSystem == 'dec'){
            calcSystem = 'hex'
            document.getElementById("btn_op_change_system").innerHTML = 'DEC'
            document.getElementById("btn_op_sign").disabled = true
            document.getElementById("btn_op_percent").disabled = true
            document.getElementById("btn_digit_dot").disabled = true
            if (a != '') {
                expressionResult = parseInt(a, 10)
                a = expressionResult.toString(16).toUpperCase()
                outputElement.innerHTML = a 
            }
        }
        else {
            calcSystem = 'dec'
            document.getElementById("btn_op_change_system").innerHTML = 'HEX'
            document.getElementById("btn_op_sign").disabled = false
            document.getElementById("btn_op_percent").disabled = false
            document.getElementById("btn_digit_dot").disabled = false
            if (a != ''){
                expressionResult = parseInt(a, 16)
                a = expressionResult.toString(10)
                outputElement.innerHTML = a
            } 
        }

        updateHexButtonsState();
    }
    };