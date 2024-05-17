const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");

const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CrowdfundingFactory.json").CrowdfundingFactory;
const compiledCrowdfunding = require("../ethereum/build/Crowdfunding.json").Crowdfunding;
    
const GAS_AMOUNT = "10000000";

let accounts;
let factory;
let crowdfundingAddress;
let crowdfunding;
let caller;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  caller = accounts[0];
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: caller, gas: GAS_AMOUNT });

  await factory.methods.createCrowdfunding("100").send({
    from: caller,
    gas: GAS_AMOUNT
  });

  [crowdfundingAddress] = await factory.methods.getCrowdfundings().call();
  crowdfunding = new web3.eth.Contract(
    compiledCrowdfunding.abi,
    crowdfundingAddress
  );
});

describe("Crowdfunding", () => {
  it("should create a crowdfunding factory and a crowdfunding object.", async () => {
    assert.ok(factory.options.address);
    assert.ok(crowdfunding.options.address);
  });

  it("should mark the caller as the crowdfunding manager.", async () => {
    const manager = await crowdfunding.methods.manager().call();
    assert.equal(manager, caller);
  });

  it("should allow people to contribute money and marks them as approvers.", async () => {
    await crowdfunding.methods.contribute().send({
      value: "200",
      from: accounts[1]
    });
    const isApprover = await crowdfunding.methods.approvers(accounts[1]).call();
    assert(isApprover);
  });

  it("should not be able to do a contribution less than minimum.", async () => {
    try {
      await crowdfunding.methods.contribute().send({
        value: "100",
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it.only("should be able the manager to make a payment request.", async () => {
    const requestDescription = "Buy batteries";
    const requestValue = 200;
    
    const tx = await crowdfunding.methods.createRequest(requestDescription, requestValue, accounts[1]).send({
      from: caller,
      value: GAS_AMOUNT,
      gas: GAS_AMOUNT  // Example: Increase if needed
    });   
    
    const createdRequest = await crowdfunding.methods.test(1).call({ from: caller });
        
    // assert.equal(createdRequest.description, requestDescription);
    // assert.equal(createdRequest.value, requestValue);
  })
});