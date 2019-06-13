
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


let player = {
    name: "",
    playerNum: "0",
    currentSelection: "",
    wins: 0,
    ties: 0
};


// On form load check if player 1 or 2 is already loaded
getDataSnapshot();

function getDataSnapshot(){
    dataRef.ref("Players").on("value",function (snapshot){
        //debugger;
        console.log(snapshot.val());
        playerLoadData = snapshot.val();
        checkIfPlayerLoaded();
        if(p1Loaded && p2Loaded){
            startNewGame();
        }
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
};

function checkIfPlayerLoaded() {
    if(playerLoadData.p1 != ""){
        p1Loaded = true;
    }
    if (playerLoadData.p2 != ""){
        p2Loaded = true;
    }
}


$("#enter-name").on("submit", function(event){
    event.preventDefault();
    console.log($("#inputPlayerName").val());
    if(!p1Loaded){
        player.name = $("#inputPlayerName").val();
        playerNum = "1";
        updatePlayerSection("p1", $("#inputPlayerName").val());
        p1Loaded = true;
    }else if (p1Loaded && !p2Loaded){
        player.name = $("#inputPlayerName").val();
        playerNum = "2";
        updatePlayerSection("p2", $("#inputPlayerName").val());
        p2Loaded = true;
    }
    //??????????????????????????????????????????????????????????????????????
    //else if both players are loaded display message to wait for next game???????????????
});

function updatePlayerSection(playerNum, playerName){
    debugger;
    dataRef.ref("Players/" + playerNum).set(playerName),function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      };
};

function startNewGame(){
    console.log("Starting New Game");
    //enable the game buttons panel based on player number
    if(playerNum === "1"){
        enableButtons("1");
    }else{
        enableButtons("2");
    }

    //start the timer////////////////////////////
    // if player does not click in 15 seconds, do a random pick for player
}

function enableButtons(num){
    
    $("#rock" + num).attr("enabled", true);
    $("#paper" + num).attr("enabled", true);
    $("#scissors" + num).attr("enabled", true);
    $("#random" + num).attr("enabled", true);
}