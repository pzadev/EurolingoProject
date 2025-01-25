export function lookAtJournal() {
  if (this.journalTriggered) return;
  this.journalTriggered = true;
  this.Chest_exMark = this.physics.add
    .staticSprite(540, 223, "exMark")
    .setScale(0.06)
    .setDepth(2)
    .refreshBody();
  this.interaction = true;
  this.chestOpened = false;
  this.chest = this.physics.add
    .staticSprite(540, 223, "chest")
    .setScale(4)
    .refreshBody();
  this.physics.add.collider(
    this.player,
    this.chest,
    this.openChest,
    null,
    this
  );
  this.interaction = true;
  this.chestOpened = false;
  fetchAndDisplayWords();
  this.Book_exMark.destroy();
}

export function fetchAndDisplayWords(language) {
  this.journalImage = this.add.image(500, 310, "journal").setDepth(3);
  this.journalImage.displayWidth = 1200;
  this.journalImage.displayHeight = 1050;

  return fetch(`https://elbackend.onrender.com/api/${language}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      const randomWords = this.getRandomWords(data, 5);
      return randomWords;
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
}

export function displayWords(data) {
  const leftWordsData = data.map((item) => ({
    text: item.englishWord,
    rank: item.rank,
  }));
  const rightWordsData = data.map((item) => ({
    text: item.targetWord,
    rank: item.rank,
  }));

  this.leftWordData = leftWordsData;
  this.rightWordData = rightWordsData;

  leftWordsData.forEach((leftItem, index) => {
    this.createLeftText(
      leftItem.text,
      170,
      60 + index * 70,
      leftItem.rank,
      "#8B0000",
      this.leftWords
    );
    this.createRightText(
      rightWordsData[index].text,
      590,
      60 + index * 70,
      rightWordsData[index].rank,
      "#000000",
      this.rightWords
    );
  });
  createBackButton();
}

function createBackButton() {
  this.back_btn = this.add.image(860, 565, "back").setDepth(3).setInteractive();
  this.back_btn.on("pointerdown", () => cleanJournal());
}

function cleanJournal() {
  [
    this.back_btn,
    this.journalImage,
    ...this.leftWords,
    ...this.rightWords,
  ].forEach((item) => item?.destroy());
}
