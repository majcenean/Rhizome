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

// choices tracking 
var v_CHOICE_BRANDING_ORG = false; 
var v_CHOICE_BRANDING_STARTUP = false; 
var v_CHOICE_INFO_NONE = false; 
var v_CHOICE_INFO_TRUE = false; 
var v_DECISION_FALSEINFO = false; 
var v_CHOICE_FALSEINFO_PAY = false; 
var v_CHOICE_FALSEINFO_THREATEN = false; 
var v_CHOICE_TESTING_MORE = false; 
var v_CHOICE_TESTING_LESS = false; 
var v_CHOICE_PRICING_EXPENSIVE = false; 
var v_CHOICE_PRICING_AFFORDABLE = false;

////////////////////////////////////////////////

// Style 
var palette = [];
palette[0] = '#F2F4ED';
palette[1] = '#EBF49A';
palette[2] = '#B5C140';
palette[3] = '#9EA734';
palette[4] = '#7B7F21';
palette[5] = '#42422C';

// Integration Images
var int = []; 
var integration = 0;
var intBorder;

// Fonts
let titleFont;
let bodyFont;

// CreateGraphics
var mushCanvas;
var mushSize = 450;

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

  // Model
  mushModel = loadModel('assets/mushroom.obj', true);

  // Integration Images
  int[0] = loadImage("assets/int/integration_0.png");
  int[1] = loadImage("assets/int/integration_1.png");
  int[2] = loadImage("assets/int/integration_2.png");
  int[3] = loadImage("assets/int/integration_3.png");
  int[4] = loadImage("assets/int/integration_4.png");
  int[5] = loadImage("assets/int/integration_5.png");
  int[6] = loadImage("assets/int/integration_6.png");
  int[7] = loadImage("assets/int/integration_7.png");
  int[8] = loadImage("assets/int/integration_8.png");
  int[9] = loadImage("assets/int/integration_9.png");
  int[10] = loadImage("assets/int/integration_10.png");
  intBorder = loadImage("assets/int/border.png");

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

  // createGraphics
  mushCanvas = createGraphics(mushSize, mushSize, WEBGL);

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

  // don't draw them on these screens
  if( adventureManager.getClassName() === "BackgroundScreen" ||
      adventureManager.getClassName() === "InstructionScreen" || 
      adventureManager.getClassName() === "TourScreen" ||
      adventureManager.getClassName() === "EffectsScreen" ||
      adventureManager.getClassName() === "EndingScreen" ) {
    ;
  }
  else {
    // draws anger for characters
    drawCharacters();
    // draws hover clickables for characters
    clickablesIconsManager.draw();

    // draws integration top of screen
    drawIntegration();
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

/*************************************************************************
// Functions for Clickables
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
  clickables[8].onPress = cl_CHOICE_BRANDING_ORG;
  clickables[9].onPress = cl_CHOICE_BRANDING_STARTUP;
  clickables[10].onPress = cl_CHOICE_INFO_NONE
  clickables[11].onPress = cl_CHOICE_INFO_TRUE
  clickables[12].onPress = cl_CHOICE_INFO_FALSE
  clickables[13].onPress = cl_CHOICE_FALSEINFO_PAY
  clickables[14].onPress = cl_CHOICE_FALSEINFO_THREATEN
  clickables[15].onPress = cl_CHOICE_TESTING_MORE
  clickables[16].onPress = cl_CHOICE_TESTING_LESS
  clickables[17].onPress = cl_CHOICE_PRICING_EXPENSIVE
  clickables[18].onPress = cl_CHOICE_PRICING_AFFORDABLE
  clickables[29].onPress = cl_continue_toEnding;
  clickables[30].onPress = cl_restart;
  clickables[31].onPress = cl_restart;
  clickables[32].onPress = cl_restart;
  clickables[33].onPress = cl_restart;
  clickables[34].onPress = cl_restart;
  clickables[35].onPress = cl_restart;
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

cl_CHOICE_BRANDING_ORG = function() {
  characters[PSYCH].subAnger(1);
  characters[ENTH].addAnger(1);
  v_CHOICE_BRANDING_ORG = true;
  addIntegration(2);
  adventureManager.clickablePressed(this.name);
}

cl_CHOICE_BRANDING_STARTUP = function() {
  characters[ENTH].subAnger(1);
  characters[PSYCH].addAnger(1);
  characters[ANTI].addAnger(1);
  v_CHOICE_BRANDING_STARTUP = true;
  addIntegration(2);
  adventureManager.clickablePressed(this.name);
}

cl_CHOICE_INFO_NONE = function() {
  characters[GOV].addAnger(1);
  characters[ENTH].subAnger(1);
  v_CHOICE_INFO_NONE = true;
  addIntegration(0.5);
  adventureManager.clickablePressed(this.name);
}

cl_CHOICE_INFO_TRUE = function() {
  characters[PSYCH].subAnger(1);
  characters[ANTI].addAnger(1);
  v_CHOICE_INFO_TRUE = true;
  addIntegration(1);
  adventureManager.clickablePressed(this.name);
}

cl_CHOICE_INFO_FALSE = function() {
  characters[SOC].subAnger(1);
  characters[ENTH].subAnger(1);
  characters[GOV].subAnger(1);
  characters[PSYCH].subAnger(1);
  characters[ANTI].subAnger(1);
  v_DECISION_FALSEINFO = true;
  addIntegration(3.5);
  adventureManager.clickablePressed(this.name);
}

cl_CHOICE_FALSEINFO_PAY = function() {
  v_CHOICE_FALSEINFO_PAY = true;
  addIntegration(1);
  adventureManager.clickablePressed(this.name);
}

cl_CHOICE_FALSEINFO_THREATEN = function() {
  characters[SOC].addAnger(1);
  characters[ENTH].addAnger(1);
  characters[GOV].addAnger(2);
  characters[PSYCH].addAnger(1);
  characters[ANTI].addAnger(2);
  v_CHOICE_FALSEINFO_THREATEN = true;
  adventureManager.clickablePressed(this.name);
}

cl_CHOICE_TESTING_MORE = function() {
  characters[SOC].addAnger(1);
  characters[ENTH].addAnger(1);
  characters[PSYCH].subAnger(1);
  v_CHOICE_TESTING_MORE = true;
  addIntegration(1);
  adventureManager.clickablePressed(this.name);
}

cl_CHOICE_TESTING_LESS = function() {
  characters[SOC].subAnger(1);
  characters[GOV].addAnger(1);
  characters[PSYCH].addAnger(1);
  v_CHOICE_TESTING_LESS = true;
  addIntegration(2);
  adventureManager.clickablePressed(this.name);
}

cl_CHOICE_PRICING_EXPENSIVE = function() {
  characters[SOC].addAnger(1);
  characters[PSYCH].subAnger(1);
  characters[ANTI].addAnger(1);
  v_CHOICE_PRICING_EXPENSIVE = true;
  addIntegration(0.5);
  adventureManager.clickablePressed(this.name);
}

cl_CHOICE_PRICING_AFFORDABLE = function() {
  characters[SOC].subAnger(1);
  characters[ENTH].subAnger(1);
  characters[ANTI].subAnger(1);
  v_CHOICE_PRICING_AFFORDABLE = true;
  addIntegration(3);
  adventureManager.clickablePressed(this.name);
}

cl_continue_toEnding = function() {
  // Hivemind Ending
  if (v_DECISION_FALSEINFO === true &&
      v_CHOICE_FALSEINFO_PAY === true &&
      v_CHOICE_TESTING_LESS === true && 
      v_CHOICE_PRICING_AFFORDABLE === true &&
      integration >= 7) {
    adventureManager.changeState('Ending1');
  }
  // Goodguy Ending
  else if (v_CHOICE_BRANDING_ORG === true &&
      v_CHOICE_INFO_TRUE === true &&
      v_CHOICE_TESTING_MORE === true &&
      v_CHOICE_PRICING_AFFORDABLE === true &&
      characters[SOC].getAnger() <= 2) {
    adventureManager.changeState('Ending2');
  }
  // Revolt Ending
  else if (v_CHOICE_BRANDING_STARTUP === true &&
      v_CHOICE_FALSEINFO_THREATEN === true &&
      v_CHOICE_TESTING_LESS === true &&
      v_CHOICE_PRICING_EXPENSIVE === true &&
      characters[ANTI].getAnger() >= 2) {
    adventureManager.changeState('Ending3');
  }
  // Dictator Ending
  else if (v_CHOICE_BRANDING_STARTUP === true &&
      v_CHOICE_INFO_NONE === true &&
      v_CHOICE_TESTING_MORE === true &&
      v_CHOICE_PRICING_EXPENSIVE === true) {
    adventureManager.changeState('Ending4');
  }
  // Rich Solution Ending
  else if (v_CHOICE_BRANDING_STARTUP === true &&
      v_CHOICE_INFO_TRUE === true &&
      v_CHOICE_TESTING_MORE  === true &&
      v_CHOICE_PRICING_EXPENSIVE === true &&
      integration <= 7) {
    adventureManager.changeState('Ending5');
  }
  // None of these endings
  else {
    adventureManager.changeState('Ending6');
  }
}

cl_restart = function() {
  window.location.href = "."
}

/*************************************************************************
// Integration
**************************************************************************/
function drawIntegration() {
  if (integration <= 0) {
    drawIntegrationImage(0);
  }
  else if (integration <= 1) {
    drawIntegrationImage(1);
  }
  else if (integration <= 2) {
    drawIntegrationImage(2);
  }
  else if (integration <= 3) {
    drawIntegrationImage(3);
  }
  else if (integration <= 4) {
    drawIntegrationImage(4);
  }
  else if (integration <= 5) {
    drawIntegrationImage(5);
  }
  else if (integration <= 6) {
    drawIntegrationImage(6);
  }
  else if (integration <= 7) {
    drawIntegrationImage(7);
  }
  else if (integration <= 8) {
    drawIntegrationImage(8);
  }
  else if (integration <= 9) {
    drawIntegrationImage(9);
  }
  else if (integration <= 10) {
    drawIntegrationImage(10);
  }
}

function drawIntegrationImage(x) {
  image(this.int[x], 0, 20, 1366, 61);
  image(this.intBorder, 0, 0, 1366, 61);
}

function addIntegration(x) {
  integration = integration + x;
}


/*************************************************************************
// Characters
**************************************************************************/
function drawCharacters() {
  for( let i = 0; i < characters.length; i++ ) {
    characters[i].draw();
  }
}

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
  
// copy the array reference from adventure manager so that code is clearer
  states = adventureManager.states;

  // BG and INTRODUCTION
  states[0].setText("Humanity is in desperate need... of itself. With many facing an incapability to simply go outside and make friends, one group of forward-thinkers has developed a new technology that may mean the end of human loneliness. Connect to The Interface: a global network of human minds, made possible by combining the capabilities of the human mind with that of vast underground fungal networks. By integrating oneself with The Interface, one will never be alone again; their thoughts, desires, and needs are inherently shared with their peers.\n\nBut how to introduce humanity to this radical step forward? Your responsibility as the leader of The Interface is to promote it to all members of the globe. But be warned - some do not look upon this solution with such favorable eyes.");
  states[1].setText("From the cutting edge of technology comes a solution to all humanly woes. By studying the underground networks of fungi, scientists have developed a cure for the loneliness rampant in modern society. By integrating with The Interface, participants connect seamlessly to each other’s thoughts, feelings, and emotions, and can be certain that they will never suffer loneliness again.\n\nSecure your space in The Interface today!");

  // BRANDING
  // Decision 
  states[2].setText("Societies across the globe flock in curiosity towards this brand-new development. How should The Interface make its first bold steps into society? Should it represent itself as the miracle cure to all of humanity's issues, or the next technological giant ready to demand respect in the private sector?");
  // Choices
  states[3].setText("Mental health professionals worldwide are excited by the promises of a new wellness organization seeking a cure for loneliness…\n\nTech enthusiasts are disappointed that the organization will not focus itself on the pursuit of new gadgets…\n\nSkeptics accuse the startup of corporate greed.");
  states[4].setText("A new startup promises solutions to humanity’s pervasive loneliness problem, enticing the tech world… \n\nMental health professionals are disappointed that the startup will not prioritize bettering their patients, but rather their technology...");

  // INFO SHARING
  // Decision
  states[5].setText("A rumor has been circulating that The Interface seeks to create a human hivemind by combining the genetic material of humans and fungi. Inquiry into the methods and technologies of The Interface has increased at the behest of skeptics. How should The Interface handle the release of this sensitive information, information which, if released, could greatly upset the public?");
  // Choices
  states[6].setText("Governments across the globe are scrutinizing The Interface’s background and future plans due to their refusal to release records.\n\nLoyal tech enthusiasts, on the other hand, defend The Interface saying that they have a right to keep company secrets to themselves.");
  states[7].setText("Shocked by the reality which is not too far from the rumors, support for The Interface goes down amongst skeptics.\n\nElsewhere in the conversations of mental health professionals, The Interface’s strides in human biology are receiving commendations.");

  // FALSE INFORMATION
  // Decision
  states[8].setText("The false info has been received very well by the public, it astounds and amazes… but some employees of The Interface have begun to feel uncomfortable with the fact that they falsified information to the public. Some have even threatened to expose the little white lies. Should these employees be paid off for their silence, or threatened?");
  // Choices
  states[9].setText("The unsettled employees are paid off fastidiously and discreetly. They fade back into the company, taking their bribes with them. Outside, public support for The Interface increases with the guise of the falsified information.");
  states[10].setText("The employees, now recognizing the threat that The Interface poses, organize against it. Quitting in unison, they run to the nearest news outlets to describe the real records they were forced to keep secret. The world is shocked, and public support for The Interface rapidly declines.");
  
  // TESTING
  // Decision
  states[11].setText("Governments across the globe want to ensure The Interface is safe for their people to participate in. Some have requested further testing before the technology is launched in their country. Should The Interface be subjected to further testing before it hits the market, or should it give in to the impatient, demanding consumers ready to buy now?");
  // Choices
  states[12].setText("Frustrated by the delayed timeline, many ravenously awaiting The Interface have been raging against the false promises of a fast delivery to the public.\n\nThe delays in The Interface’s technology going public come with high recommendations and thanks from professionals, who assert that more testing was needed in order to avert disaster.");
  states[13].setText("The Interface gains many more happy participants today as it prepares to open up public access to its technology, much to the pleasure of the lonely and once-suffering masses.\n\nCriticism from governments, along with psychologists and doctors, ramp up against The Interface, touting claims that the technology is not safe yet for human participants. Only time will tell...");
  
  // PRICING
  // Decision
  states[14].setText("The Interface is about to launch publically for the first time. What scale of pricing should people expect? Should it be an exclusive, pricey status symbol, or an everyman's solution?");
  // Choices
  states[15].setText("Loyal enthusiasts and those desperate for the technology promised by The Interface cry out in protest today as the company revealed its skyrocketing prices.\n\nProfessionals come to the defense of The Interface, citing the high costs of medical research and the current state of the pharmaceutical industry as justification.");
  states[16].setText("The Interface delivers its promises to the public today as its technology rolls out for prices even lower than predicted, causing great rejoice and clamoring amongst the chronically lonely population.\n\nEnthusiasts of the brand as well as those who were initially against it are pleased by the accessible pricing.");

  // Tour
  states[17].setText("Hey! This tour will guide you around your decision-making desk. Let's get started!");
  states[18].setText("This is your main decision-making screen. Memos about current happenings will appear. Using these buttons, you will make a choice on how to act.");
  states[19].setText("These icons represent the various populations of the world and their attitudes towards you, which will change depending on how they react to your decisions. When a population is upset with a decision you have made, they will gain another anger symbol next to their icon. Try to keep everyone’s anger to a minimum! Hover over the icons in-game to learn more about each population.");
  states[20].setText("Finally, this scale at the top represents the percentage of people worldwide who have joined The Interface. Your goal is to get as many people as possible to join! After all, who wouldn't want a cure to loneliness?");
  states[21].setText("That's all for the tour! Have fun playing!\n\nAnd don't forget... your choices will decide the fate of humanity and all of its lonely souls!");

  // Endings
  states[22].setText("The Interface is released publicly for the first time, changing the course of humanity forever.");
  states[23].setText("The Interface has made it possible for humans to connect like never before. Feeling everyone else’s emotions, knowing everyone else’s knowledge, and thinking everyone else’s thoughts is what is considered “natural” in this new reality. Intertwined in every possible manner, the consciousnesses of all participants in The Interface meld together, in an organism that is not quite human, and is not quite fungus. Spreading to all humans, whatever this being is has claimed dominance over the planet.");
  states[24].setText("Is The Interface the saviour of humanity? Quite possibly. Loneliness becomes a thing of the past in this bright future, where instant connection with others’ minds is possible. Friendships and other relationships are instant, simple, and easy. Emotions are shared with great empathy amongst participants who can understand another’s feelings precisely. It is still an individual choice of one to join The Interface, but more and more companies have begun to require it as it is shown to improve workplace efficiency by over 50%.");
  states[25].setText("Angered and fearful of the technology The Interface presents human societies with, public opinion drops rapidly, with many groups beseeching their governments to persecute The Interface and its participants. When governments did not respond to these cries, they took matters into their own hands and destroyed the company. As for those who had already taken part in The Interface, with no way to reverse their participation… they were the targets of violence; however, as they were able to communicate with one another instantly, they fought back with surprising force. Thus started the wars of the 22nd century...");
  states[26].setText("As it comes to control most of the global population, The Interface becomes the hailed leader of the world. The shared mindspace is a tool to control the actions of the masses, pummeling non-participants into submission. The company frequently deletes information from its participants’ minds deemed unsavory, such as questioning of independence or thoughts of revolt. Humanity is reduced to an army of obedient servants and soldiers, ready to be deployed at any time.");
  states[27].setText("With its pricing too unfathomably high to be a feasible solution for the common man, The Interface remains the exclusive right of the rich and wealthy. Instantly able to communicate with one another, they use their shared mindspace to exchange information to help keep control on the economies and markets. It is not often that a person makes enough money to buy into The Interface; usually, they are born into it. The separation between rich and poor worldwide grows more and more vast with each passing day...");
  states[28].setText("A solution for a while, The Interface gains publicity across the globe and more and more participants seeking respite from loneliness; however, it eventually ceases to be the most attractive solution on the market, and The Interface fades into obscurity as generations pass.");
}

/*************************************************************************
// State subclasses
**************************************************************************/
class BackgroundScreen extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*3; 

    this.titleText = "background";
    this.bodyText = "";
  }

  setText(bodyText) {
    this.bodyText = bodyText;
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
    text(this.bodyText, width/6, (height/6)*2 + 15, this.textBoxWidth, this.textBoxHeight);
    pop();
  }
}

class InstructionScreen extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*2;
    this.textBoxHeight = (height/6)*3; 
    this.titleText = "What is The Interface?"
    this.bodyText = "";
  }

  setText(bodyText) {
    this.bodyText = bodyText;
  }

  draw() {
    super.draw();
    background(palette[2]);

    // Create Graphics
    mushCanvas.background(palette[2]);

    let locX = mouseX - height / 2;
    let locY = mouseY - width / 2;

    mushCanvas.ambientLight(60, 60, 60);
    mushCanvas.pointLight(242, 244, 237, mouseX, mouseY, 100);
    mushCanvas.pointLight(242, 244, 237, mouseX, mouseY, 100);
    mushCanvas.ambientMaterial(250);
    mushCanvas.noStroke();
    mushCanvas.fill(123, 127, 33);

    // Scale and Rotation
    mushCanvas.scale(1);
    mushCanvas.rotateZ(0.01);
    mushCanvas.rotateX(0.01);
    mushCanvas.rotateY(0.01);

    // Material and Model
    mushCanvas.model(mushModel);

    image(mushCanvas, 150, 100);

    push();
    fill(palette[0]);
    textAlign(LEFT);
    textFont(titleFont);
    textSize(42);
    text(this.titleText, width/2, (height/6)*2 - 120, this.textBoxWidth, this.textBoxHeight);
    pop();

    push();
    fill(palette[0]);
    textAlign(LEFT);
    textSize(24);
    text(this.bodyText, width/2, (height/6)*2, this.textBoxWidth + 50, this.textBoxHeight);
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

    this.optionsImage = loadImage('assets/options.png');

    this.tintImage1 = loadImage("assets/tint_1.png");
    this.tintImage2 = loadImage("assets/tint_2.png");
    this.tintImage3 = loadImage("assets/tint_3.png");
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

    // integration
    drawIntegration();

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

      // options
      image(this.optionsImage, this.drawNoticeX + 550, this.drawNoticeY + 50);

      // tint
      image(this.tintImage1, 0, 0, 1366, 768);

      // draw text
      this.drawXTxt = (1366/5)*3 - this.textboxOffsetX;
      this.drawYTxt = 768/5 - this.textboxOffsetY;
    }
    else if (adventureManager.getStateName() === "Tour2" ) {
      // notice box
      image(this.noticeBox, this.drawNoticeX, this.drawNoticeY);

      // tint
      image(this.tintImage2, 0, 0, 1366, 768);

      // draw text
      this.drawXTxt = (1366/3)*2 - this.textboxOffsetX;
      this.drawYTxt = 768/2 - this.textboxOffsetY;
    }
    else if (adventureManager.getStateName() === "Tour3" ) {
      // notice box
      image(this.noticeBox, this.drawNoticeX, this.drawNoticeY);

      // tint
      image(this.tintImage3, 0, 0, 1366, 768);

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
    this.bodyText = "";
  }

  setText(bodyText) {
    this.bodyText = bodyText;
    this.drawXTxt = 768;
    this.drawYTxt = 220;
  }

  draw() {
    super.draw();

    push();
    fill(palette[0]);
    textSize(26);
    text(this.bodyText, this.drawXTxt, this.drawYTxt, 455, 440);
    pop();
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

class EndingScreen extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*3; 
    this.bodyText = "";
  }

  setText(bodyText) {
    this.bodyText = bodyText;
    this.drawXTxt = 768;
    this.drawYTxt = 220;
  }

  draw() {
    background(palette[2]);
    super.draw();

if (adventureManager.getStateName() === "Ending" ) {
    push();
    fill(palette[0]);
    textSize(32);
    textAlign(CENTER);
    text(this.bodyText, width/6, (height/6)*2 + 15, this.textBoxWidth, this.textBoxHeight);
    pop();
}
else if (adventureManager.getStateName() === "Ending6" ) {
    let offset = 50;
    push();
    rectMode(CORNER);
    fill(66, 66, 44, 200);
    noStroke();
    rect(width/6 - offset/2, 200 - offset/3, this.textBoxWidth + offset, this.textBoxHeight/1.2 - offset*2);
    fill(palette[0]);
    textSize(26);
    textAlign(LEFT);
    text(this.bodyText, width/6, 200 + 15, this.textBoxWidth, this.textBoxHeight/1.2);
    pop();
}
else {
    let offset = 50;

    push();
    rectMode(CORNER);
    fill(66, 66, 44, 200);
    noStroke();
    rect(width/6 - offset/2, height/2 - offset/3, this.textBoxWidth + offset, this.textBoxHeight - offset*2);
    fill(palette[0]);
    textSize(26);
    textAlign(LEFT);
    text(this.bodyText, width/6, height/2 + 15, this.textBoxWidth, this.textBoxHeight);
    pop();
}
  }
}