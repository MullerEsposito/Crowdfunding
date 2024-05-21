import assert from "assert";
import ganache from "ganache";
import { Web3 } from "web3";

import CrowdfundingFactory from "../ethereum/build/CrowdfundingFactory.json" assert { type: "json" };
import Crowdfunding from "../ethereum/build/Crowdfunding.json" assert { type: "json" };

const GAS_AMOUNT = "10000000";

let accounts;
let factoryContract;
let crowdfundingAddress;
let crowdfundingContract;
let managerAccount;
let requestAccount;
let approverAccount;

const providerOptions = { logging: { quiet: true } };
const web3 = new Web3(ganache.provider(providerOptions));    
const compiledFactory = CrowdfundingFactory.CrowdfundingFactory;
const compiledCrowdfunding = Crowdfunding.Crowdfunding;

const requestDescription = "Buy batteries";
const requestValue = parseFloat(web3.utils.toWei("5", "ether"));

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  managerAccount = accounts[0];
  approverAccount = accounts[1];
  requestAccount = accounts[2];

  factoryContract = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: managerAccount, gas: GAS_AMOUNT });

  await factoryContract.methods.createCrowdfunding("100").send({
    from: managerAccount,
    gas: GAS_AMOUNT
  });

  [crowdfundingAddress] = await factoryContract.methods.getCrowdfundings().call();
  crowdfundingContract = new web3.eth.Contract(
    compiledCrowdfunding.abi,
    crowdfundingAddress
  );
});

describe("Crowdfunding", () => {
  it("should create a crowdfunding factory and a crowdfunding object.", async () => {
    assert.ok(factoryContract.options.address);
    assert.ok(crowdfundingContract.options.address);
  });

  it("should mark the caller as the crowdfunding manager.", async () => {
    const manager = await crowdfundingContract.methods.manager().call();
    assert.equal(manager, managerAccount);
  });

  it("should allow people to contribute money and marks them as approvers.", async () => {
    await crowdfundingContract.methods.contribute().send({
      value: "200",
      from: approverAccount
    });
    const isApprover = await crowdfundingContract.methods.approvers(approverAccount).call();
    assert(isApprover);
  });

  it("should not to be able to do a contribution less than minimum.", async () => {
    try {
      await crowdfundingContract.methods.contribute().send({
        value: "100",
        from: approverAccount
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("should be able to the manager to make a payment request.", async () => {    
    await crowdfundingContract.methods.createRequest(requestDescription, requestValue, requestAccount).send({
      from: managerAccount,
      value: GAS_AMOUNT,
      gas: GAS_AMOUNT
    });   
    
    const createdRequest = await crowdfundingContract.methods.requests(0).call({ from: managerAccount });
        
    assert.equal(createdRequest.description, requestDescription);
    assert.equal(createdRequest.value, requestValue);
  });

  it("should not to be able a no approver to approve a request.", async () => {
    await crowdfundingContract.methods.createRequest(requestDescription, requestValue, requestAccount).send({
      from: managerAccount,
      gas: GAS_AMOUNT
    });

    try {
      await crowdfundingContract.methods.approveRequest(0).send({
        from: requestAccount,
        gas: GAS_AMOUNT
      });
      assert(false);
    } catch(e) {
      assert(true);
    }
  });

  it("should be able to an approver to approve a request.", async () => {
    await crowdfundingContract.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      from: approverAccount
    });
    
    await crowdfundingContract.methods.createRequest(requestDescription, requestValue, requestAccount).send({
      from: managerAccount,
      gas: GAS_AMOUNT
    });   
    
    await crowdfundingContract.methods.approveRequest(0).send({
      from: approverAccount,
      gas: GAS_AMOUNT
    });

    assert(await crowdfundingContract.methods.getRequestVoters(0, approverAccount).call());    
  });

  it("should process the entire cycle of the request.", async () => {
    const initialSupplierBalanceInEther = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(requestAccount), "ether"));    

    await crowdfundingContract.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      from: approverAccount
    });
    
    await crowdfundingContract.methods.createRequest(requestDescription, requestValue, requestAccount).send({
      from: managerAccount,
      gas: GAS_AMOUNT
    });   
    
    await crowdfundingContract.methods.approveRequest(0).send({
      from: approverAccount,
      gas: GAS_AMOUNT
    });

    await crowdfundingContract.methods.finalizeRequest(0).send({
      from: managerAccount,
      gas: GAS_AMOUNT
    });

    const requestValueInEther = parseFloat(web3.utils.fromWei(requestValue, "ether"));
    const finalSupplierBalanceInEther = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(requestAccount), "ether"));
    
    assert.equal(finalSupplierBalanceInEther, initialSupplierBalanceInEther + requestValueInEther);
  });
});