class dollarGame {
  constructor(agentCount) {
    this.agentCount = agentCount;
    this.minConnection = this.agentCount - 1;
    this.maxConnection = 0;
    for (let i = 1; i < this.agentCount; i++) {
      this.maxConnection += this.agentCount - i;
    }
    if (this.maxConnection < this.minConnection + 2) {
      this.connectionCount = floor(random(this.minConnection, this.maxConnection));
    } else {
      this.connectionCount = floor(random(this.minConnection, this.minConnection + 2));
    }
    this.minMoney = this.connectionCount - this.agentCount + 1;
    this.money = this.minMoney;
    this.agents = [];
    this.agentPosArray = [];
    this.createGameSetup();
    this.clickCount = 0;
    this.systemInterval = setInterval(() => this.createGameSystemDraw(), 1000 / 16);
    this.drawInterval = setInterval(() => this.createGameDraw(), 1000 / 60);
  }

  createGameSetup() {
    createCanvas(800, 600);
    this.generateAgents();
  }

  generateAgents() {
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
      this.agentPosArray.push(createVector(xPos, yPos));

    }
    while (this.agents.length < this.agentCount) {
      let tempAgent = new Agent();
      tempAgent.pos = this.agentPosArray.splice(floor(random(0, this.agentPosArray.length)), 1)[0];
      this.agents.push(tempAgent);
    }
    this.generateAgentConnections();
  }

  generateAgentConnections() {
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
    this.propagate();
  }

  propagate() {
    for (let a of this.agents) {
      if (a.connectedTo.length == 0) {
        for (let ag of this.agents) {
          ag.connectedTo = [];
        }
        this.generateAgentConnections();
      }
    }
    let targetAgent = random(this.agents);
    targetAgent.isChecked = true;
    for (let i = 0; i < this.maxConnection * 2; i++) {
      for (let t of targetAgent.connectedTo) {
        t.isChecked = true;
      }
      targetAgent = random(targetAgent.connectedTo);
    }
    for (let age of this.agents) {
      if (!age.isChecked) {
        for (let agen of this.agents) {
          agen.connectedTo = [];
        }
        this.generateAgentConnections();
        break;
      }
    }
    this.distributeMoney();
  }

  distributeMoney() {
    let totalMoney;
    let positiveControl;
    while (totalMoney != this.money || positiveControl == this.agents.length) {
      totalMoney = 0;
      positiveControl = 0;
      for (let a of this.agents) {
        a.money = floor(randomGaussian(this.money, this.money / 1.5 + 1));
      }
      for (let ag of this.agents) {
        totalMoney += ag.money;
        if (ag.money >= 0) positiveControl++;
      }
    }
  }

  createGameSystemDraw() {
    this.transferMoney();
  }

  transferMoney() {
    for (let a of this.agents) {
      a.isClicked = false;
    }
    let clickedAgent;
    if (mouseIsPressed) {
      for (let ag of this.agents) {
        if (dist(ag.pos.x, ag.pos.y, mouseX, mouseY) <= ag.radius) {
          ag.money -= ag.connectedTo.length;
          for (let c of ag.connectedTo) {
            c.money++;
          }
          clickedAgent = ag;
          this.clickCount++;
        }
      }
    }
    if (clickedAgent) clickedAgent.isClicked = true;
  }

  showMoveCount() {
    let richestAgent = random(this.agents);
    for (let a of this.agents) {
      if (a.money > richestAgent.money) {
        richestAgent = a;
      }
    }
    stroke(120);
    strokeWeight(3);
    fill(richestAgent.color);
    textSize(64);
    text(this.clickCount, 55, height - 50);
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
      fill(random(100, 255), random(100, 255), random(100, 255));
      textSize(40);
      text(`You win the game!`, width / 2, height * 1 / 4);
      text(`You finished in ${this.clickCount} moves!`, width / 2, height * 2 / 4);
    }
  }

  createGameDraw() {
    background(0);
    for (let ag of this.agents) {
      ag.drawLine();
    }
    for (let a of this.agents) {
      a.render();
    }
    for (let age of this.agents) {
      age.showMoney();
    }
    this.showMoveCount();
    this.checkWinCondition();
  }
}

class Agent {
  constructor() {
    this.radius = 30;
    this.pos = createVector();
    this.money = 0;
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
    this.connectedTo = [];
    this.isChecked = false;
    this.isClicked = false;
  }

  render() {
    noStroke(150, 150, 150, 150);
    strokeWeight(1);
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