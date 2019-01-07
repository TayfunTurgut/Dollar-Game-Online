class dG {
	constructor(agentCount) {
		this.agentCount = agentCount;
		this.minConnection = this.agentCount - 1;
		this.maxConnection = 0;
		for(let i = 1; i < this.agentCount; i++) {
			this.maxConnection += this.agentCount - i;
		}
		this.connectionCount = floor(random(this.minConnection, this.minConnection + 2));
		this.minMoney = this.connectionCount - this.agentCount + 1;
		this.money = this.minMoney;
		this.agents = [];
		this.createGameSetup();
		this.createGameDraw();
		this.clickCount = 0;
	}	
	
	createGameSetup() {
		createCanvas(600, 600);
		this.generateAgents();
		this.generateAgentConnections();
		this.propagate();
		this.distributeMoney();
	}
	
	generateAgents() {
		while(this.agents.length <  this.agentCount) {
			let badAgent = false;
			let tempAgent = new Agent();
			for(let a of this.agents) {
				if(dist(tempAgent.pos.x, tempAgent.pos.y, a.pos.x, a.pos.y) - tempAgent.radius - a.radius - 60 < 0) {
					badAgent = true;
					break;
				}
			}
			if(!badAgent) this.agents.push(tempAgent);
		}
	}
	
	generateAgentConnections() {
		let agentPairs = [];
		for(let i = 0; i < this.agents.length - 1; i++) {
			for(let j = 0; j < this.agents.length; j++) {
				agentPairs.push(createVector(i,j));
			}
		}
		const agentPairsLength = agentPairs.length;
		let selectedPair;
		let selectedPairArr = [];
		let connectionCounter = 0;
		while(connectionCounter < this.connectionCount) {
			selectedPair = agentPairs.splice(floor(random(0, agentPairs.length)), 1)[0];
			selectedPairArr.push(selectedPair);
			this.agents[selectedPair.x].connectedTo.push(this.agents[selectedPair.y]);
			this.agents[selectedPair.y].connectedTo.push(this.agents[selectedPair.x]);
			if(selectedPairArr.length >= this.connectionCount) {
				for(let  a of this.agents) {
					if(a.connectedTo.length == 0) {
						let randAgent = random(this.agents);
						while(randAgent ==a) {
							randAgent = random(this.agents);
						}
						let randomConnected = random(randAgent.connectedTo);
						for(let i = 0; i < randAgent.connectedTo.length; i++) {
							if(randAgent.connectedTo[i] == randomConnected) randAgent.connectedTo.splice(i, 1);
						}
						for(let j = 0; j < randomConnected.connectedTo.length, j++) {
							if(randomConnected.connectedTo[j] == randAgent) randomConnected.connectedTo.splice(j, 1);
						}
						connectionCounter = this.connectionCount - 2;
						break;
					}
				}
			}
			connectionCounter++;
		}
	}
	
	propagate() {
		let targetAgent = random(agents);
		targetAgent.isChecked = true;
		for(let i = 0; i < this.maxConnection * 2; i++) {
			for(let t of targetAgent.connectedTo) {
				t.isChecked = true;
			}
			targetAgent = random(targetAgent.connectedTo);
		}
		for(let a of this.agents) {
			iF(!a.isChecked) {
				this.generateAgentConnections();
				break;
			}
		}
	}
	
	distributeMoney() {
		let totalMoney;
		let positiveControl;
		while(totalMoney != this.money || positiveControl == this.agents.length) {
			totalMoney = 0;
			positiveControl = 0;
			for(let a of this.agents) {
				a.money = floor(randomGaussian(this.money, this.money / 1.5 + 1));
			}
			for(let ag of agents) {
				totalMoney += ag.money;
				iF(ag.money >= 0) positiveControl++;
			}
		}
	}
	
	createGameDraw() {
		background(0);
		for(let a of this.agents) {
			a.render();
		}
		for(let ag of this.agents) {
			ag.drawLine();
		}
		for(let age of this.agents) {
			age.showMoney();
		}
		this.transferMoney();
		this.showMoveCount();
		this.checkWinCondition();
	}
	
	transferMoney() {
		for(let a of this.agents) {
			a.isClicked = false;
		}
		let clickedAgent;
		if(mouseIsPressed) {
			for(let ag of this.agents) {
				if(dist(ag.pos.x, ag.pos.y, mouseX, mouseY) <= ag.radius) {
					ag.money -= ag.connectedTo.length;
					for(let c of ag.connectedTo) {
						c.money++;
					}
					clickedAgent = ag;
					this.clickCount++;
				}
			}
		}
		if(clickedAgent) clickedAgent.isClicked = true;
	}
	
	showMoveCount() {
		let richestAgent = random(this.agents);
		for(let a of this.agents) {
			if(a.money > richestAgent.money) {
				richestAgent = a;
			}
		}
		stroke(120);
		strokeWeight(3);
		fill(richestAgent.color);
		textSize(64);
		text(this.clickCount, 50, height - 60);
	}
	
	checkWinCondition() {
		let positiveTotal = 0;
		for(let a of this.agents) {
			if(a.money >= 0) positiveTotal++;
		}
		if(positiveTotal == this.agents.length) {
			fill(0);
			rectMode(CENTER);
			rect(width/2, height/2, width, height);
			stroke(100);
			strokeWeight(1);
			fill(random(0, 255));
			textSize(40);
			text(`You win the game!`, width / 2, height * 1 / 4);
			text(`You finished in ${this.clickCount} moves!`, width / 2, height * 2 / 4);
		}
	}
}

class Agent {
	constructor() {
		this.radius = 50;
		this.pos = createVector(floor(random(this.radius, width - this.radius)), floor(random(this.radius, height - this.radius)));
		this.money = 0;
		this.color = color(255, 255, 255);
		this.rgbOptions = [1, 2, 3];
		this.rgbChoice = random(this.rgbOptions);
		this.connectedTo = [];
		this.isChecked = false;
		this.isClicked = false;
	}
	
	render() {
		switch(this.rgbChoice) {
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
		if(this.isClicked) {
			stroke(255, 255, 255);
			strokeWeight(4);
		}
		for(let c of this.connectedTo) {
			line(this.pos.x, this.pos.y, c.pos.x, c.pos.y);
		}
	}
	
	showMoney() {
		noStroke();
		fill(0);
		textSize(this.radius / 1.5);
		textAlign(CENTER, CENTER);
		text(this.money, this.pos.y, this.pos.y);
	}
}
