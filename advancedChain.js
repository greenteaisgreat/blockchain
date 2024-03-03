const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(timestamp, transactions, prevHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.timestamp +
        this.prevHash +
        this.nonce +
        JSON.stringify(this.transactions)
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join(0)
    ) {
      this.hash = this.calculateHash();
      this.nonce++;
    }
    console.log("Block mined: ", this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesis()];
    this.difficulty = 4;
  }

  createGenesis() {
    return new Block(new Date().toLocaleDateString(), "Genesis Block", "0");
  }

  checkLastBlock() {
    return this.chain.at(-1);
  }

  addBlock(newBlock) {
    newBlock.prevHash = this.checkLastBlock().hash;
    newBlock.mineBlock(this.difficulty);

    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
      if (currentBlock.prevHash !== prevBlock.hash) return false;
    }
    return true;
  }
}

const myChain = new Blockchain();
