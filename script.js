const rows = 15
const cols = 30
const totalMines = 99
let lossCondition = false
let winCondition = false

let mines
let buttons
let flags
let timer
let seconds = 0

const fill = () => {
  for (let i = 0; i < totalMines; i++) {
    const y = Math.floor(Math.random() * cols)
    const x = Math.floor(Math.random() * rows)
    if (mines[x][y]) i--
    mines[x][y] = true
  }
}

const createMines = () => {
  const array = []
  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++)
      row.push(false)
    array.push(row)
  }
  return array
}

const createFlags = () => {
  const array = []
  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++)
      row.push(false)
    array.push(row)
  }
  return array
}

const countNearMines = (x, y) => {
  const minX = x - 1 < 0 ? 0 : x - 1
  const minY = y - 1 < 0 ? 0 : y - 1
  const rowsSiblings = mines.slice(minY, y + 2)
  const reduction = mines[y][x] ? -1 : 0
  return rowsSiblings
    .map(r => r.slice(minX, x + 2))
    .flat()
    .filter(c => c)
    .length - reduction
}

const isMinePressed = (x, y) => mines[y][x]

const open = (x, y, btn) => {
  if (lossCondition || winCondition) return
  btn.classList.add('pressed')
  if (isMinePressed(x, y)) {
    clearInterval(timer)
    lossCondition = true
    lossBanner.classList.toggle('show')
  }
}

const getText = (x, y) => (
  mines[y][x] ? '💥' : countNearMines(x, y)
)

const flagsMatches = () => {
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      if (mines[i][j] !== flags[i][j]) return false
  return true
}

const getColor = n => {
  if (n === '1') return 'one'
  if (n === '2') return 'two'
  if (n === '3') return 'three'
  if (n === '4') return 'four'
  if (n === '5') return 'five'
  if (n === '6') return 'six'
  if (n === '7') return 'seven'
  return 'none'
}

const setFlag = (x, y, btn) => {
  flags[y][x] = !flags[y][x]
  btn.classList.toggle('flagged')
  if (flags[y][x])
    btn.innerText = '🚩'
  else
    btn.innerText = getText(x, y)
  const flagsPlaced = totalMines - flags.reduce((a, b) => a + b.filter(x => x).length, 0)
  lblMines.innerText = flagsPlaced.toString().padStart(3, '0')
  if (flagsMatches()) {
    winCondition = true
    victoryBanner.classList.toggle('show')
    clearInterval(timer)
  }
}

const pad = value => value.toString().padStart(2, '0')

const toTimeFormat = seconds => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${pad(m)}:${pad(s)}`
}

const start = () => (
  timer = setInterval(() => {
    seconds++
    lblTime.innerText = toTimeFormat(seconds)
  }, 1000)
)

const isRightClick = e => e.which === 3 || e.button === 2

const createButton = (x, y) => {
  const btn = document.createElement('button')
  btn.classList.add('cell')
  btn.innerText = getText(x, y)
  btn.classList.add(getColor(btn.innerText))
  if (btn.innerText === '0') btn.classList.add('no-visible')
  btn.addEventListener('mousedown', e => {
    if (seconds < 1) start()
    if (isRightClick(e)) return setFlag(x, y, btn)
    if (flags[y][x]) return
    open(x, y, btn)
  })
  return btn
}

const createButtons = () => {
  const array = []
  for (let i = 0; i < rows; i++) {
    const row = document.createElement('div')
    row.classList.add('row')
    array.push([])
    for (let j = 0; j < cols; j++) {
      const btn = createButton(j, i)
      row.appendChild(btn)
      array[i].push(btn)
    }
    panel.appendChild(row)
  }
}

const reset = () => {
  clearInterval(timer)
  seconds = 0
  lblTime.innerText = "00:00"
  panel.innerHTML = ''
  lossBanner.classList.remove('show')
  victoryBanner.classList.remove('show')
  lossCondition = false
  winCondition = false
  lblMines.innerText = totalMines.toString().padStart(3, '0')
  mines = createMines()
  fill()
  flags = createFlags()
  buttons = createButtons()
}

btnReset.addEventListener('click', reset)
btnResetLost.addEventListener('click', reset)
btnResetVictory.addEventListener('click', reset)

reset()

document.addEventListener('contextmenu', e => e.preventDefault())