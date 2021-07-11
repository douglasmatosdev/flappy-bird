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

function BarriersGroup(height, spaceBetwwen, x) {
    this.element = newElement('div', 'barriers-group')

    this.upBarrier = new Barrier(true)
    this.downBarrier = new Barrier(false)

    this.element.appendChild(this.upBarrier.element)
    this.element.appendChild(this.downBarrier.element)

    this.sortSpaceBetween = () => {
        const upHeight = Math.random() * (height - spaceBetwwen)
        const downHeight = height - spaceBetwwen - upHeight
        this.upBarrier.setHeight(upHeight)
        this.downBarrier.setHeight(downHeight)
    }

    this.getX = () => parseInt(this.element.style.left.split('px'))[0]
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.sortSpaceBetween()
    this.setX(x)
}

// TEST ONLY
// const b2 = new BarriersGroup(700, 200, 400)
// document.querySelector('[fb-root]').appendChild(b2.element)
