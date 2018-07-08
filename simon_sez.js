


function genRandom(){
  console.log("generating random number");
  var rand_num = Math.floor((Math.random() * 4) + 1);
  return "q" + rand_num;
}

function playSound(id){ //dynamic sound function, uses file location as argument.  accepts relative location
//if toggle is on, execute, otherwise do nothing

  if($('#switchinput').is(':checked')){
    console.log("ahhhhhhhhhhhhhhhhhhhhhhhh");
    var url = $('#' + id).attr("data-id");

    var audio = document.createElement('audio');
    audio.style.display = "none";
    audio.src = url;
    audio.autoplay = true;
    audio.onended = function(){
      audio.remove(); //Remove when played.
    }
    document.body.appendChild(audio);
  }
}

function startGame(){
  $("#startgame").css("background-color", "yellow");
  setTimeout(function(){
    $("#startgame").css("background-color", "white");
  },100);
  $("#startgame").text("Reset Game");

  console.log("starting game");
  resetGame();
  sessionStorage.setItem("gameOn","on");
  freshRound();
}

function resetGame(){
  console.log("resetting game variables");
  // simply clear sessionStorage
  sessionStorage.clear();
}

function lightUp(key){
      playSound(key);
  console.log("should add class");
  $('#' + key).addClass("active");
  setTimeout(function(){
    console.log("should remove class");
    $('#' + key).removeClass("active");
  },500);
}

function displaySimon(){
  console.log("displaying simon");
  var temp_array = JSON.parse(sessionStorage.getItem("pcArray"));
  var i = 0;
  var interval = setInterval(function() {
      lightUp(temp_array[i]);

      i++;
      if (i >= temp_array.length) {
          clearInterval(interval);
      }
  }, 700);
}

function freshRound(){
  console.log("setting up fresh round");
  //increment round
  sessionStorage.setItem("round",Number(sessionStorage.getItem("round")) + 1);
  $("#round").text(sessionStorage.getItem("round"));
  //generate a random number, prepend q, store in session
  var rand_id = genRandom();
  var temp_array = JSON.parse(sessionStorage.getItem("pcArray"));
  if (temp_array == null){
    temp_array = [];
  }
  temp_array.push(rand_id);
  sessionStorage.setItem("pcArray", JSON.stringify(temp_array));
  sessionStorage.setItem("userArray", JSON.stringify(temp_array));
  // display simon sez
  displaySimon();
}


function userClick(elid){
  lightUp(elid);
  console.log("click occurred");
  var current_array = JSON.parse(sessionStorage.getItem("userArray"));
  console.log(current_array);
  if (current_array[0] == elid || current_array == elid){
    console.log("click was good");
    if (current_array.length == 1 || current_array == elid){
      console.log("array is empty, new round");
      // going to set up next round
      setTimeout(function () {
          freshRound();
      }, 1000);
    }else{
      console.log("array is not yet empty, round not over");
      sessionStorage.setItem("userArray", JSON.stringify(current_array.slice(1)));
    }

  }else{
    console.log("round failed");
    var num_rounds_completed = sessionStorage.getItem("round") - 1;
    var rnd_word = ""
    if(num_rounds_completed == "1"){
      rnd_word = "round!";
    }else{
      rnd_word = "rounds!"
    }
    var alert_box = `
    <div id="alert-box">
      <div id="alert-box_escape" onClick="$('#alert-box').remove()">X</div>
      <div id="alert-box_content">
        <p style="font-weight: bold; font-size: 36px;">Congratulations!</p>
        <p>you lasted ` +
        num_rounds_completed + " " + rnd_word +
      ` </p>
      </div>
    </div>`;
    $('body').append(alert_box);
  }
}
