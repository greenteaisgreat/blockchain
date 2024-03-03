const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

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
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
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

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    let minerReward = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward
    );

    block.mineBlock(this.difficulty);
    console.log("Block mined: ", block.hash);

    this.chain.push(block);
    this.pendingTransactions = [minerReward];
  }

  createTransaction(newTransaction) {
    this.pendingTransactions.push(newTransaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
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

myChain.createTransaction(new Transaction("myAddress", "yourAddress", 100));
myChain.createTransaction(new Transaction("yourAddress", "myAddress", 50));

console.log("Starting Miner...");
myChain.minePendingTransactions("minerAddress");

//Miner's balance is initially 0 after the first transaction, due to the miner's
//reward being place in the pendingTransactions array
console.log(
  `Miner's balance is ${myChain.getBalanceOfAddress("minerAddress")}`
);

console.log(`My balance is ${myChain.getBalanceOfAddress("myAddress")}`);

console.log(`Your balance is ${myChain.getBalanceOfAddress("yourAddress")}`);

//running this method again will deliver the miner's reward
myChain.minePendingTransactions("minerAddress");

console.log(
  `Miner's balance is ${myChain.getBalanceOfAddress("minerAddress")}`
);
