﻿(function () {

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    })();

    // Residing place for our Canvas' context
    var ctx = null;

    // Array of bricks
    var brix1 = [];

    // Array of words that will be compared against to determine what has changed
    var masterWords = [];

    // Array of bad words to compare against
    var badWords = [];

    // Array temporarily acting as dictionary in place of DB
    var dictList1 = [

                    { name: "BAABC", definition: "Test bad word with API" },

                    { name: "CACA", definition: "The poop" }];

    // Letters of Alphabet usable
    var letters = ["A", "A", "B", "C", "D", "E", "E", "F", "G", "H", "I", "I", "J", "K", "L", "M", "N", "O", "O", "P", "Q", "R", "S", "T", "U", "U", "V", "W", "X", "Y", "Z"];

    var letterValues = [{letter: "A", value: 1}, {letter: "B", value: 3},{letter: "C", value: 3},{letter: "D", value: 2},{letter: "E", value: 1}, {letter: "F", value: 4}, {letter: "G", value: 2}, {letter: "H", value: 4},
        {letter: "I", value: 1}, {letter: "J", value: 8}, {letter: "K", value: 5}, {letter: "L", value: 1}, {letter: "M", value: 3}, {letter: "N", value: 1}, {letter: "O", value: 1}, {letter: "P", value: 3},
        {letter: "Q", value: 10}, {letter: "R", value: 1}, {letter: "S", value: 1},{letter: "T", value: 1}, {letter: "U", value: 1}, {letter: "V", value: 4}, {letter: "W", value: 4}, {letter: "X", value: 8},
        {letter: "Y", value: 4}, {letter: "Z", value: 10}];

    var colors = ["red", "orange", "green", "purple", "blue"];
    var upcomingLetters = [];

    // Used to allow game to replay
    var again = true;

    // Area where HTML definitions are displayed
    var defText;
    var scoreText;

    // prevent AJAX calls from repeating word-processing code
    var cbStop = true;

    var totalScore = 0;
    var highScorePlayers = [];
    var playerList = [];


    var Game = {

        // Setup configuration
        canvas: document.getElementById('canvas'),

        setup: function () {

            if (this.canvas.getContext) {

                // Setup variables
                ctx = this.canvas.getContext('2d');

                // Cache width and height of the Canvas to save processing power
                this.width = this.canvas.width - 90;
                this.height = this.canvas.height;

                // Run the game and show Welcome screen
                Screen.welcome();

                // Mousebutton click to activate game
                this.canvas.addEventListener('click', this.runGame, false);
                Ctrl.init();

            }

            // Div where Word definition and score will go
            defText = document.getElementById('def');
            scoreText = document.getElementById('tScore');

        },


        init: function () {

            // Create a falling brick
            FallingBrick.init();

        },


        runGame: function () {

            // After mousebutton clicked, remove the EventListener
            Game.canvas.removeEventListener('click', Game.runGame, false);
            Game.init();

            // Run animation
            Game.animate();

        },


        restartGame: function () {

            again = true;

        },


        animate: function () {

            Game.play = requestAnimFrame(Game.animate);
            if (again) {
                Game.draw();
            }
        },


        draw: function () {

            // Clear out old Game
            ctx.clearRect(0, 0, this.width, this.height);
            // Draw the new Falling Brick
            FallingBrick.draw();
            // Draw the bricks that already fell
            Bricks.draw();

        }
    };


    var Screen = {

        // Contents of Welcome Screen
        welcome: function () {

            // Setup base values
            this.text = 'Wordris';
            this.textSub = 'Click To Start';
            this.textColor = 'white';
            // Create screen
            this.create();

        },


        // Contents of Game Over screen
        gameover: function () {

            this.text = 'Game Over';
            this.textSub = 'Click To Retry';
            this.textColor = 'red';
            this.create();
            
            var player = prompt("Your score is " + totalScore + ". Please enter your name", "Player Name");

            // Write player/score to DB
            $.ajax({
                method: "POST",
                url: "api/Score",
                data: { PlayerName: player, PlayerScore: totalScore }
            }).done(function (result)
            {
                // Get all player/score rows
                $.ajax({
                    url: "api/Score",
                    method: "GET"
                }).done(function (players)
                {
                    ctx.fillStyle = "lawngreen";
                    
                    // Write top 3 players and their scores
                    for (var x = 0; x < 3; x++)
                    {
                        // Assign first player to tempScore
                        var tempScore = players[0].PlayerScore;
                        var tempLocation = 0;
                        // If more than 1 player
                        if (players.length > 1)
                        {
                            for (y = 1; y < players.length; y++)
                            {
                                // If larger score found, assign to tempScore and record location to tempLocation
                                if (tempScore < players[y].PlayerScore)
                                {
                                    tempScore = players[y].PlayerScore;
                                    tempLocation = y;
                                }
                            }
                        }
                        // write high score to canvas
                        ctx.fillText("High Score #" + (x + 1) + " = " + players[tempLocation].PlayerName + ": " + players[tempLocation].PlayerScore, Game.width / 2, Game.height / 2 + (60 * (x + 1)));
                        // remove player from list of Players so it's no longer compared
                        players.splice(tempLocation, 1);
                    }

                });
            });
        },


        // Create the Welcome or Game Over screen
        create: function () {

            // Background
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, Game.width, Game.height);

            // Main text
            ctx.fillStyle = this.textColor;
            ctx.textAlign = 'center';
            ctx.font = '40px helvetica, arial';
            ctx.fillText(this.text, Game.width / 2, Game.height / 2);

            // Sub text
            ctx.fillStyle = '#999999';
            ctx.font = '20px helvetica, arial';
            ctx.fillText(this.textSub, Game.width / 2, Game.height / 2 + 30);

        }
    };

    // The brick that is falling
    var FallingBrick = {

        // Dimensions of a brick
        w: 50,
        h: 20,
        // Line that bricks can't go over
        limit: 100,

        // Where Falling Brick starts falling along with setting its letter and color
        init: function () {

            this.x = 100;
            this.y = 100;
            this.speed = 5;

            var fallBrick = this.organize();
            this.letter = fallBrick.l;
            this.color = fallBrick.c;

        },

        // This function creates the list of 9 upcoming bricks
        organize: function () {
            // Check if 9 items in list otherwise insert howevermuch is left => 9 - falling brick = 8
            //debugger;
            ul = upcomingLetters.length;
            for (var a = 0; a < 9 - ul; a++) {
                var letter1 = letters[Math.floor(Math.random() * letters.length)];
                var color1 = colors[Math.floor(Math.random() * colors.length)];
                upcomingLetters.push({ l: letter1, c: color1 });
            }
            // Shift first in List and return it
            return upcomingLetters.shift();
        },


        // Draws and re-draws the falling brick as its location moves
        draw: function () {
            // Move the Brick, if possible
            this.move();
            // if game not over
            if (again) {
                // Paint Canvas Background black
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, Game.width, Game.height);

                // Upcoming Bricks section drawn
                ctx.fillStyle = "gray";
                ctx.fillRect(Game.width, 0, 90, Game.height);
                ctx.fillStyle = "white";
                ctx.fillText("Upcoming Bricks", Game.width + 45, 20, 80);
                for (var b = 0; b < upcomingLetters.length; b++) {
                    ctx.fillStyle = upcomingLetters[b].c;
                    ctx.fillRect(Game.width + 20, (b + 1) * 50 + 20, 50, 20);
                    ctx.fillStyle = "white";
                    ctx.fillText(upcomingLetters[b].l, Game.width + 45, (b + 1) * 50 + 37, 20);
                }
                // Paint the falling Brick
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.w, this.h);

                // Paint letter on the brick
                ctx.fillStyle = "white";
                ctx.fillText(this.letter, this.x + 25, this.y + 15 + 2, 20);
            }
        },


        // Controls side-to-side movement while monitoring sides of wall (canvas)
        move: function () {

            // Detect controller input and x coord is between the walls of canvas
            if (Ctrl.left && (this.x < Game.width - (this.w))) {
                this.x += this.speed;
            } else if (Ctrl.right && this.x > 0) {
                this.x += -this.speed;
            }

            // If falling brick is not at bottom AND there is no collision with a fallen brick
            if ((this.y < (Game.height - this.h)) && !(Bricks.collide(this.x, this.y))) {
                // Falling Brick moves down by 1
                this.y += 1;
            }
            else {
                // If brick reached bottom or hit a fallen brick, then save brick to Brix1 array
                Bricks.save(this.x, this.y, this.letter, this.color);

                // Go through newly-fallen brick processing
                Bricks.process();

                // If newly-fallen brick is over the limit (game-ending line)
                if (this.y <= FallingBrick.limit) {

                    // Empty fallen-bricks array
                    brix1 = [];
                    // Add Mouse-click Event Listener
                    Game.canvas.addEventListener('click', Game.restartGame, false);

                    // Put up Gameover screen
                    Screen.gameover();
                    totalScore = 0;
                    defText.textContent = "";
                    scoreText.textContent = "";
                    // again is false so game doesn't restart automatically
                    again = false;
                    return;

                }
                else {
                    // If not at or over gameover line, then start again with new falling brick
                    Game.init();
                }
            }
        }
    };

    // The bricks at the bottom that are finished falling
    var Bricks = {

        // Probably need to remove this eventually
        init: function () {

        },


        // Saving newly-fallen brick to Brix1 array (save coords, letter, and color)
        save: function (x1, y1, l1, c1) {

            brix1.push({ x: x1, y: y1, l: l1, c: c1 });

        },


        draw: function () {

            // Iterate through Brick array and draw them
            for (var i = 0; i < brix1.length; i++) {

                ctx.fillStyle = brix1[i].c;
                ctx.fillRect(brix1[i].x, brix1[i].y, 50, 20);
                ctx.fillStyle = "white";
                ctx.fillText(brix1[i].l, brix1[i].x + 25, brix1[i].y + 15, 20);

            }
        },


        collide: function (x2, y2) {

            // Take coords of falling brick and compare them to location and dimensions of bricks
            for (var j = 0; j < brix1.length; j++) {

                if ((((x2 + 50) > brix1[j].x) && ((x2 + 50) <= (brix1[j].x + 50)) || (x2 >= brix1[j].x) && (x2 < (brix1[j].x + 50))) && (((y2 + 20) >= brix1[j].y) && ((y2 + 20) <= (brix1[j].y + 20)))) {

                    return true;
                }
            }
            return false;
        },


        // This needs to be separate from collide because brick already in Brix1 and has to
        // skip itself. Used when determining if remaining bricks need to fall when bricks
        // below disappear
        collide2: function (x2, y2, n2) {

            for (var j = 0; j < brix1.length; j++) {
                // Prevent Brick from comparing itself 
                if (j !== n2) {
                    if ((((x2 + 50) > brix1[j].x) && ((x2 + 50) <= (brix1[j].x + 50)) || (x2 >= brix1[j].x) && (x2 < (brix1[j].x + 50))) && (((y2 + 20) >= brix1[j].y) && ((y2 + 20) <= (brix1[j].y + 20)))) {

                        return true;
                    }
                }
            }
            return false;
        },


        // Process gets list of words, checks if there are good words, then moves down any bricks not removed because word formed
        process: function () {

            var words = this.getListOfWords();
            this.checkIfWords(words);
            scoreText.textContent = ("Score: " + totalScore);
            this.moveBricksDown();

        },


        getListOfWords: function () {

            var temp1 = [];
            var temp2 = [];

            // From 530 (top) to 210 (limit of bricks)

            for (var y = (Game.height - 20); y > FallingBrick.limit; y--) {

                temp2 = [];

                // 410 is width of canvas minus 50 (width of brick) = 360
                for (var x = 0; x < (Game.width - 50); x++) {

                    // Go through every brick in list
                    for (var n = 0; n < brix1.length; n++) {

                        // If x/y corner of brick matches anything in list of bricks
                        if ((x === brix1[n].x) && (y === brix1[n].y)) {

                            // Add the letter and brick # to list
                            temp2.push({ letters: brix1[n].l, number: n });
                        }
                    }
                }

                var temp3 = [];
                var temp4 = [];
                for (var z = 0; z < temp2.length; z++) {
                    // Have to use these arrays because can't join on temp2[z].letters
                    temp3.push(temp2[z].letters);
                    temp4.push(temp2[z].number);
                }
                // Return list of words and the block numbers that make up each word (used for deletions)
                temp1.push({ word: (temp3.join("")), numb: temp4 });
            }
            return temp1;

        },


        checkIfWords: function (cList) {

            var score = 0;
            // In beginning, there is no masterWords yet use first list of words
            if (masterWords.length === 0) {
                masterWords = cList;
            }
            else {
                var x = 0;
                // Parse list of words
                cList.forEach(function (element, index, array)
                {
                    var w = [];
                    var v = element;
                    var newWord = "";
                    // if element's word doesn't match masterWords' word, then change occurred
                    if (element.word !== masterWords[index].word)
                    {
                        // word has to be at least 3 letters long
                        for (var x = 0; x < (element.word.length - 2) ; x++)
                        {
                            // parse backwards until second letter of word
                            for (var y = (element.word.length - 1); y > x; y--)
                            {
                                // word to compare is substring of original word
                                var werd = element.word.substring(x, y + 1);
                                // brickNumbs is array of the letter numbers making up sub-word
                                var brickNumz = element.numb.slice(x, y + 1);
                                // coords is the start and stop coords of sub-word relative to original word
                                var coords = [x, y];
                                // w is array ofpossible word combinations for word search in DB and Dictionary API
                                w.push({ word: werd, brickNums: brickNumz, coords: coords });
                            }
                        }
                        // cbStop used to prevent callbacks from executing when they shouldn't
                        cbStop = true;
                        w.forEach(function (element1, index1, array1) {
                            if (cbStop) {
                                // first check Word DB table
                                $.ajax({
                                    url: "api/Word?werd=" + element1.word,
                                    method: "GET"
                                }).done(function (result) {
                                    // result == true means its a bad word to be ignored
                                    if (result !== "true") {
                                        // result == -1 means it's not a word in DB
                                        if (result !== "-1") {
                                            // if result not bad or -1, then it found the word and has definition
                                            // check again to prevent callbacks
                                            if (cbStop) {
                                                // if got this far, then prevent repetition (through callbacks)
                                                cbStop = false;
                                                // Display definition
                                                defText.textContent = " From Database - " + element1.word + ": " + result;
                                                var goodWord = element.word.substring(element1.coords[0], element1.coords[1] + 1);
                                                newWord = (element.word).replace(goodWord, "");
                                                score += Bricks.computeScore(element1.brickNums);
                                                totalScore += score;
                                                scoreText.textContent = ("Score: " + totalScore);
                                                element1.brickNums.sort(function (a, b) { return b - a });
                                                for (var u = 0; u < element1.brickNums.length; u++) {
                                                    brix1.splice(element1.brickNums[u], 1);
                                                    for (var uu = 0; uu < element.numb.length; uu++) {
                                                        if (element.numb[uu] === element1.brickNums[u]) {
                                                            element.numb.splice(uu, 1);
                                                            break;
                                                        }
                                                    }
                                                }
                                                v = ({ word: newWord, numb: element.numb });
                                            }
                                        }
                                        else
                                        {
                                            var inDict = false;
                                            var def = "-1";
                                            $.ajax({
                                                url: "http://api.pearson.com/v2/dictionaries/entries?headword=" + element1.word,
                                                method: "GET"
                                            }).done(function (response) {
                                                if (response.results.length > 0) {
                                                    if (response.results[(response.results.length - 1)].senses[0].definition) {
                                                        if (cbStop) {
                                                            cbStop = false;
                                                            def = response.results[(response.results.length - 1)].senses[0].definition;
                                                            inDict = true;
                                                            defText.textContent = element1.word + ": " + def;

                                                            // Remove the word from the canvas and from list of words
                                                            var goodWord = element.word.substring(element1.coords[0], element1.coords[1] + 1);
                                                            newWord = (element.word).replace(goodWord, "");
                                                            score += Bricks.computeScore(element1.brickNums);
                                                            totalScore += score;
                                                            scoreText.textContent = ("Score: " + totalScore);
                                                            element1.brickNums.sort(function (a, b) { return b - a });
                                                            for (var u = 0; u < element1.brickNums.length; u++) {
                                                                brix1.splice(element1.brickNums[u], 1);
                                                                for (var uu = 0; uu < element.numb.length; uu++) {
                                                                    if (element.numb[uu] === element1.brickNums[u]) {
                                                                        element.numb.splice(uu, 1);
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            v = ({ word: newWord, numb: element.numb });
                                                        }
                                                    }
                                                }
                                                else {
                                                    console.log("Waaaaah - " + element1.word + "is not a word");
                                                    inDict = false;
                                                    def = "-1";
                                                }
                                                // Write to DB
                                                $.ajax({
                                                    method: "POST",
                                                    url: "api/Word",
                                                    data: { TheWord: element1.word, IsWord: inDict, Definition: def }
                                                });
                                            });
                                        }
                                    }
                                });
                            }
                            
                        });
                    }
                    masterWords[index] = v;
                });
            }
        },


        computeScore: function(rp1)
        {
            var score1 = 0;
            for (var i = 0; i < rp1.length; i++)
            {
                for (var j = 0; j < letterValues.length; j++)
                {
                    if (letterValues[j].letter === brix1[rp1[i]].l)
                    {
                        score1 += letterValues[j].value;
                        break;
                    }
                }
            }
            
            return score1;
        },


        isWordInDB: function(Word2, cb){
            $.ajax({
                url: "api/Word?werd=" + Word2,
                method: "GET",
            })
            .done(function (result) {
                cb;
            });
        },


        putInDatabase: function(daWord, inD, z){
            $.ajax({
                method: "POST",
                url: "api/Word",
                data: {TheWord: daWord, IsWord: inD, Definition: z}
            });
        },


        moveBricksDown: function () {

            for (var n = 0; n < brix1.length; n++) {

                // If x/y corner of brick matches anything in Brix1 array

                while ((brix1[n].y < (Game.height - 20)) && !(Bricks.collide2(brix1[n].x, brix1[n].y, n))) {

                    // While the brick is not at bottom and no collision, move brick down

                    brix1[n].y += 1;

                }

            }

        }

    };



    var Ctrl = {

        init: function () {

            // Browser based events

            window.addEventListener('keydown', this.keyDown, true);

            window.addEventListener('keyup', this.keyUp, true);

            Game.canvas.addEventListener('mousemove', this.moveFallingBrick, true);

        },



        // When left or right arrow key down, move falling brick in that direction

        keyDown: function (event) {

            switch (event.keyCode) {

                case 39: // Left

                    Ctrl.left = true;

                    break;

                case 37: // Right

                    Ctrl.right = true;

                    break;

                default:

                    break;

            }

        },



        // On keyUp, stop moving

        keyUp: function (event) {

            switch (event.keyCode) {

                case 39: // Left

                    Ctrl.left = false;

                    break;

                case 37: // Right

                    Ctrl.right = false;

                    break;

                default:

                    break;

            }

        },



        // Move falling brick using mouse.

        moveFallingBrick: function (event) {

            var mouseX = event.pageX;

            var canvasX = Game.canvas.offsetLeft + Game.canvas.parentElement.offsetLeft;

            var FallingBrickMid = FallingBrick.w;

            if (mouseX > canvasX + FallingBrick.w &&

                mouseX < canvasX + Game.width) {

                var newX = mouseX - canvasX;

                newX -= FallingBrickMid;

                FallingBrick.x = newX;

            }

        }

    };


    window.onload = function () {

        Game.setup();

    };

}());