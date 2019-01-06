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
    this.agents = this.createGameSetup(this.agentCount, this.minConnection,
      this.minMoney, this.agents, this.maxConnection)
  }

  createGameSetup() {

  }
}