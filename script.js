const displayLog = document.getElementById('calculate')
const display = document.getElementById('display')
const main = document.getElementById('main')
const container = document.getElementById('container')

const Leafs = document.getElementById('Leafs')
const small_Leafs = document.getElementById('small_leafs')
const fruits = document.getElementById('fruits')

const btnName = [
    'C', '±', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
]
let displaylogArray = ['']

let firstOperand = 0;
let operator = null;

function displayLogPrint(log) {
    if (log === '') displaylogArray = ['']
    if (log === 'return') {
        let index = {
            min: 0,
            max: displaylogArray.length - 1
        }
        displaylogArray.forEach(function (item) {
            if (isNaN(Number(item))) { index.min = item; return }
        })
        displaylogArray.splice(displaylogArray.indexOf(index.min) + 1, index.max)
        log = display.textContent
    }
    displaylogArray.push(log)
    let displaylogstring = ''
    displaylogArray.forEach(function (item) {
        displaylogstring += item
    })
    displayLog.textContent = [displaylogstring]
}

function calculate(first, oper, second) {
    first = Number(first)
    second = Number(second)

    if (oper === '+') return first + second
    if (oper === '-') return first - second
    if (oper === '*') return first * second
    if (oper === '/') return first / second
}

function btnEventNumber(element) {
    if (firstOperand === display.textContent) {
        if (operator === null) displayLogPrint('')
        display.textContent = ''
    }
    const displayShowNumber = display.textContent;
    if (displayShowNumber.split('').find(item => item === '.') === undefined)
        display.textContent = Math.trunc(displayShowNumber + element.textContent)
    else display.textContent = displayShowNumber + element.textContent
    if (display.textContent !== '0') displayLogPrint(element.textContent)
}

function btnEventFunction(element) {
    if (element.textContent === 'C') {
        displayLog.textContent = '';
        displaylogArray = ['']
        display.textContent = '0';
        firstOperand = 0;
        operator = null;
        return
    }
    if (element.textContent === '±') {
        let save = display.textContent
        display.textContent = save ? save * -1 : save;
    }
    else if (firstOperand !== 0) {
        display.textContent = firstOperand * display.textContent / 100
    }
    displayLogPrint('return')
}

function btnEventOperator(element) {
    if (displaylogArray.at(-1).indexOf(' ') !== -1 || display.textContent === '0') return // 그냥 연산자 무지성 클릭 방지
    displayLogPrint(` ${element.textContent} `)
    if (operator === null) {
        firstOperand = display.textContent
        operator = element.textContent
        return
    }
    // console.log(`firstOperand: ${firstOperand}`)
    // console.log(`operator: ${operator}`)

    let secondOperand = display.textContent
    display.textContent = calculate(firstOperand, operator, secondOperand)

    firstOperand = display.textContent
    displaylogArray = [display.textContent]
    if (element.textContent === '=') operator = null
    else {
        operator = element.textContent
        displayLogPrint(` ${element.textContent} `)
    }
}

function btnEventDot(element) {
    if (element.textContent === '.' && display.textContent.split('').find(item => item === '.') === undefined) {
        display.textContent = display.textContent + '.'
        displayLogPrint('.')
    }
}

btnName.forEach(function (item) {
    const button = document.createElement('button')
    button.classList.add('button')
    button.textContent = item
    if (item === '0') button.classList.add('zero')
    if (isNaN(Number(item)) === false) {
        button.classList.add('number')
        button.addEventListener("click", function () {
            btnEventNumber(button)
        })
    }
    else {
        if (btnName.indexOf(item) < 3) { // c ± %
            button.classList.add('function')
            button.addEventListener("click", function () {
                btnEventFunction(button)
            })
        }
        else if (item !== '.') { // / * - + =
            button.classList.add('operator')
            button.addEventListener("click", function () {
                btnEventOperator(button)
            })
        }
        else {
            button.classList.add('dot')
            button.addEventListener("click", function () {
                btnEventDot(button)
            })
        }
    }
    main.appendChild(button)
})

let pos = container.getBoundingClientRect(); // 해당 DOM의 위치와 크기를 가져옴

const Shapes = {
    leaf: {
        APPEND: Leafs,
        width: [-100, 360, 400],
        height: [-70, 600, 500],
        length: 3,
        speed: 8
    },
    small_leaf: {
        APPEND: small_Leafs,
        width: [-90, 300, -90, 460],
        height: [40, 670, 100, 450],
        length: 4,
        speed: 3
    },
    fruit: {
        APPEND: fruits,
        width: [-50, 460, 250],
        height: [90, 400, 670],
        length: 3
    }
}

function setStyle() {
    Object.entries(Shapes).forEach(function ([key, value]) {
        for (let i = 0; i < value.length; i++) {
            const element = document.createElement('div')
            element.classList.add(key)
            value.APPEND.appendChild(element)

            element.style.left = pos.x + value.width[i] + 'px'
            element.style.top = pos.y + value.height[i] + 'px'

            if (key !== 'fruit') moreStyle(element, value.height[i], i, value.speed)
        }
    })
}

function moreStyle(element, height, index, speed) {
    if (height > 300) element.style.transform = 'scale(-1, -1)';
    if (index > 1) {
        element.style.rotate = '-20deg'
        element.style.animation = `animation_two ${speed}s ease-in-out infinite`
    }
}

setStyle()

addEventListener('resize', function () {
    pos = container.getBoundingClientRect();
    Leafs.innerHTML = ''
    small_Leafs.innerHTML = ''
    fruits.innerHTML = ''
    setStyle()
});