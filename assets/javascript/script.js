
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


let player1 = {
    name: "",
    currentSelection: "",
    wins: 0,
    ties: 0
};

let player2 = {
    name: "",
    currentSelection: "",
    wins: 0,
    ties: 0
}

// On form load check if player 1 is already loaded
getDataSnapshot();

function getDataSnapshot(){
    dataRef.ref("Players").on("value",function (snapshot){
        //debugger;
        console.log(snapshot.val());
        playerLoadData = snapshot.val();
        checkIfPlayerLoaded();
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
        player1.name = $("#inputPlayerName").val();
        updatePlayerSection("p1", $("#inputPlayerName").val());
        p1Loaded = true;
    }else if (p1Loaded && !p2Loaded){
        player2.name = $("#inputPlayerName").val();
        updatePlayerSection("p2", $("#inputPlayerName").val());
        p2Loaded = true;
    }
});

function updatePlayerSection(playerNum, playerName){
    debugger;
    dataRef.ref("Players/" + playerNum).set(playerName),function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      };
};