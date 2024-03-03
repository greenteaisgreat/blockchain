const SHA256 = require("crypto-js/sha256");

class Block {
  //index: optional; tells us where the block sits on the chain
  //timestamp: tells us when the block was created
  //data: any kind of data you want associated with the block (amount of $, sender, receiver, etc)
  //prevHash: a string pointing to the previous block's hash, not the current;
  //the hash is what ensures the integrity of the entire chain
  //nonce: a completely random value to help in mining blocks
  constructor(index, timestamp, data, prevHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    //crypto-js implementation of SHA256 cryptographic hash
    return SHA256(
      this.index +
        this.prevHash +
        this.timestamp +
        this.nonce +
        JSON.stringify(this.data)
    ).toString();
  }

  //this method works off the principle of 'proof of work', where a lot of computing power is
  //required to 'mine' a block, based on finding the correct # of 0's prepending a block's hash
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
  //the first block on a blockchain is called the 'genesis block' and it
  //needs to be added manually
  constructor() {
    this.chain = [this.createGenesis()];
    this.difficulty = 2;
  }

  createGenesis() {
    //since genesis blocks don't have a previous block, the prevHash will be '0'
    return new Block(0, new Date().toLocaleDateString(), "Genesis Block", "0");
  }

  getLatestBlock() {
    //simply returns the last block element
    return this.chain.at(-1);
  }

  addBlock(newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    //index starts at 1 due to not counting the genesis block
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

console.log("Mining block 1...");
myChain.addBlock(new Block(1, new Date().toLocaleDateString(), { amount: 4 }));
console.log("Mining block 2...");
myChain.addBlock(new Block(2, new Date().toLocaleDateString(), { amount: 7 }));
console.log("Mining block 3...");
myChain.addBlock(new Block(3, new Date().toLocaleDateString(), { amount: 2 }));

//show the nicely formatted blockchain
// console.log(JSON.stringify(myChain, null, myChain.chain.length));

// console.log(myChain.isChainValid());

//attempt to alter the existing blockchain & fail
// myChain.chain[1].data = { amount: 100 };
// myChain.chain[1].hash = myChain.chain[1].calculateHash();
// console.log(myChain.chain[1].hash);
// myChain.chain[2].prevHash = myChain.chain[1].hash;
// console.log(myChain.isChainValid());
// myChain.chain[2].prevHash;
