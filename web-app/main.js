import R from "./ramda.js";
import Battleship from "./battleship.js";

const optionContainer = document.querySelector(".option-container");
// stores the class element 'option container' as a variable
const flipButton = document.querySelector("#flip-button");
// stores the ID 'flip-button' as a variable.

// Option choosing

let angle = 0; // set default angle to be 0
function flip () { // rotates the ship 90 degrees
const optionShips = (Array.from(optionContainer.children));
// extracts all the children of the class element
// and stores as an variable array
    angle = (angle === 0 ? 90 : 0);
    //if (?) angle = 0, return 90. Else ':' return 0
    optionShips.forEach((optionShip) => {
        optionShip.style.transform = `rotate(${angle}deg)`;
      });
}
// clicking mouse calls the flip function
flipButton.addEventListener("click", flip);

//Creates a standardised board
const gamesBoardContainer = document.querySelector("#gamesboard-container");
//looks for and stores the ID as a variable
const width = 10;

//function that creates a board with an argument color and user
function createBoard(user) {
    const gameBoardContainer = document.createElement("div");
    // stores a new div under gameBoardContainer
    gameBoardContainer.classList.add("game-board");
    // adds a class called game-board
    gameBoardContainer.id = user;
    // gives each board created an ID based upon the argument given

    // Loops 100 times, as width = 10; 10*10 = 100.
    // Appends 100 blocks to the board.
    R.range(0, width*width).forEach(function(i) {
        const block = document.createElement("div");
        //creates a div element and stores as a block
         block.classList.add("block"); // adds a class name called block
         block.id = i; // block id based on the index i
         gameBoardContainer.append(block);
         //appends block to the game board container.
    });
    gamesBoardContainer.append(gameBoardContainer);
    // appends the board to the div containing the id attribute
    // "gamesboard-container" found in html file
}
createBoard("player");
// assigns 1st board with color yellow and user player
createBoard("computer");
// assigns 2nd board with color pink and user computer




// Creating Ships
let notDropped;

const destroyer = Battleship.createShip("destroyer", 2);
const submarine = Battleship.createShip("submarine", 3);
const cruiser = Battleship.createShip("cruiser", 3);
const battleship = Battleship.createShip("battleship", 4);
const carrier = Battleship.createShip("carrier", 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];

// When function addShipPiece is called,
// each ship is added to computer's the board in random positions
function addShipPiece (user, ship, startId){
    const allBoardBlocks = document.querySelectorAll(`#${user} div`);
    // stores all the blocks within the computer's board as a NodeList variable
    //Checks to see if the ship is horizontal or not
    let randomBoolean = Math.random() < 0.5; //gives a true or false
    let isHorizontal = user === "player" ? angle === 0 : randomBoolean;
    // if boolean passed is True, ship is horizontal. Vice versa
    let randomStartIndex = Math.floor(Math.random() * width * width);
    //gives a random number rom 0-99 each time.
    let startIndex = startId ? startId : randomStartIndex;
    //checks if start index is true,
    //otherwise uses the randomStartIndex
    const myString = "Boolean Type = ";
    const myString2 = "Random start index = ";
    console.log(myString + randomBoolean);
    console.log(myString2 + randomStartIndex);

    const {shipBlocks, valid, notTaken} =
    Battleship.getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

    if (valid && notTaken) {
        shipBlocks.forEach(function (shipBlock) {
            shipBlock.classList.add(ship.name);
            shipBlock.classList.add("taken");
        });
    } //loops back to top of function if it doesn't satisfy the if statement
    else {
        if (user === "computer") {
            addShipPiece(user, ship, startId);
          }
          if (user === "player") {
            notDropped = true;
          }
    }
    //If valid is true, introduces the valid block of ship on the board

}
// for each ship that lives inside that array,
// pass that ship into the function addShipPiece
ships.forEach(function(ship) {
    addShipPiece("computer", ship);
}); // (input of function => output of function) "=>" is called arrow function.


// Drag Player Ships

let draggedShip;
const optionShips = Array.from(optionContainer.children);
optionShips.forEach((optionShip) =>
    optionShip.addEventListener("dragstart", dragStart));

const allPlayerBlocks = document.querySelectorAll("#player div");
allPlayerBlocks.forEach((playerBlock) => {
    playerBlock.addEventListener("dragover", dragOver);
    playerBlock.addEventListener("drop", dropShip);
});

function dragStart(e){//returns the element of where the event occured
    notDropped = false;
    draggedShip = (e.target);
}

function dragOver(e){
    e.preventDefault();
    const ship = ships[draggedShip.id];
    highlightArea(e.target.id, ship);
}

function dropShip(e){
    const startId = e.target.id;
    const ship = ships[draggedShip.id];
    addShipPiece("player", ship, startId);
    if (!notDropped) { //if the ship is dropped, it removed
        draggedShip.remove();
    }
}

// Add highlight
function highlightArea( startIndex, ship){
    const allBoardBlocks = document.querySelectorAll("#player div");
    let isHorizontal = angle === 0;

    const {shipBlocks, valid, notTaken }
    = Battleship.getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

    if (valid && notTaken){
        shipBlocks.forEach((shipBlock) => {
            shipBlock.classList.add("hover");
            setTimeout(() => shipBlock.classList.remove("hover"), 20);
        } );
    }
}


// ------ GAME LOGIC ------
// I tried moving the functions below into the battleship.js file but
// the functions included elements of HTML that shouldn't be in the API.
// Hence, I kept them in the main.js

const startButton = document.querySelector("#start-button");
const infoDisplay = document.querySelector("#info");
const turnDisplay = document.querySelector("#turn-display");


// Start Game
let gameOver = false;
let playerTurn; //left undefined
//assign it to the module battleships by rewriting this
//above line as battleship.startGame = function ()

let playerHits = [];
let computerHits = [];
const playerSunkShips = [];
const computerSunkShips = [];

function handleClick(e) {
    if (!gameOver) {
        if (e.target.classList.contains("taken")) {
            e.target.classList.add("boom");
            infoDisplay.textContent = "You hit the computer's ship!";
            let classes = Array.from(e.target.classList); // Creates an array of
            // all the classes associated with the square clicked.
            // filters out all of the classes not needed
            // to be displayed in the array, leaving just ship names
            classes = classes.filter((className) => className !== "block");
            classes = classes.filter((className) => className !== "boom");
            classes = classes.filter((className) => className !== "taken");
            playerHits.push(...classes);
            checkScore("player", playerHits, playerSunkShips);
        }
        if (!e.target.classList.contains("taken")){
           infoDisplay.textContent = "Nothing hit this time.";
           e.target.classList.add("empty");
        }
        playerTurn = false;
        const allBoardBlocks = document.querySelectorAll("#computer div");
        allBoardBlocks.forEach(
            (block) => block.replaceWith(block.cloneNode(true)));
        setTimeout(computerGo, 3000);
    }
}

function startGame() {
    if (playerTurn === undefined){
        if (optionContainer.children.length !== 0) {
            infoDisplay.textContent = "Please place all your pieces first";
        } else { //if there's no children left in the option container
            const allBoardBlocks = document.querySelectorAll("#computer div");
            //VVVV THIS NEEDS TO BE IN main.js VVVVVV
            allBoardBlocks.forEach(
                (block) => block.addEventListener("click", handleClick));
            playerTurn = true;
            turnDisplay.textContent = "Your Go!";
            infoDisplay.textContent = "The game has started!";
        }
    }
}

startButton.addEventListener("click", startGame);

// Define the computers go
function computerGo() {
    if (!gameOver) {
        turnDisplay.textContent = "Computer's Go!";
        infoDisplay.textContent = "The computer is thinking...";

        setTimeout(() => {
            let randomGo = Math.floor(Math.random() * width * width);
            const allBoardBlocks = document.querySelectorAll("#player div");

            if(allBoardBlocks[randomGo].classList.contains("taken") &&
                allBoardBlocks[randomGo].classList.contains("boom")
            ){
                computerGo();
                return{};
            } else if (
                allBoardBlocks[randomGo].classList.contains("taken") &&
                !allBoardBlocks[randomGo].classList.contains("boom")

            ){
                allBoardBlocks[randomGo].classList.add("boom");
                infoDisplay.textContent = "The computer hit your ship!";
                let classes = Array.from(allBoardBlocks[randomGo].classList);
                classes = classes.filter((className) => className !== "block");
                classes = classes.filter((className) => className !== "boom");
                classes = classes.filter((className) => className !== "taken");
                computerHits.push(...classes);
                checkScore("computer", computerHits, computerSunkShips);
            } else{
                infoDisplay.textContent = "Nothing hit this time.";
                allBoardBlocks[randomGo].classList.add("empty");
            }
        }, 3000); //makes this happen after 3 secs

        setTimeout(() => {
            playerTurn = true;
            turnDisplay.textContent = "Your Go!";
            infoDisplay.textContent = "Please take your go";
            const allBoardBlocks = document.querySelectorAll("#computer div");
            //REMOVE ADD EVENT LISTENER!
            allBoardBlocks.forEach(
                (block) => block.addEventListener("click", handleClick));
        }, 6000); //wait 6 secs
    }
}

function checkScore(user, userHits, userSunkShips) {

    //checks if we've hit all pieces of a certain ship type
    function checkShip(shipName, shipLength) {
        if (
            userHits.filter(
                (storedShipName) => storedShipName === shipName).length
                === shipLength
        ) {
            // removes sunken ship name from playerHits array
            if (user === "player"){
                infoDisplay.textContent =`You sunk the computer's ${shipName}!`;
                playerHits = userHits.filter(
                    (storedShipName) => storedShipName !== shipName);
            } // removes sunken ship name from computerHits array
            if (user === "computer"){
                infoDisplay.textContent = `The computer sunk your ${shipName}!`;
                playerHits = userHits.filter(
                    (storedShipName) => storedShipName !== shipName);
            }
            userSunkShips.push(shipName);
        }
    }
    checkShip("destroyer", 2);
    checkShip("submarine", 3);
    checkShip("cruiser", 3);
    checkShip("battleship", 4);
    checkShip("carrier", 5);

    console.log("playerHits", playerHits);
    console.log("playerSunkShips", playerSunkShips);

    // End game statements
    if(playerSunkShips.length === 5){
        infoDisplay.textContent =
        "You sunk all the ships. You've WON!";
        gameOver = true;
    }
    if(computerSunkShips.length === 5){
        infoDisplay.textContent =
        "The computer has sunk all your ships. You've LOST!";
        gameOver = true;
    }
}
