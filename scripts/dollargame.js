class dollarGame {
  constructor(agentCount) {
    this.agentCount = agentCount;
    this.minConnection = this.agentCount - 1;
    this.maxConnection = 0;
    for (let i = 1; i < this.agentCount; i++) {
      this.maxConnection += this.agentCount - i;
    }
    this.connectionCount = floor(random(min(this.maxConnection, this.minConnection + 1),
      min(this.maxConnection, this.minConnection + 3)));
    this.minMoney = this.connectionCount - this.agentCount + 1;
    this.money = this.minMoney;
    this.agents = [];
    this.input = createInput();
    this.button1 = createButton('Load Game!');
    this.button2 = createButton('Copy to clipboard!')
    this.button3 = createButton('Paste from clipboard!')
    this.createGameSetup();
    this.moveCount = 0;
    this.cooldown = 0;
    this.timer = 0;
    this.systemInterval = setInterval(() => this.transferMoney(), 1000 / 16);
    this.drawInterval = setInterval(() => this.createGameDraw(), 1000 / 60);
  }

  createGameSetup() {
    createCanvas(640, 600);
    this.input.position(width * 1.75 / 5, height - 30);
    this.button1.position(this.input.x + this.input.width * 1.4, height - 30);
    this.button1.mousePressed(() => this.decodeAgents());
    this.button2.position(this.input.x - this.input.width / 1.38, height - 30);
    this.button2.mousePressed(() => navigator.clipboard.writeText(this.input.value()));
    this.button3.position(this.input.x + this.input.width * 0.565, height - 30);
    this.button3.mousePressed(() => this.readClipboardData());
    this.generateAgentPositions();
    this.encodeAgents();
  }

  readClipboardData() {
    navigator.clipboard.readText().then(
      clipboard => this.input.value(clipboard));
  }

  generateAgentPositions() {
    let agentPosArray = [];
    let leftBoundary = width * 5 / 100;
    let topBoundary = height * 5 / 100;
    let rowSize = (width - 2 * leftBoundary) / this.agentCount;
    let columnSize = (height - 2 * topBoundary) / this.agentCount;
    let yVarArr = [];
    for (let i = 0; i < this.agentCount; i++) {
      yVarArr.push(i);
    }
    for (let j = 0; j < this.agentCount; j++) {
      let yVar = yVarArr.splice(floor(random(0, yVarArr.length)), 1)[0];
      let xPos = leftBoundary + (rowSize * (2 * j + 1) / 2);
      let yPos = topBoundary + (columnSize * (2 * yVar + 1) / 2);
      agentPosArray.push(createVector(xPos, yPos));
    }
    while (this.agents.length < this.agentCount) {
      let tempAgent = new Agent();
      tempAgent.pos = agentPosArray.splice(floor(random(0, agentPosArray.length)), 1)[0];
      tempAgent.index = this.agents.length;
      this.agents.push(tempAgent);
    }
    this.propagate1();
  }

  propagate1() {
    let positionVectors = [];
    for (let a of this.agents) {
      positionVectors.push(a.pos);
    }
    let slopeArr = [];
    for (let k = 0; k < positionVectors.length - 1; k++) {
      for (let l = k + 1; l < positionVectors.length; l++) {
        slopeArr.push((positionVectors[k].y - positionVectors[l].y) /
          (positionVectors[k].x - positionVectors[l].x));
      }
    }
    if ((new Set(slopeArr)).size != slopeArr.length) {
      this.agents = [];
      this.generateAgentPositions();
    } else this.generateAgentConnections();
  }

  generateAgentConnections() {
    for (let a of this.agents) {
      a.connectedTo = [];
      a.isChecked = false;
    }
    let agentPairs = [];
    for (let i = 0; i < this.agents.length - 1; i++) {
      for (let j = i + 1; j < this.agents.length; j++) {
        agentPairs.push(createVector(i, j));
      }
    }
    let connectionCounter = 0;
    while (connectionCounter < this.connectionCount) {
      let selectedPair = agentPairs.splice(floor(random(0, agentPairs.length)), 1)[0];
      this.agents[selectedPair.x].connectedTo.push(this.agents[selectedPair.y]);
      this.agents[selectedPair.y].connectedTo.push(this.agents[selectedPair.x]);
      connectionCounter++;
    }
    this.propagate2();
  }

  propagate2() {
    let isError = false;
    for (let a of this.agents) {
      if (a.connectedTo.length == 0) {
        isError = true;
      }
    }
    if (isError) this.generateAgentConnections();
    else {
    let targetAgent = random(this.agents);
    targetAgent.isChecked = true;
    for (let i = 0; i < this.maxConnection * 2; i++) {
      for (let t of targetAgent.connectedTo) {
        t.isChecked = true;
      }
      targetAgent = random(targetAgent.connectedTo);
    }
    for (let ag of this.agents) {
      if (!ag.isChecked) {
        isError = true;
      }
    }
    if (isError) this.generateAgentConnections();
    else this.distributeMoney();
    }
  }

  distributeMoney() {
    let totalMoney;
    let positiveControl;
    while (totalMoney != this.money || positiveControl == this.agents.length) {
      totalMoney = 0;
      positiveControl = 0;
      for (let a of this.agents) {
        a.money = floor(randomGaussian(this.money, this.money / 1.5 + 2));
      }
      for (let ag of this.agents) {
        totalMoney += ag.money;
        if (ag.money >= 0) positiveControl++;
      }
    }
  }

  transferMoney() {
    if (this.cooldown > 0) this.cooldown -= 12;
    for (let a of this.agents) {
      a.isClicked = false;
    }
    let clickedAgent;
    if (mouseIsPressed && this.cooldown <= 0) {
      for (let ag of this.agents) {
        if (dist(ag.pos.x, ag.pos.y, mouseX, mouseY) <= ag.radius) {
          ag.money -= ag.connectedTo.length;
          for (let c of ag.connectedTo) {
            c.money++;
          }
          clickedAgent = ag;
          this.moveCount++;
          this.cooldown = 1000 / 16 + 0.5;
        }
      }
    }
    if (clickedAgent) clickedAgent.isClicked = true;
  }
  
  createGameDraw() {
    background(0);
    for (let a of this.agents) {
      a.drawLine();
    }
    for (let ag of this.agents) {
      ag.render();
    }
    for (let age of this.agents) {
      age.showMoney();
    }
    this.showInformation();
    this.checkWinCondition();
  }

  showInformation() {
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text(this.moveCount, width * 5 / 100, height * 95 / 100);
    if (this.cooldown > 0) {
      fill(255, 0, 0, 150);
    } else {
      fill(0, 255, 0, 150);
    }
    ellipse(width * 95 / 100, height * 95 / 100, this.agents[0].radius);
    this.timer += 1000 / 60;
    fill(255);
    textSize(32);
    text((this.timer / 1000).toFixed(2), width * 7.5 / 100, height * 5 / 100);
  }

  checkWinCondition() {
    let positiveTotal = 0;
    for (let a of this.agents) {
      if (a.money >= 0) positiveTotal++;
    }
    if (positiveTotal == this.agents.length) {
      clearInterval(this.drawInterval);
      clearInterval(this.systemInterval);
      noStroke();
      fill(0);
      rectMode(CENTER);
      rect(width / 2, height / 2, width, height);
      noStroke();
      fill(random(120, 255), random(120, 255), random(120, 255));
      textSize(40);
      text(`You win the game!`, width / 2, height * 1.5 / 4);
      text(`You finished in ${this.moveCount} moves!`, width / 2, height * 2 / 4);
      text(`You finished in ${(this.timer/1000).toFixed(2)} seconds!`, width / 2, height * 2.35 / 4);
      textSize(25);
      text(`The game will restart in 8 seconds!`, width / 2, height * 2.80 / 4);
      let restart = setTimeout(() => this.restartGame(), 1000 * 8);
    }
  }
  
  restartGame() {
    dG = new dollarGame(floor(random(3,6)));
  }

  encodeAgents() {
    let encodedAgents = "";
    encodedAgents += `${this.agents.length}:`;
    for (let a of this.agents) {
      encodedAgents += `${a.index}:`;
      encodedAgents += `${a.money}:`;
      encodedAgents += `${a.connectedTo.length}:`;
      for (let c of a.connectedTo) {
        encodedAgents += `${c.index}:`;
      }
    }
    encodedAgents = encodedAgents.substr(0, encodedAgents.length - 1);
    this.input.value(encodedAgents);
  }

  decodeAgents() {
    let encodedAgents = this.input.value()
    let agentArray = split(encodedAgents, ":");
    this.input.value("");
    for (let a of agentArray) {
      a = parseInt(a, 10);
    }
    this.agentCount = agentArray[0];
    this.agents = [];
    this.generateAgentPositions();
    clearInterval(this.drawInterval);
    clearInterval(this.systemInterval);
    for (let ag of this.agents) {
      ag.connectedTo = [];
    }
    let pointer = 1;
    for (let i = 0; i < this.agents.length; i++) {
      this.agents[i].index = agentArray[pointer];
      pointer++;
      this.agents[i].money = agentArray[pointer];
      pointer++;
      let connectionCount = agentArray[pointer]
      for (let j = 0; j < connectionCount; j++) {
        pointer++;
        this.agents[i].connectedTo.push(this.agents[agentArray[pointer]]);
      }
      pointer++;
    }
    this.moveCount = 0;
    this.cooldown = 0;
    this.timer = 0;
    this.systemInterval = setInterval(() => this.transferMoney(), 1000 / 16);
    this.drawInterval = setInterval(() => this.createGameDraw(), 1000 / 60);
    this.encodeAgents();
  }
}

class Agent {
  constructor() {
    this.radius = 35;
    this.pos = createVector();
    this.money = 0;
    this.color = color(random(150, 255), random(150, 255), random(150, 255), 150);
    this.connectedTo = [];
    this.isChecked = false;
    this.isClicked = false;
    this.index = 0;
  }

  render() {
    noStroke();
    fill(this.color);
    ellipseMode(CENTER);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }

  drawLine() {
    strokeWeight(2);
    if (this.isClicked) {
      stroke(255);
      strokeWeight(6);
    }
    for (let c of this.connectedTo) {
      stroke(c.color.levels[0], c.color.levels[1], c.color.levels[2]);
      line(this.pos.x, this.pos.y, c.pos.x, c.pos.y);
    }
  }

  showMoney() {
    noStroke();
    fill(0);
    textSize(this.radius / 1.2);
    textAlign(CENTER, CENTER);
    text(this.money, this.pos.x, this.pos.y);
  }
}
