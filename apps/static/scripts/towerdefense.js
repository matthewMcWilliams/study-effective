const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io()



const urlParams = new URLSearchParams(window.location.search);

const code = urlParams.get("code");
const nickname = urlParams.get('nickname')



const State = Object.freeze({
    LOBBY: 'lobby',
    GAME: "game"
});

let state = State.LOBBY



socket.emit('create_lobby', {
    'mode':'tower-defense',
    'deck-id':deckId,
    'code': code ?? -1,
    'nickname': nickname ?? my_username
})

let gameCode = 'WAITING'
let playerList = []


socket.on('room_update', ({ _mode, players, code, _deckId }) => {
    gameCode = code;
    console.log(players);
    playerList = players;
}); 



let mouseX, mouseY
let mouseDown = false

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouseX = x
    mouseY = y
});

canvas.addEventListener('mousedown', (event) => {
    mouseDown = true;
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
});



function setCursorPointer() {
    canvas.classList.add('cursor-pointer')
}

function setCursorNormal() {
    canvas.classList.remove('cursor-pointer')
}




class Button {
    constructor(x, y, width, height, fill='blue') {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.fill = fill
    }

    render() {
        ctx.fillStyle = this.fill
        ctx.fillRect(this.x, this.y, this.width, this.height)

        ctx.strokeStyle = 'black'
        ctx.lineWidth = 0.15
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }

    get clicked() {
        return (
            mouseDown &&
            mouseX < this.x + this.width && mouseX > this.x &&
            mouseY < this.y + this.height && mouseY > this.y
        )
    }


}


const startGameButton = new Button(canvas.width/3, canvas.height*2/3, canvas.width/3, 40, 'red')


function drawLobby() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center'; // Horizontally center

    ctx.fillStyle = 'black';
    ctx.fillText('Game Code:  ' + gameCode, canvas.width / 2, canvas.height / 4);

    nicknameList = playerList.map(x => Object.values(x)[0]);
    for (let i = 0; i < nicknameList.length; i++) {
        const player = nicknameList[i];
        ctx.fillText(player, canvas.width / 4, canvas.height / 2 + i * 24)
    }

    startGameButton.render()

    ctx.fillStyle = 'white'
    ctx.fillText('Start Game ➡', canvas.width/2, canvas.height*2/3+30)

    if (startGameButton.clicked) {
        state = State.GAME
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log('Playing game!')
}


function draw() {

    switch (state) {
        case State.LOBBY:
            drawLobby()
            break
        
        case State.GAME:
            drawGame()
            break
    
        default:
            break
    }


    requestAnimationFrame(draw)
}

draw()