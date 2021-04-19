var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#2d2d2d",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

let topImage;
let centerImage;
let bottonImage;
let imageHeight = 300;

let iter = 0;

let initialSpeed = 100;
let speed = initialSpeed;
let deltaSpeed = 50;

let currentItem = 0;
let currentLevel = 0;

let tolerance = 30;

let wonText;
let lostText;
let levelText;

function preload() {
  this.load.setBaseURL("../assets");
  this.load.image("topImageAsset", "kardec-croped.jpg");
}

function createTexts(parent) {
  const screenCenterX =
    parent.cameras.main.worldView.x + parent.cameras.main.width / 2;
  const screenCenterY =
    parent.cameras.main.worldView.y + parent.cameras.main.height / 2;

  wonText = parent.add
    .text(screenCenterX, screenCenterY, "Venceu", {
      font: "74px Arial Black",
      fill: "green",
    })
    .setOrigin(0.5);

  wonText.visible = false;

  lostText = parent.add
    .text(screenCenterX, screenCenterY, "Tente de novo", {
      font: "74px Arial Black",
      fill: "red",
    })
    .setOrigin(0.5);

  levelText = parent.add
    .text(screenCenterX, 100, `Level ${currentLevel}`, {
      font: "50px Arial Black",
      fill: "red",
    })
    .setOrigin(0.5);

  lostText.visible = false;
}

function createImages(parent) {
  topImage = parent.add.tileSprite(400, 300, 800, 300, "topImageAsset");
  topImage.setCrop(0, 0, 800, 100);

  centerImage = parent.add.tileSprite(400, 300, 800, 300, "topImageAsset");
  centerImage.setCrop(0, 100, 800, 100);

  bottonImage = parent.add.tileSprite(400, 300, 800, 300, "topImageAsset");
  bottonImage.setCrop(0, 200, 800, 100);
}

function create() {
  createImages(this);
  createTexts(this);

  this.input.on(
    "pointerup",
    function (pointer) {
      currentItem++;

      if (currentItem == 3) {
        console.log(
          topImage.tilePositionX,
          centerImage.tilePositionX,
          bottonImage.tilePositionX
        );

        checkWinCondiction(tolerance);
      }

      if (currentItem > 3) {
        currentItem = 0;
        resetGame();
      }

      console.log(currentItem);
    },
    this
  );
}

function resetGame() {
  wonText.visible = false;
  lostText.visible = false;
}

function updateLevel(up) {
  if (up) {
    currentLevel++;
    speed = speed + deltaSpeed;
  } else {
    currentLevel = 0;
    speed = initialSpeed;
  }

  levelText.text = `Level ${currentLevel}`;
}

function checkWinCondiction(tolerance) {
  console.log(tolerance);
  let topNormalized = Math.abs(topImage.tilePositionX);
  let centerNormalized = Math.abs(centerImage.tilePositionX);
  let bottonNormalized = Math.abs(bottonImage.tilePositionX);

  let diffA = Math.abs(topNormalized - centerNormalized) < tolerance;
  let diffB = Math.abs(centerNormalized - bottonNormalized) < tolerance;
  let diffC = Math.abs(topNormalized - bottonNormalized) < tolerance;

  console.log(diffA, diffB, diffC);

  let test = diffA && diffB && diffC;

  if (test) {
    wonText.visible = true;
    updateLevel(true);
  } else {
    lostText.visible = true;
    updateLevel(false);
  }
}

function update() {
  if (currentItem < 1) {
    topImage.tilePositionX = Math.cos(iter) * speed;
  }

  if (currentItem < 2) {
    centerImage.tilePositionX = -Math.cos(iter) * speed;
  }
  if (currentItem < 3) {
    bottonImage.tilePositionX = Math.sin(iter) * speed;
  }

  iter += 0.01;
}
