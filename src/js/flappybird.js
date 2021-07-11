function newElement(tagName, className) {
    const el = document.createElement(tagName)
    el.className = className
    return el
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier')

    const barrierBorder = newElement('div', 'barrier-border')
    const barrierBody = newElement('div', 'barrier-body')

    this.element.appendChild(reverse ? barrierBody : barrierBorder)
    this.element.appendChild(reverse ? barrierBorder : barrierBody)

    this.setHeight = height => barrierBody.style.height = `${height}px`
}

// ONLY TEST
// const b = new Barrier(true)
// b.setHeight(200)
// document.querySelector('[fb-root]').appendChild(b.element)

function BarriersGroup(height, opening, x) {
    this.element = newElement('div', 'barriers-group')

    this.upBarrier = new Barrier(true)
    this.downBarrier = new Barrier(false)

    this.element.appendChild(this.upBarrier.element)
    this.element.appendChild(this.downBarrier.element)

    this.sortSpaceBetween = () => {
        const upHeight = Math.random() * (height - opening)
        const downHeight = height - opening - upHeight
        this.upBarrier.setHeight(upHeight)
        this.downBarrier.setHeight(downHeight)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.sortSpaceBetween()
    this.setX(x)
}

// TEST ONLY
// const b2 = new BarriersGroup(700, 200, 400)
// document.querySelector('[fb-root]').appendChild(b2.element)


function Barriers(height, width, opening, space, pointNotification) {
    this.pairs = [
        new BarriersGroup(height, opening, width),
        new BarriersGroup(height, opening, width + space),
        new BarriersGroup(height, opening, width + space * 2),
        new BarriersGroup(height, opening, width + space * 3)
    ]

    const displacement = 3

    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - displacement)

            // When element go to outside game canvas
            if (pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + space * this.pairs.length)
                pair.sortSpaceBetween()
            }

            const middle = width / 2
            const crossedTheMiddle = pair.getX() + displacement >= middle && pair.getX() < middle
            crossedTheMiddle && pointNotification() 
        })
    }
}

function Bird(canvasHeight) {
    let flying = false

    this.element = newElement('img', 'bird')
    this.element.src = '../src/imgs/passaro.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => flying = true 
    window.onkeyup = e => flying = false

    this.animate = () => {
        const newY = this.getY() + (flying ? 8 : -5)
        const maxHeight = canvasHeight - this.element.clientHeight

        if (newY <= 0) {
            this.setY(0)
        } else if (newY >= maxHeight) {
            this.setY(maxHeight)
        } else {
            this.setY(newY)
        }
     }
    this.setY(canvasHeight / 2)
}


function Progress() {
    this.element = newElement('span', 'score-progress')
    this.scoreUpdate = score => {
        this.element.innerHTML = score
    }
    this.scoreUpdate(0)
}

// TEST ONLY
// const gameArea = document.querySelector('[fb-root]')
// const barriers = new Barriers(700, 1200, 200, 400)
// const bird = new Bird(700)
// const scoreProgress = new Progress()
// gameArea.appendChild(bird.element)
// gameArea.appendChild(scoreProgress.element)
// barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))
// const timer = setInterval(() => {
//     barriers.animate()
//     bird.animate()
// }, 24)


function FlappyBird() {
    let scores = 0

    const gameArea = document.querySelector('[fb-root]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth

    const progress = new Progress()
    const barriers = new Barriers(height, width, 200, 400, () => progress.scoreUpdate(++scores))
    const bird = new Bird(height)

    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))

    this.start = () => {
        const timer = setInterval(() => {
            barriers.animate()
            bird.animate()
        }, 24)
    }
}

new FlappyBird().start()