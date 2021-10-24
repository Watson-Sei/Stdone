import { Contract, ContractReceipt, ContractTransaction } from "@ethersproject/contracts";
import { expect } from "chai";
import { assert } from "console";
import { ethers } from "hardhat";

describe("Donate", function () {
  let token: Contract;
  let donate: Contract;
  let AccountId: number;

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
    await token.transfer(donate.address, "0x" + (10000 * 10 ** 18).toString(16));
    const balance = (await token.balanceOf(donate.address)).toString();
    assert(balance >= 0, "No balance on contract")
  });

  // 口座開設テスト
  it("Open an account Check", async (): Promise<void> => {
    const [owner] = await ethers.getSigners();
    let tx: ContractTransaction = await donate.connect(owner).Opening();
    let receipt: ContractReceipt = await tx.wait();
    AccountId = Number(receipt.events?.filter((x) => {return x.event == "AccountId"})[0].data);
    assert((await donate.getVirtualAccounts()).length > 0, "Failed to open an account")
  });

  // 特定の口座に送金テスト
  it("Donation Test", async (): Promise<void> => {
  })
});
