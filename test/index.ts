import { Contract, ContractReceipt, ContractTransaction } from "@ethersproject/contracts";
import { expect } from "chai";
import { assert } from "console";
import { ethers } from "hardhat";

describe("Donate", function () {
  let token: Contract;
  let donate: Contract;
  let AccountId: string | undefined;
  let sendAmount = "0x" + (1000 * 10 ** 18).toString(16);
  let defaultAmount = "0x" + (10000 * 10 ** 18).toString(16);

  // Token and Donateコントラクトデプロイテスト
  beforeEach(async (): Promise<void> => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    assert(token.deployed(), "contract was not deployed");
    const Donate = await ethers.getContractFactory("Donate");
    donate = await Donate.deploy(token.address);
    assert(donate.deployed(), "contract was not deployed");
  });

  // Donateコントラクトに送金テスト
  it("Should send coin correctly", async (): Promise<void> => {
    await token.transfer(donate.address, defaultAmount);
    const balance = (await token.balanceOf(donate.address)).toString();
    assert(balance > 0, "No balance on contract")
  });

  // Donateコントラクトに送金テスト
  it("Should send coin correctly", async (): Promise<void> => {
    await token.transfer(donate.address, defaultAmount);
    const balance = (await token.balanceOf(donate.address)).toString();
    assert(balance > 0, "No balance on contract")
  });

  // 口座開設テスト
  it("Open an account Check", async (): Promise<void> => {
    const [owner] = await ethers.getSigners();
    let tx: ContractTransaction = await donate.connect(owner).Opening();
    let receipt: ContractReceipt = await tx.wait();
    AccountId = receipt.events?.filter((x) => {return x.event == "AccountId"})[0].data;
    assert((await donate.getVirtualAccounts()).length > 0, "Failed to open an account")
  });

  // 特定の口座に送金テスト
  it("Transfer money to a specific account", async (): Promise<void> => {
    const [owner, guest1] = await ethers.getSigners();
    await token.transfer(owner.address, defaultAmount);
    assert((await token.balanceOf(owner.address)).toString() > 0, "Poverty");
    let tx: ContractTransaction = await donate.connect(guest1).Opening();
    let receipt: ContractReceipt = await tx.wait()
    AccountId = receipt.events?.filter((x) => {return x.event == "AccountId"})[0].data;
    let beforeContractBalance = (await token.balanceOf(donate.address)).toString();
    let beforeAccountBalnace = (await donate.connect(guest1).getVirtualAccountBalance()).toString();
    let tx1: ContractTransaction = await donate.connect(guest1).Transfer(AccountId, {value: sendAmount});
    await tx1.wait();
    let afterContractBalance = (await token.balanceOf(donate.address)).toString();
    let afterAccountBalnace = (await donate.connect(guest1).getVirtualAccountBalance()).toString();
    console.log(afterContractBalance, beforeContractBalance);
    console.log(afterAccountBalnace, beforeAccountBalnace);
  });
});