/*************************************************************************
 ART385 Project 3
          by Maj Jenkins
    May 13, 2021

    Overview:
    
    ---------------------------------------------------------------------
    Notes: 
     (1) 
**************************************************************************/


/*************************************************************************
// Global variables
**************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects



//////////////////////////////////////////

// indexes into the clickable array (constants) 
const cl_startScenario = 0;
const cl_Start_SOCPays = 1;
const cl_Start_CityPays = 2;
const cl_Start_RaiseTaxes = 3;
const cl_SOCMoves_CityPays = 4;
const cl_SOCMoves_RaiseTaxes = 5;
const cl_SOCMoves_BuildRival = 6;
const cl_SOCMoves_IgnoreThem = 7;
const cl_CityPays_CutTheArts = 8;
const cl_CityPays_CutTransportation = 9;
const cl_CityPays_CutCityWages = 10;
const cl_CityPays_CutParks = 11;


// const cl_BeginTour = 0;
// const cl_BeginGameBg = 1;
// const cl_BeginGameTour = 2;
// const cl_SOC = 3;
// const cl_ENTH = 4;
// const cl_GOV = 5;
// const cl_PSYCH = 6;
// const cl_ANTI = 7;


// anger emojis
var angerImage;   // anger emoji
var maxAnger = 5;

// character arrays
var characterImages = [];   // array of character images, keep global for future expansion
var characters = [];        // array of charactes

// characters
const SOC = 0;
const ENTH = 1;
const GOV = 2;
const PSYCH = 3;
const ANTI = 4;
// const consumer = 5;

// // room indices - look at adventureManager
// const startScreen = 3;
// const SOCMovesScreen = 4;
// const cityPaysScreen = 5;
// const raisedTaxesScreen = 6;
// const rivalCompanyScreen = 7;
// const SOCExpands = 8;
// const cityUgly = 9;
// const workersStrike = 10;

const Start = 4;


////////////////////////////////////////////////


// Style
var palette = [];
palette[0] = '#F2F4ED';
palette[1] = '#EBF49A';
palette[2] = '#B5C140';
palette[3] = '#9EA734';
palette[4] = '#7B7F21';
palette[5] = '#42422C';

// Fonts
let titleFont;
let bodyFont;


/*************************************************************************
// Function preload
**************************************************************************/

// Allocate Adventure Manager with states table and interaction tables
function preload() {

  titleFont = loadFont('assets/font/Changeling_Neo_Bold.otf');
  bodyFont = loadFont('assets/font/eurostile.otf');

  // load all images
  angerImage = loadImage("assets/anger_emoji.png");
  
  allocateCharacters();

  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
}

/*************************************************************************
// Function setup
**************************************************************************/
// Setup the adventure manager
function setup() {
  createCanvas(1366, 768);

  // Style
  background(palette[2]);
  textFont(bodyFont);
  fill(palette[0]);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

  // This will load the images, go through state and interaction tables, etc
  adventureManager.setup();

  // load all text screens
  loadAllText();

  setupClickables(); 

  fs = fullscreen();
}

function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

 // drawCharacters();

  // don't draw them on first few screens
  if( adventureManager.getStateName() === "Background" ||
      adventureManager.getStateName() === "Instructions" ||
      adventureManager.getStateName() === "Tour" ||
      adventureManager.getStateName() === "Characters" ) {
    ;
  }
  else {
    drawCharacters();
  }
  
  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch all keys to adventure manager
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  // dispatch all mouse events to adventure manager
  adventureManager.mouseReleased();
}

function drawCharacters() {
  for( let i = 0; i < characters.length; i++ ) {
    characters[i].draw();
  }
}

//-------------- CLICKABLES  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHoverNORM;
    clickables[i].onOutside = clickableButtonOnOutsideNORM;    
  }

  for( let i = 3; i <= 7; i++ ) {
    clickables[i].onHover = clickableButtonHoverICON;
    clickables[i].onOutside = clickableButtonOnOutsideICON;    
  }

  for( let i = 8; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHoverCHOICE;
    clickables[i].onOutside = clickableButtonOnOutsideCHOICE;    
  }

  // we do specific callbacks for each clickable
  clickables[0].onPress = clickableButtonPressed;
  clickables[1].onPress = clSOCPays;
  clickables[2].onPress = clCityPays;
  clickables[3].onPress = clRaiseTaxes;
  clickables[4].onPress = clCityPays;
  clickables[5].onPress = clRaiseTaxes;
  clickables[6].onPress = clBuildRival;
  clickables[7].onPress = clIgnoreThem;
  clickables[8].onPress = clCutArts;
  clickables[9].onPress = clCutTransportation;
  clickables[10].onPress = clCutCityWages;
  clickables[11].onPress = clCutParks;

}

clickableButtonPressed = function() {
  adventureManager.clickablePressed(this.name);
} 

clickableButtonOnOutsideNORM = function () {
  this.color = palette[3];
  this.stroke = "#00000000";
  this.textSize = 16;
  this.textColor = palette[0];
  this.textFont = bodyFont;
  this.width = 220;
  this.height = 30;
}

clickableButtonHoverNORM = function () {
  this.color = palette[4];
  this.noTint = false;
  this.tint = palette[4];
}

clickableButtonOnOutsideICON = function () {
  this.color = "#00000000";
  this.stroke = "#00000000";
  // this.stroke = palette[4];
  this.textSize = 16;
  this.textColor = palette[0];
  this.textFont = bodyFont;
  this.width = 110;
  this.height = 110;
}

clickableButtonHoverICON = function () {
  this.color = palette[3];
  this.noTint = true;
  this.tint = palette[4];
}

clickableButtonOnOutsideCHOICE = function () {
  this.color = palette[2];
  this.stroke = palette[0];
  this.strokeWeight = 5;
  this.cornerRadius = 20;
  this.textSize = 20;
  this.textColor = palette[0];
  this.textFont = bodyFont;
  this.width = 210;
  this.height = 50;
}

clickableButtonHoverCHOICE = function () {
  this.color = palette[3];
  this.noTint = true;
  this.tint = palette[3];
}








//-- specific button callbacks: these will add or subtrack anger, then
//-- pass the clickable pressed to the adventure manager, which changes the
//-- state. A more elegant solution would be to use a table for all of these values
clSOCPays = function() {
    characters[SOC].addAnger(2);
    characters[PSYCH].subAnger(1);
    characters[GOV].addAnger(1);
    adventureManager.clickablePressed(this.name);
}

clCityPays = function() {
  characters[ENTH].addAnger(1);
  characters[PSYCH].subAnger(1);
  characters[SOC].subAnger(2);
  adventureManager.clickablePressed(this.name);
}

clRaiseTaxes = function() {
  characters[PSYCH].addAnger(1);
  // characters[consumer].addAnger(1);
  characters[ANTI].addAnger(1);
  characters[SOC].subAnger(1);
  adventureManager.clickablePressed(this.name);
}

clBuildRival = function() {
  characters[PSYCH].addAnger(2);
  // characters[consumer].subAnger(1);
  characters[SOC].addAnger(1);
  characters[GOV].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clIgnoreThem = function() {
  characters[PSYCH].addAnger(1);
  characters[ANTI].addAnger(1);
  characters[GOV].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutArts = function() {
  characters[ANTI].addAnger(2);
  // characters[consumer].addAnger(2);
  characters[ENTH].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutTransportation = function() {
  characters[ANTI].addAnger(3);
  characters[ENTH].addAnger(1);
  // characters[consumer].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutCityWages = function() {
  characters[ENTH].addAnger(2);
  characters[GOV].addAnger(2);
  // characters[consumer].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutParks = function() {
  characters[ENTH].addAnger(1);
  characters[ANTI].addAnger(2);
  // characters[consumer].addAnger(1);
  adventureManager.clickablePressed(this.name);
}





//-------------- CHARACTERS -------------//
function allocateCharacters() {
  // load the images first
  characterImages[SOC] = loadImage("assets/icon/soc.png");
  characterImages[ENTH] = loadImage("assets/icon/enth.png");
  characterImages[GOV] = loadImage("assets/icon/gov.png");
  characterImages[PSYCH] = loadImage("assets/icon/psych.png");
  characterImages[ANTI] = loadImage("assets/icon/anti.png");

  for( let i = 0; i < characterImages.length; i++ ) {
    characters[i] = new Character();
    // characters[i].setup( characterImages[i], 50 + (400 * parseInt(i/2)), 120 + (i%2 * 120));
    characters[i].setup( characterImages[i], 35, 100 + (i*130));
  }

  // default anger is zero, set up some anger values
  characters[GOV].addAnger(1);
  characters[PSYCH].addAnger(2);
  characters[ANTI].addAnger(1);
  // characters[consumer].subAnger(2); // test
}

class Character {
  constructor() {
    this.image = null;
    this.x = width/2;
    this.y = width/2;
  }

  setup(img, x, y) {
    this.image = img;
    this.x = x;
    this.y = y;
    this.anger = 0;
  }

  draw() {
    if( this.image ) {
      push();
      // draw the character icon
      imageMode(CORNER);
      image( this.image, this.x, this.y, 110, 110);

      // draw anger emojis
      for( let i = 0; i < this.anger; i++ ) {
        image(angerImage, this.x + 110 + (i*50), this.y + 20);
      }

      pop();
    }
  }

  getAnger() {
    return this.anger;
  }

  // add, check for max overflow
  addAnger(amt) {
    this.anger += amt;
    if( this.anger > maxAnger ) {
      this.anger = maxAnger;
    }

  }

  // sub, check for below zero
  subAnger(amt) {
    this.anger -= amt;
    if( this.anger < 0 ) {
      this.anger = 0;
    }
  }
}

//-------------- ROOMS --------------//

// hard-coded text for all the rooms
// the elegant way would be to load from an array
function loadAllText() {
  // go through all states and setup text
  // ONLY call if these are ScenarioRoom
  
// copy the array reference from adventure manager so that code is clearer
  scenarioRooms = adventureManager.states;

  scenarioRooms[Start].setText("How should the company brand itself?");

  // scenarioRooms[startScreen].setText("Who Pays for it?", "The underground tunnels cost money to maintain. SOC threatens to leave the city if they have to pay for all the maintenance work. Who pays for it?");
  // scenarioRooms[SOCMovesScreen].setText("Do we lure them back?", "SOC moves their headquarters to our rival city across the river. They layoff local workers. How should we respond?");
  // scenarioRooms[cityPaysScreen].setText("What do we cut?", "The city budget is getting tanked because of the cost of the tunels. Which programs should we cut?");
  // scenarioRooms[raisedTaxesScreen].setText("How do we help the economy?", "The wealthy leave the city in droves. Restaurants start closing and our tax base is depleted. What do we do?");
  // scenarioRooms[rivalCompanyScreen].setText("It's bad, what do we do?", "The rival company is even worse than SOC. In addition to being anti-union, they force everyone to wear silly uniforms, sing happy children's songs and sign the most restrictive NDAs ever.");
  // scenarioRooms[SOCExpands].setText("Oh-no! Now what to do?", "SOC expands its operations. It is now both in your city and the rival city. It's driven out all the local businesses.");
  // scenarioRooms[cityUgly].setText("How can we fix this?", "The city has cut the budget to some of its essential services. It's been a cascading effect. Without arts and adequate transportation, everyone has become depressed. THE END.");
  // scenarioRooms[workersStrike].setText("How do we respond?", "There are massive worker's strikes. The city is shut down. Big labor is angry and riling people up. Thousands of protesters are in the streets.");
}

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

class BackgroundScreen extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*3; 

    this.titleText = "background";

    this.aboutText = "Voluptatem mollitia dolor incidunt. Molestias et ea rerum sint nobis repellat. Non sed incidunt minus repellendus ipsam non et. Quidem ratione atque qui recusandae…";
  }

  draw() {
    super.draw();
    background(palette[2]);

    push();
    fill(palette[0]);
    textAlign(LEFT);
    textFont(titleFont);
    textSize(42);
    text(this.titleText, width/6, (height/6)*2 - 15);
    pop();

    push();
    fill(palette[0]);
    textAlign(LEFT);
    textSize(24);
    text(this.aboutText, width/6, (height/6)*2 + 15, this.textBoxWidth, this.textBoxHeight);
    pop();
  }
}





class TourScreen extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*3; 

  }

  draw() {
    tint(palette[4]);
    super.draw();
  }
}



class ScenarioRoom extends PNGRoom {
  // Constructor gets called with the new keyword, when upon constructor for the adventure manager in preload()
  constructor() {
    super();    // call super-class constructor to initialize variables in PNGRoom

    this.interactionBox = loadImage('assets/interaction_box.png');
    this.drawInteractX = 305;
    this.drawInteractY = 100;

    this.noticeBox = loadImage('assets/notice_box.png');
    this.drawNoticeX = this.drawInteractX + 100;
    this.drawNoticeY = this.drawInteractY + 100;

    this.bodyText = "";
  }

  // should be called for each room, after adventureManager allocates
  setText(bodyText) {
    this.bodyText = bodyText;
    this.drawXTxt = 305;
    this.drawYTxt = 100;
  }

  draw() {
    super.draw();

    // Screen
    image(this.interactionBox, this.drawInteractX, this.drawInteractY);
    image(this.noticeBox, this.drawNoticeX, this.drawNoticeY);

    // text
    push();
    fill(palette[4]);
    textFont(bodyFont);
    textSize(24);
    text(this.bodyText, this.drawNoticeX + 50, this.drawNoticeY + 100, 383, 383);
    pop();
  }
}

