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
var clickablesIconsManager;
var clickablesIcons;



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
var characters = [];        // array of characters
var characterImages = [];
var characterInfo = [];
var characterNames = [];

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
  // Fonts
  titleFont = loadFont('assets/font/Changeling_Neo_Bold.otf');
  bodyFont = loadFont('assets/font/eurostile.otf');

  // Images
  tintImage = loadImage("assets/tint.png");
  textBox = loadImage("assets/textbox.png");
  angerImage = loadImage("assets/anger_emoji.png");

  // Characters
  allocateCharacters();

  // Adventure and Clickables Managers
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');

  clickablesIconsManager = new ClickableManager('data/clickableIconsLayout.csv');
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

  clickablesIcons = clickablesIconsManager.setup();

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

/*************************************************************************
// Function draw
**************************************************************************/
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

 // drawCharacters();

  // don't draw them on these screens
  if( adventureManager.getClassName() === "BackgroundScreen" ||
      adventureManager.getClassName() === "InstructionScreen" || 
      adventureManager.getClassName() === "TourScreen" ||
      adventureManager.getClassName() === "EffectsScreen" ) {
    ;
  }
  else {
    drawCharacters();
    // draws hover clickables for characters
    clickablesIconsManager.draw();
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

/*************************************************************************
// Function Clickables
**************************************************************************/
function setupClickables() {
  // Clickable buttons introduction format
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHoverNORM;
    clickables[i].onOutside = clickableButtonOnOutsideNORM;    
  }
  for( let i = 20; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHoverNORM;
    clickables[i].onOutside = clickableButtonOnOutsideNORM;    
  }
  // Clickable buttons choice format
  for( let i = 8; i < 19; i++ ) {
    clickables[i].onHover = clickableButtonHoverCHOICE;
    clickables[i].onOutside = clickableButtonOnOutsideCHOICE;    
  }

  // Clickables - send to adventureManager
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onPress = clickableButtonPressed; 
  }
  for( let i = 0; i < clickablesIcons.length; i++ ) {
    clickablesIcons[i].onPress = clickableButtonPressed; 
  }

  // Clickable Icons Hover
  for( let i = 0; i < clickablesIcons.length; i++ ) {
    clickablesIcons[i].onHover = clickableButtonHoverICON;
    clickablesIcons[i].onPress = clickableButtonHoverEffect;
    clickablesIcons[i].onOutside = clickableButtonOnOutsideICON;    
  }


  // specific callbacks for each clickable
  // clickables[0].onPress = clickableButtonPressed;
  // clickables[1].onPress = clSOCPays;
  // clickables[2].onPress = clCityPays;
  // clickables[3].onPress = clRaiseTaxes;
  // clickables[4].onPress = clCityPays;
  // clickables[5].onPress = clRaiseTaxes;
  // clickables[6].onPress = clBuildRival;
  // clickables[7].onPress = clIgnoreThem;
  // clickables[8].onPress = clCutArts;
  // clickables[9].onPress = clCutTransportation;
  // clickables[10].onPress = clCutCityWages;
  // clickables[11].onPress = clCutParks;
}

clickableButtonPressed = function() {
  adventureManager.clickablePressed(this.name);
}

clickablePressedICON = function() {
  adventureManager.clickablePressed(this.name);
} 

clickableButtonOnOutsideNORM = function() {
  this.color = palette[3];
  this.stroke = "#00000000";
  this.textSize = 16;
  this.textColor = palette[0];
  this.textFont = bodyFont;
  this.width = 220;
  this.height = 30;
}

clickableButtonHoverNORM = function() {
  this.color = palette[4];
  this.noTint = false;
  this.tint = palette[4];
}

clickableButtonOnOutsideICON = function() {
  this.color = "#00000000";
  this.stroke = "#00000000";
  this.textSize = 16;
  this.textColor = palette[0];
  this.textFont = bodyFont;
  this.width = 110;
  this.height = 110;
}

clickableButtonHoverICON = function() {
  this.color = palette[3];
  this.noTint = true;
  this.tint = palette[4];
  clickableButtonHoverEffect();
}

clickableButtonOnOutsideCHOICE = function() {
  this.color = palette[2];
  this.stroke = palette[0];
  this.strokeWeight = 4;
  this.cornerRadius = 20;
  this.textSize = 20;
  this.textColor = palette[0];
  this.textFont = bodyFont;
  this.width = 220;
  this.height = 50;
}

clickableButtonHoverCHOICE = function() {
  this.color = palette[3];
  this.noTint = true;
  this.tint = palette[3];
}

clickableButtonHoverEffect = function() {
  image(tintImage, 0, 0, 1366, 768);
  // image(textBox, this.x + this.width, this.y + this.height/2);

  if (mouseY <= 490) {
    // draws textbox underneath mouse
    image(textBox, mouseX, mouseY);
    drawClickableIconImages();
  }
  else {
    // draws textbox above mouse
    image(textBox, mouseX, mouseY - 253);
    drawClickableIconImages();
  }

}

function drawClickableIconImages() {
  if (mouseY > 100 && mouseY < 230) {
    drawClickableIconImage(SOC, mouseY + 30);
    drawClickableIconText(SOC, mouseY + 30);
  }
  else if (mouseY > 230 && mouseY < 360) {
    drawClickableIconImage(ENTH, mouseY + 30);
    drawClickableIconText(ENTH, mouseY + 30);
  }
  else if (mouseY > 360 && mouseY < 490) {
    drawClickableIconImage(GOV, mouseY + 30);
    drawClickableIconText(GOV, mouseY + 30);
  }
  else if (mouseY > 490 && mouseY < 620) {
    drawClickableIconImage(PSYCH, mouseY + 30 - 253);
    drawClickableIconText(PSYCH, mouseY + 30 - 253);
  }
  else if (mouseY > 620 && mouseY < 768) {
    drawClickableIconImage(ANTI, mouseY + 30 - 253);
    drawClickableIconText(ANTI, mouseY + 30 - 253);
  }
}

function drawClickableIconImage(name, y) {
  image(characterImages[name], mouseX + 862 - 230, y, 200, 200);
}

function drawClickableIconText(name, y) {
  // Title
  push();
  fill(palette[4]);
  textSize(32);
  textFont(titleFont);
  text(characterNames[name], mouseX + 31, y + 20, 800 - 220, 160);
  pop();

  // Body
  push();
  fill(palette[4]);
  textSize(20);
  text(characterInfo[name], mouseX + 31, y + 70, 800 - 220, 160);
  pop();
}

characterNames[SOC] = "social recluses";
characterNames[ENTH] = "tech enthusiasts";
characterNames[GOV] = "global governments";
characterNames[PSYCH] = "social professionals";
characterNames[ANTI] = "skeptics and theorists";

characterInfo[SOC] = "The growing global population finds it more and more challenging to talk to others as each day passes. As instability and incapability defines their lives, they might do anything to get their hands on a solution to their pain - no matter what form that solution may come in.";
characterInfo[ENTH] = "The savvy trend-followers who just have to be on the next big thing in the tech world. The novelty of an independent startup thrills them, the glamour of a shiny new product entices them. As proponents of the private sector, they simply want the newest and nicest thing available on the market.";
characterInfo[GOV] = "Governing bodies across the world. While one might believe their primary concern is that for the safety and welfare for their citizens, profit and capital wealth may rank higher on the priority list for some. At any rate, they desire stability, which means either appeasing or suppressing the majority of the people.";
characterInfo[PSYCH] = "The counselors, psychologists, medics, and analysts of human social needs. To tend to their patients and pursue a cure for the pervasive loneliness which has infected the world twice-around, they look towards a world where everyone is happy, healthy, and satisfied with their life.";
characterInfo[ANTI] = "Critics and other doubtful members of society who are not convinced that The Interface is necessarily a positive addition to humanity's toolbox. Instead of technological solutions, they say, we should pursue the natural solutions of community building and a reduced workday.";




/*************************************************************************
// Clickables callbacks
**************************************************************************/
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
  characters[ENTH].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutTransportation = function() {
  characters[ANTI].addAnger(3);
  characters[ENTH].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutCityWages = function() {
  characters[ENTH].addAnger(2);
  characters[GOV].addAnger(2);
  adventureManager.clickablePressed(this.name);
}

clCutParks = function() {
  characters[ENTH].addAnger(1);
  characters[ANTI].addAnger(2);
  adventureManager.clickablePressed(this.name);
}




/*************************************************************************
// Characters
**************************************************************************/
function allocateCharacters() {
  // load the images first
  characterImages[SOC] = loadImage("assets/icon/soc_l.png");
  characterImages[ENTH] = loadImage("assets/icon/enth_l.png");
  characterImages[GOV] = loadImage("assets/icon/gov_l.png");
  characterImages[PSYCH] = loadImage("assets/icon/psych_l.png");
  characterImages[ANTI] = loadImage("assets/icon/anti_l.png");

  for( let i = 0; i < characterImages.length; i++ ) {
    characters[i] = new Character();
    // characters[i].setup( characterImages[i], 50 + (400 * parseInt(i/2)), 120 + (i%2 * 120));
    characters[i].setup(characterImages[i], 35, 100 + (i*130));
  }

  // Default Anger
  characters[GOV].addAnger(1);
  characters[PSYCH].addAnger(2);
  characters[ANTI].addAnger(1);
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

      // If on the TourScreens, draw images of the icons
      if ( adventureManager.getClassName() === "TourScreen") {
        imageMode(CORNER);
        image( this.image, this.x, this.y, 110, 110);
      }

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


/*************************************************************************
// Rooms
**************************************************************************/
// hard-coded text for all the rooms
// the elegant way would be to load from an array
function loadAllText() {
  // go through all states and setup text
  // ONLY call if these are ScenarioRoom
  
// copy the array reference from adventure manager so that code is clearer
  states = adventureManager.states;

  // Decision Branding
  states[2].setText("Societies across the globe flock in curiosity towards this brand-new development. How should The Interface make its first bold steps into society? Should it represent itself as the miracle cure to all of humanity's issues, or the next technological giant ready to demand respect in the private sector?");
  // Decision Information
  states[5].setText("Inquiry into the methods and technologies of The Interface has increased at the behest of skeptics. How should The Interface handle the release of information? Should they be kept a secret or divulged to the world at large? Or, alternatively, should they be replaced with a decoy?");
  // Decision False Information
  states[8].setText("Some employees of The Interface feel uncomfortable with the fact that The Interface falsified information to the public. Some have even threatened to expose it for its little white lies. Should these employees be paid off for their silence, or threatened?");
  // Decision Testing
  states[11].setText("Governments across the globe want to ensure The Interface is safe for their people to participate in. Some have requested further testing before the technology is launched in their country. Should The Interface be subjected to further testing before it hits the market, or should it give in to the impatient, demanding consumers ready to buy now?");
  // Decision Pricing
  states[14].setText("The Interface is about to launch publically for the first time. What scale of pricing should people expect? Should it be an exclusive, pricey status symbol, or an everyman's solution?");
  // Tour
  states[17].setText("Hey! This tour will guide you around your decision-making desk. Let's get started!");
  states[18].setText("This is your main decision-making screen. Memos about current happenings will appear. Using these buttons, you will make a choice on how to act.");
  states[19].setText("These icons represent the various populations of the world and their attitudes towards you, which will change depending on how they react to your decisions. Hover over the icons in-game to learn more about each population!");
  states[20].setText("Finally, this scale at the top represents the percentage of people worldwide who have joined The Interface. Your goal is to get as many people as possible to join! After all, who wouldn't want a cure to loneliness?");
  states[21].setText("That's all for the tour! Have fun playing!\n\nAnd don't forget... your choices will decide the fate of humanity and all of its lonely souls!");
}

/*************************************************************************
// State subclasses
**************************************************************************/
class BackgroundScreen extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*3; 

    this.titleText = "background";

    this.aboutText = "Humanity is in desperate need... of itself. With many facing an incapability to simply go outside and make friends, one group of forward-thinkers has developed a new technology that may mean the end of human loneliness. Connect to The Interface: a global network of human minds, made possible by combining the capabilities of the human mind with that of vast underground fungal networks. By integrating oneself with The Interface, one will never be alone again; their thoughts, desires, and needs are inherently shared with their peers.\n\nBut how to introduce humanity to this radical step forward? Your responsibility as the leader of The Interface is to promote it to all members of the globe. But be warned - some do not look upon this solution with such favorable eyes.";
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

class InstructionScreen extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*3; 

    this.aboutText = "The Interface is about to hit the market. Guide its production team ";
  }

  draw() {
    super.draw();
    background(palette[2]);

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
    this.interactionBox = loadImage('assets/interaction_box.png');
    this.drawInteractX = 305;
    this.drawInteractY = 100;

    this.bodyText = "";

    this.drawNoticeX = this.drawInteractX + 100;
    this.drawNoticeY = this.drawInteractY + 100;
    this.noticeText = "Should funds be donated to charity as part of a publicity act, or should they be invested into new research?";
    this.noticeBox = loadImage('assets/notice_box.png');
  }

  setText(bodyText) {
    this.bodyText = bodyText;
    this.drawXTxt = 100 - this.textboxOffsetX;
    this.drawYTxt = 100 - this.textboxOffsetY;
    this.textboxOffsetX = 862/2;
    this.textboxOffsetY = 253/2;
  }

  draw() {
    super.draw();

    // interaction box
    image(this.interactionBox, this.drawInteractX, this.drawInteractY);

    // characters
    drawCharacters();

    // text variables
    if (adventureManager.getStateName() === "TourStart" ) {
      // tint
      image(tintImage, 0, 0, 1366, 768);

      // draw text
      this.drawXTxt = 1366/2 - this.textboxOffsetX;
      this.drawYTxt = 768/2 - this.textboxOffsetY;
    }
    else if (adventureManager.getStateName() === "Tour1" ) {
      // notice box
      image(this.noticeBox, this.drawNoticeX, this.drawNoticeY);
      // notice box text
      push();
      fill(palette[4]);
      textFont(bodyFont);
      textSize(24);
      text(this.noticeText, this.drawNoticeX + 50, this.drawNoticeY + 100, 383, 383);
      pop();

      // tint
      image(tintImage, 0, 0, 1366, 768);

      // draw text
      this.drawXTxt = (1366/5)*3 - this.textboxOffsetX;
      this.drawYTxt = 768/5 - this.textboxOffsetY;
    }
    else if (adventureManager.getStateName() === "Tour2" ) {
      // notice box
      image(this.noticeBox, this.drawNoticeX, this.drawNoticeY);

      // tint
      image(tintImage, 0, 0, 1366, 768);

      // draw text
      this.drawXTxt = (1366/3)*2 - this.textboxOffsetX;
      this.drawYTxt = 768/2 - this.textboxOffsetY;
    }
    else if (adventureManager.getStateName() === "Tour3" ) {
      // notice box
      image(this.noticeBox, this.drawNoticeX, this.drawNoticeY);

      // tint
      image(tintImage, 0, 0, 1366, 768);

      // draw text
      this.drawXTxt = 1366/2 - this.textboxOffsetX;
      this.drawYTxt = (768/3)*2 - this.textboxOffsetY;
    }
    else if (adventureManager.getStateName() === "TourEnd" ) {
      // notice box
      image(this.noticeBox, this.drawNoticeX, this.drawNoticeY);

      // tint
      image(tintImage, 0, 0, 1366, 768);

      // draw text
      this.drawXTxt = 1366/2 - this.textboxOffsetX;
      this.drawYTxt = 768/2 - this.textboxOffsetY;
    }

    // guiding textbox
    image(textBox, this.drawXTxt, this.drawYTxt);
    // guiding text
    push();
    fill(palette[4]);
    textSize(26);
    text(this.bodyText, this.drawXTxt + 31, this.drawYTxt + 40, 800, 230);
    pop();
  }
}

class EffectsScreen extends PNGRoom {
  preload() {
  }

  draw() {
    tint(palette[3]);
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

