function createGame(agCo) {
  createCanvas(600, 600);
  const minConnection = agCo - 1;
  let maxConnection = 0;
  for (let i = 1; i < agCo; i++) {
    maxConnection += agCo - i;
  }
  let coCo = floor(random(minConnection, minConnection + 2));
  const minMoney = coCo - agCo + 1;
  const mone = minMoney;
  let agents = [];
  console.log(`Creating game setup..`)
  agents = createGameSetup(agCo, coCo, mone, agents, maxConnection);
  let draw = setInterval(() => createGameDraw(agents), 1000 / 16);
  console.log(`Game is ready to play..`)
}

function createGameSetup(agCo, coCo, mone, agen, maxConnection) {
  let agents = agen;
  console.log(`Generating agents..`);
  agents = generateAgents(agCo, agents);
  console.log(`Generating agent connections..`)
  agents = generateAgentConnections(coCo, agents);
  console.log(`Verifying agent cluster..`)
  agents = propagate(maxConnection, coCo, agents);
  console.log(`Distributing money to agents..`)
  agents = distributeMoney(mone, agents);
  return agents;
}

function generateAgents(agCo, agen) {
  let agents = agen;
  while (agents.length < agCo) {
    let badAgent = false;
    let tempAgent = new Agent();
    for (let a of agents) {
      if (dist(tempAgent.pos.x, tempAgent.pos.y, a.pos.x, a.pos.y) - tempAgent.radius - a.radius - 60 < 0) {
        badAgent = true;
        break;
      }
    }
    if (!badAgent) agents.push(tempAgent);
  }
  return agents;
}

function generateAgentConnections(coCo, agen) {
  let agents = agen;
  let agentPairs = [];
  for (let i = 0; i < agents.length - 1; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      agentPairs.push(createVector(i, j));
    }
  }

  const agentPairsLength = agentPairs.length;
  let selectedPair;
  let selectedPairArr = [];
  let connectionCounter = 0;

  while (connectionCounter < coCo) {
    selectedPair = agentPairs.splice(floor(random(0, agentPairs.length)), 1)[0];
    selectedPairArr.push(selectedPair);
    agents[selectedPair.x].connectedTo.push(agents[selectedPair.y]);
    agents[selectedPair.y].connectedTo.push(agents[selectedPair.x]);
    if (selectedPairArr.length >= coCo) {
      for (let a of agents) {
        if (a.connectedTo.length == 0) {
          let randAgent = random(agents);
          while (randAgent == a) {
            randAgent = random(agents);
          }
          let randomConnected = random(randAgent.connectedTo);
          for (let i = 0; i < randAgent.connectedTo.length; i++) {
            if (randAgent.connectedTo[i] == randomConnected) randAgent.connectedTo.splice(i, 1);
          }
          for (let j = 0; j < randomConnected.connectedTo.length; j++) {
            if (randomConnected.connectedTo[j] == randAgent) randomConnected.connectedTo.splice(j, 1);
          }
          connectionCounter = coCo - 2;
          break;
        }
      }
    }
    connectionCounter++;
  }
  return agents;
}

function propagate(maxCo, coCo, agen) {
  let agents = agen;
  let targetAgent = random(agents);
  targetAgent.isChecked = true;
  for (let i = 0; i < maxCo * 2; i++) {
    for (let t of targetAgent.connectedTo) {
      t.isChecked = true;
    }
    targetAgent = random(targetAgent.connectedTo);
  }
  for (let a of agents) {
    if (!a.isChecked) {
      agents = generateAgentConnections(coCo, agents);
      break;
    }
  }
  return agents;
}

function distributeMoney(mone, agen) {
  let agents = agen;
  let money = mone;
  let totalMoney;
  let positiveControl;
  while (totalMoney != money || positiveControl == agents.length) {
    totalMoney = 0;
    positiveControl = 0;
    for (let a of agents) {
      a.money = floor(randomGaussian(money, money / 1.5 + 1));
    }
    for (let ag of agents) {
      totalMoney += ag.money;
      if (ag.money >= 0) positiveControl++;
    }
    console.log(`Distributing..`);
  }
  return agents;
}

function createGameDraw(agen) {
  let agents = agen;
  background(0);
  for (let a of agents) {
    a.render();
  }
  for (let ag of agents) {
    ag.drawLine();
  }
  for (let age of agents) {
    age.showMoney();
  }
  agents = transferMoney(agents);
  showMoveCount(agents);
  checkWinCondition(agents);
}

function transferMoney(agen) {
  let agents = agen;
  for (let a of agents) {
    a.isClicked = false;
  }
  let clickedAgent;
  if (mouseIsPressed) {
    for (let ag of agents) {
      if (dist(ag.pos.x, ag.pos.y, mouseX, mouseY) <= ag.radius) {
        ag.money -= ag.connectedTo.length;
        for (let c of ag.connectedTo) {
          c.money++;
        }
        clickedAgent = ag;
        agents[0].clickCount++;
      }
    }
  }
  if (clickedAgent) clickedAgent.isClicked = true;
  return agents;
}

function showMoveCount(agen) {
  let richestAgent = random(agen);
  for (let a of agen) {
    if (a.money > richestAgent.money) {
      richestAgent = a;
    }
  }
  stroke(120);
  strokeWeight(3);
  fill(richestAgent.color);
  textSize(64);
  text(agen[0].clickCount, 50, height - 60);
}

function checkWinCondition(agen) {
  let agents = agen;
  let positiveTotal = 0;
  for (let a of agents) {
    if (a.money >= 0) positiveTotal++;
  }
  if (positiveTotal == agents.length) {
    fill(0);
    rectMode(CENTER);
    rect(width / 2, height / 2, width, height);
    stroke(100);
    strokeWeight(1);
    fill(random(0, 255));
    textSize(40);
    text(`You win the game!`, width / 2, height * 1 / 4);
    text(`You finished in ${agents[0].clickCount} moves!`, width / 2, height * 2 / 4);
    text(`The game will start over in 8 seconds!`, width / 2, height * 3 / 4, width * 3 / 4, height);
    let endGame = setTimeout(() => location.reload(1), 8000);
  }
}

class Agent {
  constructor() {
    this.radius = random(30, 60);
    this.pos = createVector(floor(random(this.radius, width - this.radius)), floor(random(this.radius, height - this.radius)));
    this.money = 0;
    this.color = color(255, 255, 255);
    this.rbgOptions = [1, 2, 3];
    this.rgbChoice = random(this.rbgOptions);
    this.connectedTo = [];
    this.isChecked = false;
    this.isClicked = false;
    this.clickCount = 0;
  }

  render() {
    switch (this.rgbChoice) {
      case 1:
        this.color = color(100, map(this.money, -77, 77, 100, 255), 100);
        break;
      case 2:
        this.color = color(map(this.money, -77, 77, 100, 255), 100, 100);
        break;
      case 3:
        this.color = color(100, 100, map(this.money, -77, 77, 100, 255));
        break;
      default:
        this.color = color(255, 255, 255);
        break;
    }
    stroke(255);
    strokeWeight(1);
    fill(this.color);
    ellipseMode(CENTER);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }

  drawLine() {
    stroke(255, 255, 255, 100);
    strokeWeight(2);
    if (this.isClicked) {
      stroke(255, 255, 255);
      strokeWeight(3);
    }
    for (let c of this.connectedTo) {
      line(this.pos.x, this.pos.y, c.pos.x, c.pos.y);
    }
  }

  showMoney() {
    noStroke();
    fill(0);
    textSize(this.radius / 1.5);
    textAlign(CENTER, CENTER);
    text(this.money, this.pos.x, this.pos.y);
  }
}