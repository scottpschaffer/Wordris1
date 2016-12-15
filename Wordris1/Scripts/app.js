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

    // Letters of Alaphabet usable

    var letters = ["A", "B", "C", "T"];

    //, "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    var letterValues = [{letter: "A", value: 1}, {letter: "B", value: 2},{letter: "C", value: 3},{letter: "D", value: 1},{letter: "E", value: 1}, {letter: "F", value: 1}, {letter: "G", value: 1}, {letter: "H", value: 1},
        {letter: "I", value: 1}, {letter: "J", value: 1}, {letter: "K", value: 1}, {letter: "L", value: 1}, {letter: "M", value: 1}, {letter: "N", value: 1}, {letter: "O", value: 1}, {letter: "P", value: 1},
        {letter: "Q", value: 1}, {letter: "R", value: 1}, {letter: "S", value: 1},{letter: "T", value: 1}, {letter: "U", value: 1}, {letter: "V", value: 1}, {letter: "W", value: 1}, {letter: "X", value: 1},
        {letter: "Y", value: 1}, {letter: "Z", value: 1}];

    var colors = ["red", "orange", "green", "purple", "blue"]

    // Used to allow game to replay

    var again = true;

    // Area where HTML where definition is displayed

    var defText;

    var cbStop = true;



    var Game = {

        // Setup configuration

        canvas: document.getElementById('canvas'),

        setup: function () {

            if (this.canvas.getContext) {

                // Setup variables

                ctx = this.canvas.getContext('2d');



                // Cache width and height of the Canvas to save processing power

                this.width = this.canvas.width;

                this.height = this.canvas.height;



                // Run the game and show Welcome screen

                Screen.welcome();

                // Mousebutton click to activate game

                this.canvas.addEventListener('click', this.runGame, false);

                Ctrl.init();

                //setTimeout(Ctrl.init, 100000);



            }

            // Div where Word Definition will go

            defText = document.getElementById('def');

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



        // Contents of Welcom Screen

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



    var FallingBrick = {

        // Dimensions of a brick

        w: 50,

        h: 20,

        limit: 100,


        // Where Falling Brick starts falling along with setting its letter and color

        init: function () {

            this.x = 100;

            this.y = 100;

            this.speed = 5;

            this.letter = letters[Math.floor(Math.random() * letters.length)];

            this.color = colors[Math.floor(Math.random() * colors.length)];

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

                // Paint Brick
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.w, this.h);

                // Paint letter on the brick
                ctx.fillStyle = "white";
                ctx.fillText(this.letter, this.x + 25, this.y + 15 + 2, 20);
            }
        },



        // Controls side-to-side movement while monitoring sides of wall (canvas)

        move: function () {

            // Detect controller input

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
                    console.log("again=false");
                    // Empty fallen-bricks array

                    brix1 = [];

                    // Add Mouse-click Event Listener

                    Game.canvas.addEventListener('click', Game.restartGame, false);

                    // Put up Gameover screen

                    Screen.gameover();

                    // Again is false so game doesn't restart automatically

                    again = false;

                    console.log("again=false");

                    return;

                }

                else {

                    // If not at or over gameover line, then start again with new falling brick

                    Game.init();

                }



            }



        }



    }



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



        // This needs to be separate from collide because brick already in Brix1 and has to skip itself

        collide2: function (x2, y2, n2) {

            for (var j = 0; j < brix1.length; j++) {

                // Prevent Brick from comparing itself 

                if (j != n2) {

                    if ((((x2 + 50) > brix1[j].x) && ((x2 + 50) <= (brix1[j].x + 50)) || (x2 >= brix1[j].x) && (x2 < (brix1[j].x + 50))) && (((y2 + 20) >= brix1[j].y) && ((y2 + 20) <= (brix1[j].y + 20)))) {

                        return true;

                    }

                }

            }

            return false;

        },



        // Process gets list of words, checks if there are words, then moves down any bricks not removed because word formed

        process: function () {

            var words = this.getListOfWords();
            this.checkIfWords(words);
            this.moveBricksDown();

        },



        getListOfWords: function () {

            var temp1 = [];

            var temp2 = [];

            // From 530 (top) to 210 (limit of bricks)

            for (var y = (Game.height - 20) ; y > FallingBrick.limit; y--) {

                temp2 = [];

                // 410 is width of canvas minus 50 (width of brick) = 360

                for (var x = 0; x < (Game.width - 50) ; x++) {

                    // Go through every brick in list

                    for (var n = 0; n < brix1.length; n++) {

                        // If x/y corner of brick matches anything in list of bricks

                        if ((x == brix1[n].x) && (y == brix1[n].y)) {

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

            var coords = [];
            coords.sort;

            // In beginning, there is no masterWords yet use first list of words
            if (masterWords.length == 0) {
                masterWords = cList;
            }

            else {

                // Parse list of words
                cList.forEach(function (element, index, array)
                {
                    if (element.word != masterWords[index].word)
                    {
                        //debugger
                        Bricks.findSubWord(element.word, function(coords)
                        {
                            console.log("FindSubWord Coords = " + coords);
                            if (coords.length > 1) {
                                var werd = element.numb;
                                console.log("element.word = " + element.word + "| werd = " + werd);
                                var removePart1 = werd.splice(coords[0], (coords[1] - coords[0]) + 1);
                                console.log("removePart1 = " + removePart1);
                                var score = Bricks.computeScore(removePart1);
                                removePart1.sort(function (a, b) { return b - a });
                                for (var u = 0; u < removePart1.length; u++) {
                                    brix1.splice(removePart1[u], 1);
                                }
                            }
                            
                        });
                        // remove bricks
                        masterWords[index] = element;
                        cbStop = true;
                    }
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
                    }
                }
            }
            console.log("score1 = " + score1);
            return score1;
        },

        findSubWord: function (daWord, cb) {

            var w;

            var nums = [];

            // daword.length - 2 because ignore words that are 1 letter long

            for (var x = 0; x < (daWord.length - 2) ; x++) {

                // Start from end of word and go backwards

                for (var y = (daWord.length - 1) ; y > x; y--) {

                    // w contains current substring
                    if (cbStop) {

                        w = daWord.substring(x, y + 1);

                        // If not in badWords array

                        if (!(this.isBadWord(w))) {

                            // Check if word in Database
                            var s = this.isInDatabase(w);
                            if (s != "-1") {
                                // Return Start and Stop section of word that is in Dictionary
                                nums.push(x);
                                nums.push(y);
                                defText.textContent = s;
                                cbStop = false;
                                cb(nums);
                            }
                            else {
                                this.isInDictionary(w, function (z) {
                                    //debugger
                                    if (z != "-1") {

                                        // Return Start and Stop section of word that is in Dictionary
                                        nums.push(x);
                                        nums.push(y);
                                        console.log("nums: " + nums);
                                        console.log("z = " + z);
                                        defText.textContent = z;
                                        cbStop = false;
                                        cb(nums);

                                    }
                                    else {
                                        // If not in Dictionary, then put in Array of known bad words
                                        badWords.push(w);
                                        console.log("w = " + w);
                                        cb([1]);
                                    }

                                });
                            }



                        // Dictionary returns "-1" string if not in Dictionary

                        }

                    }

                }

            }

        },



        // Check if word is in Bad word array

        isBadWord: function(daWord) {

            for (var x = 0; x < badWords.length; x++) {

                if (daWord == badWords[x]) {

                    return true;

                }

            }

            return false;

        },


        isInDatabase: function(daWord){
            for (var x = 0; x < dictList1.length; x++) {

                if (daWord == dictList1[x].name) {

                    // If in dictionary then create word and definition string

                    var declareDef = dictList1[x].name + " - Definition: " + dictList1[x].definition;
                    return declareDef;
                }
            }
            return "-1";
        },


        // Check if word in Dictionary API (currently just an array)

        isInDictionary: function (daWord, cb) {

            

                    // Call Dictionary API

                    this.xhrTest(daWord, function (definition) {
                        if ((definition) || (definition != null)) {
                            console.log("definition = " + definition);
                            return cb(definition);
                        }
                        else {
                            console.log("definition = -1");
                            return cb("-1");
                        }
                    });

            // If not in array, then return -1 as String

            

        },



        moveBricksDown: function () {

            for (var n = 0; n < brix1.length; n++) {

                // If x/y corner of brick matches anything in Brix1 array

                while ((brix1[n].y < (Game.height - 20)) && !(Bricks.collide2(brix1[n].x, brix1[n].y, n))) {

                    // While the brick is not at bottom and no collision, move brick down

                    brix1[n].y += 1;

                }

            }

        },



        // Print out contents of API request

        reqListener: function (dataReq, word, cb) {

            //debugger
            var definition = "";
            var x = dataReq.response;

            var obj = JSON.parse(x);

            if (obj.results.length > 0){
                if (obj.results[0].senses[0].definition) {
                    cb(word + ": " + obj.results[0].senses[0].definition);
                }
                else{
                    cb("-1");
                } 
            }
            else {
                console.log("obj.results.length = 0");
                cb("-1");
            }
            console.log(obj);

        },



        // Make API XHR call

        xhrTest: function (word1, cb) {

            var oReq = new XMLHttpRequest();

            oReq.onreadystatechange = function () {

                if (oReq.readyState === 4)
                    Bricks.reqListener(oReq, word1, cb)

            };

            oReq.open("GET", "http://api.pearson.com/v2/dictionaries/entries?headword=" + word1);

            //"http://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + word1 +"?key=16d591fc-9c27-4304-8057-5faeb1d1da35");

            oReq.send();

            console.log("oReq: " + oReq + " reqListener: ");

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

            //console.log(mouseX);

            var canvasX = Game.canvas.offsetLeft + Game.canvas.parentElement.offsetLeft;

            var FallingBrickMid = FallingBrick.w;

            //console.log ("canvasX: " + canvasX + " FallingBrick.w: " + FallingBrick.w);

            if (mouseX > canvasX + FallingBrick.w &&

                mouseX < canvasX + Game.width) {

                var newX = mouseX - canvasX;

                newX -= FallingBrickMid;

                FallingBrick.x = newX;

            }

        }

    };



    /*Key (Dictionary):
    
    Key (Student 4):
    
    16d591fc-9c27-4304-8057-5faeb1d1da35
    
    ff732ecd-23b1-4a56-a316-2aedfca4050c */



    window.onload = function () {

        Game.setup();

    };

}());