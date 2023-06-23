import R from "./ramda.js";

/**
 * @namespace Battleship
 * @author Mr. Dylan Hoang
 * @version 2023
 */
const Battleship = Object.create(null);

// Creating Ships
// Connect4.empty_board = function (
/**
 * @memberof Battleship
 * @function
 * @param {string} name Name of Battleship
 * @param {number} length Length of Battleship i.e. - Destroyer = 2
 * @returns a Battleship with the name and length of the ship.
 */
Battleship.createShip = function (name, length) {
    return { name, length };
};


const width = 10;


/**
 * @memberof Battleship
 * @function
 * @param {Array} allBoardBlocks The array of blocks/
 * grid sqaures within the 10x10 grid
 * @param {Boolean} isHorizontal Whether the pieces
 * of ship are alligned horizontally
 * @param {number} startIndex The index of the 1st
 * piece of ship that is generated
 * @param {Array.<Object>} ship The ship that is
 * passed through from the array of ships
 * @returns
 */
Battleship.getValidity = function(
    allBoardBlocks, isHorizontal, startIndex, ship) {
   // Checks if it is a valid start
    // Following variable prevents the ship from generating off the game-board.
    // If it detects that the randomstartindex will cause the pieces of the,
    // ship to generate off the board (startindex > 100),
    // it changes the start index of the ship
    // so that all pieces generate on board.
    let validStart = isHorizontal
    ? (startIndex <= width * width - ship.length
      ? startIndex
      : width * width - ship.length)
    // If isHorizontal is false, handle vertical. Note that ? means return
    // "if condition is truthy", while : means "otherwise return this"
    : (startIndex <= width * width - width * ship.length
        ? startIndex : startIndex - ship.length * width + width);

    //Collects the blocks
    let shipBlocks = []; //an empty array by default, that will collect the
    // indexes of the blocks/ sqaures in the board that contain pieces of a ship
    // for loop which adds to above array the positions/blocks of the ships.
    // The positions are randomly generated.
    // Number of loops performed determined by ship length,
    // i.e. loops x2 if ship = destroyer
    R.range(0, ship.length).forEach(function(i){
        if (isHorizontal) { //if the ship piece is HORIZONTAL
            shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
            // position of a ship is randomly generated and the blocks
            // it occupies is added to array. Number of divs/blocks added to
            //array is determined by size/length of ship.
            // i.e. - if ship.length = 2, 2 consecutive randomly generated divs
            // are added. If randomStartIndex is 34
            // then div #34 and the adjacent #35 will be added as the 2nd loop,
            // as i = 1 so 34+1 = 35.
        } else { //if the ship piece is VERTICAL
            shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
            //position of ship is randomly generated and the
            // blocks it occupies is added to the array. If randomStartIndex is
            // div #34, then block 34 and the block directly below (div #44)
            // wil be added to the array

        }
    });
    // console.log("the div #'s that contain a ship piece:")
    // console.log(shipBlocks)

    // Checks if it is a valid move
    // Prevents the ship from splitting in half and ensures that all pieces of
    // ship are on one row. As in, it makes sure the RandomStartIndex
    // is a valid index so that the generate ship does not have pieces
    // generating in the next row. In short, checks if plyaer makes a valid move
    // and block not taken
    let valid; // empty variable

    if (isHorizontal) { //if it is true that the ship is horizontal
        shipBlocks.every((_shipBlock, index) =>
        valid = shipBlocks[0].id % width
        !== width - (shipBlocks.length - (index + 1)));
    } else { //if it is false that the ship is horizontal
        shipBlocks.every((_shipBlock, index) =>
        valid = shipBlocks[0].id < 90 + (width * index + 1)
        );
    }
    // checks whether every shipblock in the shipblocks
    // does not the class "taken", meaning the space
    // is not taken.
    const notTaken = shipBlocks.every((shipBlock) =>
        !shipBlock.classList.contains("taken"));

    return{shipBlocks, valid, notTaken};
};

export default Object.freeze(Battleship);
