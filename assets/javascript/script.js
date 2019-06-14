
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAJwgHwShAhZfBRl50JfFzKfC8ohXQ1li8",
    authDomain: "rps-multiplayer-4804c.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-4804c.firebaseio.com",
    projectId: "rps-multiplayer-4804c",
    storageBucket: "rps-multiplayer-4804c.appspot.com",
    messagingSenderId: "438083069166",
    appId: "1:438083069166:web:9ce301a0b6cc81d6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


var dataRef = firebase.database();


////////////////////////////////
///// Global variables
//////////////////////////////
let playerLoadData;
let p1Loaded = false;
let p2Loaded = false;
let timeoutKey;
let playerMove = "";
let gameID;
let resultFound = false;
let result ="";


let player = {
    name: "",
    playerNum: "0",
    currentSelection: "",
    wins: 0,
    ties: 0
};


////////////////////////////
//this is the program flow
/////////////////////

// On form load check if player 1 or 2 is already loaded
getDataSnapshot();

//these are the function definitions


//this is the listner for the Players section
//it checks if both players are loaded and starts a new game
function getDataSnapshot(){
    dataRef.ref("Players").on("value",function (snapshot){
        //debugger;
        console.log(snapshot.val());
        playerLoadData = snapshot.val();
        checkIfPlayersLoaded();
        if(p1Loaded && p2Loaded && player.playerNum != 0){
            startNewGame();
        }
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
};

//this is the listener for the Game section
dataRef.ref("Game").on("child_added", function(snapshot){

    //if a new record is added and this player does not have a gameID assigned
    //and if the player is part of the game (playerNum != 0) then assign same gameid to this player
    //debugger;
    if(player.playerNum != "0" && gameID == ""){
        gameID = snapshot.key;
    }

});


function checkIfPlayersLoaded() {
    if(playerLoadData.p1 != ""){
        p1Loaded = true;
    }
    if (playerLoadData.p2 != ""){
        p2Loaded = true;
    }
}


$("#enter-name").on("submit", function(event){
    debugger;
    if(player.playerNum != "0"){
        //display message : you are already on the game/////////////////////////////////////
        return;
    }
    event.preventDefault();
    console.log($("#inputPlayerName").val());
    if(!p1Loaded){
        player.name = $("#inputPlayerName").val();
        player.playerNum = "1";
        updatePlayerSection("p1", $("#inputPlayerName").val());
        p1Loaded = true;
        enableButtons("1");
    }else if (p1Loaded && !p2Loaded){
        player.name = $("#inputPlayerName").val();
        player.playerNum = "2";
        updatePlayerSection("p2", $("#inputPlayerName").val());
        p2Loaded = true;
        enableButtons("2");
    }
    //??????????????????????????????????????????????????????????????????????
    //else if both players are loaded display message to wait for next game???????????????
});

function updatePlayerSection(playerNum, playerName){
    debugger;
    if(playerNum === "p1"){  
        dataRef.ref("Players").update({p1: playerName}),function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        };
    }else{
        dataRef.ref("Players").update({p2: playerName}),function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        };
    }
}


function startNewGame(){
    console.log("Starting New Game");
    gameID = ""; //clear any previous gameId's as a new ID will be assigned here
    result = "";
    debugger;


    // //enable the game buttons panel based on player number
    // if(player.playerNum === "1"){
    //     enableButtons("1");
    // }else{
    //     enableButtons("2");
    // }



    //create a new game and push to DB??????????????????????????????????
    if(player.playerNum === "2"){
        gameID = dataRef.ref("Game").push({
            p1Name: playerLoadData.p1,
            p2Name: playerLoadData.p2
        }).key;
    }
    //start the timer////////////////////////////
    // if player does not make a play selection in 15 seconds, remove player from game
    timeoutKey = setTimeout(clearPlayer, 15000);
}

function enableButtons(numStr){
    //debugger;
    $("#rock" + numStr).attr("disabled", false);
    $("#paper" + numStr).attr("disabled", false);
    $("#scissors" + numStr).attr("disabled", false);
    $("#random" + numStr).attr("disabled", false);
}

//this function clears/removes the player from the game//////////////////////////////////
//either due to timeout or clicking the quit button/////////////////////////////
function clearPlayer(){

}

$(".play-btn").on("click", function(event){
    clearTimeout(timeoutKey);
    //debugger;
    playerMove = this.textContent;
    console.log(playerMove);

    //log the player selection to the DB
    if(player.playerNum === "1"){
        dataRef.ref("Game/" + gameID).update({
            p1Move: playerMove
        });
    }else{
        dataRef.ref("Game/" + gameID).update({
            p2Move: playerMove
        });
    }
    //check to see if result can be calculated (both players have made moves)
    processResult();
});

function processResult(){

    dataRef.ref("Game").child(gameID).on("value", function(snapshot){
        debugger;
        //check if both players' moves have been logged
        if(snapshot.hasChild("p1Move") && snapshot.hasChild("p2Move")){
            console.log(snapshot.val().p1Move);
            console.log(snapshot.val().p2Move);
            result = calculateWinner(snapshot.val().p1Move, snapshot.val().p2Move);
            resultFound = true;
        }
    })
    //if a result has been found, log it to the DB
    if(resultFound){
        dataRef.ref("Game/" + gameID).update({
            result: result
        });
    }

    //if the winner is this player add to their win count
    if(player.playerNum === result){
        player.wins++;
    }else if(result === "0"){
        player.ties++;
    }
}

function calculateWinner(move1, move2){
    if(move1 === "Rock" && move2 === "Paper"){
        return "2";
    }else if(move1 === "Rock" && move2 === "Scissors"){
        return "1";
    }else if(move1 === "Paper" && move2 === "Rock"){
        return "1";
    }else if(move1 === "Paper" && move2 === "Scissors"){
        return "2";
    }else if(move1 === "Scissors" && move2 === "Rock"){
        return "2";
    }else if(move1 === "Scissors" && move2 === "Paper"){
        return "1";
    }else{
        return"0";
    }
}

