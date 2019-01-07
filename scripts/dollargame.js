class dG {
  constructor(agentCount) {
	  this.agentCount = agentCount;
    this.minConnection = this.agentCount - 1;
    this.maxConnection = 0;
    for (let i = 1; i < this.agentCount; i++) {
      this.maxConnection += this.agentCount - i;
    }
    this.minMoney = this.minConnection - this.agentCount + 1;
    this.agents = [];
    this.createGameSetup();
  } 

  createGameSetup() {
		this.generateAgents();
		this.generateAgentConnections();
		this.propagate();
		this.distributeMoney();
  }
	
	generateAgents() {
		while (this.agents.length < agCo) {
    	let badAgent = false;
    	let tempAgent = new Agent();
    	for (let a of this.agents) {
      	if (dist(tempAgent.pos.x, tempAgent.pos.y, a.pos.x, a.pos.y) - tempAgent.radius - a.radius - 60 < 0) {
        	badAgent = true;
        	break;
      	}
    	}
    	if (!badAgent) this.agents.push(tempAgent);
  	}
	}
	
	generateAgentConnections() {
	let agentPairs = [];
  for (let i = 0; i < this.agents.length - 1; i++) {
    for (let j = i + 1; j < this.agents.length; j++) {
      agentPairs.push(createVector(i, j));
    }
  }

  const agentPairsLength = agentPairs.length;
  let selectedPair;
  let selectedPairArr = [];
  let connectionCounter = 0;

  while (connectionCounter < ) {
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
	}
}
