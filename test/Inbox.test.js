const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { interface, bytecode } = require("../compile");

const web3 = new Web3(ganache.provider());

const INITAL_STRING = "Hello, World!";
let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one those accounts to deploy
  // the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [INITAL_STRING],
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert(message, INITAL_STRING);
  });

  it("can modify the message", async () => {
    await inbox.methods.setMessage("Hi There!").send({
      from: accounts[0],
      gas: 1000000,
    });

    const message = await inbox.methods.message().call();
    assert(message, "Hi There!");
  });
});
