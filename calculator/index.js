/**
 * 按钮分类
 * 数字键：0-9
 * 计算键： +，-，*，/，%，1/x，√
 * 终值计算： =
 * 更改数字类型： .， ±
 */

"use strict";

(function () {
    var funcList = ['←', 'CE', '/', 'x', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'];
    var funcDiv = document.querySelector('.func');

    var detail = '';    //detail
    var number = '';    //记录用户输入的这次计算的按钮
    var output = null; //点击操作符时上一个操作符计算的结果
    // var currentResult = 0;
    var operatorList = [];

    init();

    function init() {
        renderResult();
        renderCalc();
    }

    function renderCalc() { //渲染计算器按钮
        var oUl = document.createElement('ul');
        if (funcList && funcList.length > 0) {
            for (var i in funcList) {
                var funcValue = funcList[i];
                var oLi = document.createElement('li');
                var oBtn = document.createElement('button');
                oBtn.setAttribute('class', 'btn');
                oBtn.textContent = funcValue;
                oLi.appendChild(oBtn);
                oUl.appendChild(oLi);
            }
        }
        funcDiv.appendChild(oUl);
    }

    function renderResult(value) {
        value = value || 0;
        var result = document.querySelector('.result');
        result.textContent = value;
    }

    function renderDetail(value) {
        value = value || '';
        var result = document.querySelector('.detail');
        result.textContent = value;
    }

    funcDiv.addEventListener('click', function (event) {
        var target = event.target;
        var currentInput = target.innerHTML;
        // number = number || 0;

        if (currentInput === '←') {  //撤回,等于0或已经点击了运算符时不撤回
            var reg = new RegExp(/^(\*|\+|\/|\-)/);
            if ( !reg.test(currentInput) ) {
                detail = cancel(detail);
                number = cancel(number);
            }
            renderResult(number);
        } else if (currentInput === 'CE') {   //清空
            clean();
            renderDetail(detail);
            renderResult(number);
        } else if (Number(currentInput)) {   //输入数字
            if ( number == 0  ) {
                number = '';
            }
            number += currentInput;
            detail += currentInput;
            renderResult(number);            
        } else if (currentInput === '.') {   //输入小数，如果已有.则不再有.
            if ( number === null || number === '' || number.indexOf('.') === -1 ) {
                number = number || 0;
                number += currentInput;
                detail += currentInput;
            }
            renderResult(number);
        } else if (currentInput === '=') {//判断detail上一位是不是+ - * /，如果是得话去掉最后一位
            var reg = new RegExp(/^(\*|\+|\/|\-)/);
            if ( reg.test(currentInput) ) {
                detail = detail.substring(0, detail.length - 1);
            }
            operatorList.push({
                operator: currentInput,
                index: detail.length
            });
            output = cal(detail, operatorList);
            renderResult(output);
            renderDetail(detail);
            clean();
        } else {    //operator
            var showResult = 0;
            operatorList.push({
                operator: currentInput,
                index: detail.length
            });
            if ( operatorList.length <= 1 ) {
                showResult = number;
            } else {
                output = cal(detail, operatorList);
                showResult = output;
            }
            detail += currentInput;
            renderDetail(detail);
            renderResult(showResult);
            number = 0;
        }
    });

    function cancel(value, startIndex, endIndex) {
        var result = null;
        if ( value.length <= 0 || value == 0 ) {
            return '';
        }
        if ( value.length > 0 ) {
            startIndex = startIndex || 0;
            endIndex = endIndex || value.length - 1;
            result = value.substring(startIndex, endIndex);
        }
        return result;
    }

    function clean() {
        detail = '';
        number = 0;
        output = null;
        operatorList = [];
    }

    function cal(detail, operatorList) {
        if ( !operatorList || operatorList.length <= 0 ) {    //operatorList为空或者长度为双数不计算
            return number;
        }
        var result = null;
        if ( output === null ) {
            var key = operatorList.length - 2;
            var operator = operatorList[key].operator;
            var index = operatorList[key].index;
            var x = detail.substring(0, index);
            var y = detail.substring(index + 1, detail.length);
            result = calByOperator(x, y, operator);
        } else {
            var lastKey = operatorList.length - 2;
            var key = operatorList.length - 1;
            var index = operatorList[key].index;
            var lastIndex = operatorList[lastKey].index;
            var operator = operatorList[lastKey].operator;
            var y = detail.substring(lastIndex + 1, index);
            result = calByOperator(output, y, operator);
        }            
        return result;
    }

    function calByOperator(x, y, operator) {
        var result = null;
        switch (operator) {
            case '+':
                result = plus(x, y);
                break;
            case '-':
                result = minus(x, y);
                break;
            case '*':
                result = multiply(x, y);
                break;
            case '/':
                result = division(x, y);
                break;
            default:
                break;
        }
        return result;
    }

    //cal
    //-
    function minus(x, y) {
        return Number(x) - Number(y);
    }

    //+
    function plus(x, y) {
        return Number(x) + Number(y);
    }

    //*

    function multiply(x, y) {
        return Number(x) * Number(y);
    }
    ///
    function division(x, y) {
        return (Number(x) * 100) / (Number(y) * 100);
    }

    function module(x, y) {
        return (Number(x) * 100) % (Number(y) * 100);
    }

    function getOpposite(x) {
        return Math.abs(Number(x));
    }

    function sqrt(x) {
        return Math.sqrt(Number(x));
    }

    function reciprocal(x) {
        return division(1, x);
    }
})();