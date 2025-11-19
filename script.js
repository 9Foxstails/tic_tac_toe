/*
1.Set up your project with HTML, CSS and JavaScript files and get the Git repo all set up.
2. Have as little as possible global variables and stuff
3. All logic for winning 3 in a row.
4. Make game work thorught console first.
5. Then dom interaction
6. 

*/

//function that makes a gameboard
function gameBoard()
{
  let rows=3;
  let columns=3;
  let board=[];

   for (let i = 0; i < rows; i++) 
  {
    board[i] = [];
    for (let j = 0; j < columns; j++) 
    {
      board[i].push(``);
    }
  }
 
  return board;
}

//make player function
function makePlayer(name){
  let score=0;
  const upScore=()=>score++;
  const getScore=()=>score;
  const getName=()=>name;
  const changeName=(newName)=>{
    newName=prompt(`Enter a new name :]`);
    if(newName.length!=0)
    {
      name=newName;
    }
  };
  return {getName, upScore, getScore, changeName};
}

const playerOne=makePlayer(`Broski`);
const playerTwo=makePlayer(`Bruv`);
playerOne.mark="X";
playerTwo.mark='O';

//coin toss who goes first
function coinToss()
{
  return Math.floor(Math.random()*2); //produces 0 or 1;
}


//game logic
function gameFlow()
{
  let board=gameBoard();
  let currentPlayer=playerOne;
  let gameOver=undefined;
  let winner=undefined;

  function switchPlayer()
  {
    if (currentPlayer==playerTwo)
    {
      currentPlayer=playerOne;
    }
    else
    {
      currentPlayer=playerTwo;
    }
  }
  
  const getCurrentPlayer=()=>currentPlayer.getName();
  const changeCurrentPlayerName=(newName)=>currentPlayer.changeName(newName);
  const getBoard=()=>board;

  function playerChoice(row, column)
  {
    //check if inputs are ok
    if(column<0 || column>2 || typeof column!=`number` || row<0 || row>2 || typeof row!=`number`)
    {
      return console.error(`invalid input mate, enter a digit lower than or equal to 3`);
    }

    //check if game over
    if (gameOver || gameOver==undefined)
    {
      return console.log(`games over`);
    }

    let check=boardState();

    if(check==false)
    {
      return 0;
    }
    else
    {
      if(board[row][column]==0)
      {
        board[row][column]=currentPlayer.mark;
        console.log(board);
        boardState();
        switchPlayer();
        console.log(`${currentPlayer.getName()} turn`);
      }
      else
      {
        console.log(board);
        board[row][column]=board[row][column];
        console.log(`cant do that mate!`);
      }
    } 
  }
  
  //checks the rows and columns if anyone won or if its a tie cause all fields completed
  function boardState()
  {
    let i=0;
    let j=0;

    // check winning combinations
    if((board[i][j]==board[i+1][j] && board[i+1][j]==board[i+2][j]) && board[i][j]!=`` ||  //row 1
       (board[i][j+1]==board[i+1][j+1] && board[i+1][j+1]==board[i+2][j+1]) && board[i][j+1]!=`` ||//row 2
       (board[i][j+2]==board[i+1][j+2] && board[i+1][j+2]==board[i+2][j+2]) && board[i][j+2]!=`` || //row 3
       (board[i][j]==board[i][j+1] && board[i][j+1]==board[i][j+2]) && board[i][j]!=`` || //column 1
       (board[i+1][j]==board[i+1][j+1] && board[i+1][j+1]==board[i+1][j+2]) && board[i+1][j]!=`` || //column 2
       (board[i+2][j]==board[i+2][j+1] && board[i+2][j+1]==board[i+2][j+2]) && board[i+2][j]!=`` || //column 3
       (board[i][j]==board[i+1][j+1] && board[i+1][j+1]==board[i+2][j+2]) && board[i][j]!=`` || //diagonal 1
       (board[i+2][j]==board[i+1][j+1] && board[i+1][j+1]==board[i][j+2]) && board[i+2][j]!=`` //diagonal 2
      )  
    {
      //need to check what was the winning combination
      currentPlayer.upScore();
      winner=true;
      console.log(`${winner} won! Score: ${currentPlayer.getScore()}`);
      gameOver=true;
      return false;
    }

    let tmpArr=board.flat();
    if (!tmpArr.includes(``))
    {
      //console.log(!board.includes(0));
      console.log(`its a tie! Start a new game`);
      winner=false;
      gameOver=true;
      return false;
    }
    else
    {
      return true;
    }
  }
  
  function newGame()
  {
    board=gameBoard();
    gameOver=false;
    winner=false;
    if(coinToss()==true)
    {
      currentPlayer=playerOne;
    }
    else
    {
      currentPlayer=playerTwo;
    }

    console.log(`${currentPlayer.getName()} starts!`);
  }

  const getGameState=()=>{return {gameOver, winner}};

  return {getBoard,getCurrentPlayer, playerChoice, newGame, changeCurrentPlayerName, getGameState};
};
let game=gameFlow();

function displayControl()
{
  const game=gameFlow();
  let boardContainer=document.querySelector(`.board`);
  let plrOneContainer=document.querySelector(`.player`);
  let plrTwoContainer=document.querySelector(`.player_2`);
  let newGameBtn=document.querySelector(`.newGame`);
  plrOneContainer.firstElementChild.innerHTML=game.getCurrentPlayer();
  plrTwoContainer.firstElementChild.innerHTML=playerTwo.getName();


  //updates display
  function updateScreen()
  {
    let board=game.getBoard();
 
    //remove old children
    while(boardContainer.firstChild)
    {
      boardContainer.removeChild(boardContainer.firstChild);
    }

    //add new children
    for(i=0;i<board.length;i++)
    {
      for(j=0;j<board[i].length;j++)
      {
      let newDiv=document.createElement(`div`);
      newDiv.innerHTML=board[i][j];
      newDiv.dataset.row=i;
      newDiv.dataset.column=j;
      boardContainer.appendChild(newDiv);
      } 
    }
  }

  //handles click on playing board
  function clickHandlerBoard(e)
  {
    let row=Number(e.target.dataset.row);
    let column=Number(e.target.dataset.column);
    game.playerChoice(row, column);
    updateScreen();
    let state=game.getGameState();
    if(state.gameOver)
    {
      if(state.winner)
      {
        alert(`${game.getCurrentPlayer()} is the winner!`);
        boardContainer.removeEventListener(`click`, clickHandlerBoard);
      }
      else
      {
        alert(`its a tie`)
      }
    }
  }

  //handles click to start new game
  function clickHandlerNewGame()
  {
    game.newGame();
    boardContainer.addEventListener(`click`, clickHandlerBoard);
    updateScreen();
  }

  //handles click to change name
  function clickHandlerChangeName(e)
  {
    if(e.target.dataset.id==`1`)
    {
      playerOne.changeName();
      plrOneContainer.firstElementChild.innerHTML=playerOne.getName();
    }
    else if(e.target.dataset.id==`2`)
    {
      playerTwo.changeName();
      plrTwoContainer.firstElementChild.innerHTML=playerTwo.getName();
    }
  }

  boardContainer.addEventListener(`click`, clickHandlerBoard);
  newGameBtn.addEventListener(`click`, clickHandlerNewGame);
  plrOneContainer.firstElementChild.addEventListener(`click`, clickHandlerChangeName);
  plrTwoContainer.firstElementChild.addEventListener(`click`, clickHandlerChangeName);


  updateScreen();
}
//populate for fun
displayControl();
//display function should be able to call it whenever users interacts with the
/*
display score
display game state
display names
*/


