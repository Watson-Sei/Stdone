import { Contract, ContractReceipt, ContractTransaction } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { assert } from "console";
import { ethers } from "hardhat";

describe("Donate", function () {
  let token: Contract;
  let donate: Contract;
  // 主にownerはコントラクトデプロイなどで利用
  let owner: SignerWithAddress;
  // 実運用でも使うユーザー対象
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  let defaultAmount = "0x" + (10000 * 10 ** 18).toString(16);
  let sendAmount = "0x" + (1 * 10 ** 18).toString(16);

  // 事前各コントラクトデプロイ and 各ユーザーへの初期配当
  beforeEach(async (): Promise<void> => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    assert(token.deployed(), "contract was not deployed");
    const Donate = await ethers.getContractFactory("Donate");
    donate = await Donate.connect(owner).deploy(token.address);
    assert(donate.deployed(), "contract was not deployed");
  });

  it("Should send coin correctly", async (): Promise<void> => {
    await token.transfer(donate.address, defaultAmount);
    assert((await token.balanceOf(donate.address)).toString() > 0, "No balance Contract");
  })

  it("Open an account Check", async (): Promise<void> => {
    let tx: ContractTransaction = await donate.connect(addr1).Opening();
    await tx.wait();
    assert((await donate.connect(addr1).getVirtualAccountBalance()).toString() == 0, "Failed to open an account");
  })

  it("Transfer funds to your account", async (): Promise<void> => {
    // 石油王の財布を設定
    await token.transfer(addr2.address, defaultAmount);
    assert((await token.balanceOf(addr2.address)).toString() > 0, "No balance user");
    // クリエイター口座開設
    let tx: ContractTransaction = await donate.connect(addr1).Opening();
    await tx.wait();
    assert((await donate.connect(addr1).getVirtualAccountBalance()).toString() == 0, "Failed to open an account");
    // 石油王による寄付
    await token.connect(addr2).approve(donate.address, sendAmount);
    tx = await donate.connect(addr2).Transfers(addr1.address, sendAmount);
    await tx.wait();
    assert((await token.balanceOf(donate.address)).toString() > 0, "Failed to donate.");
  })

  it("Withdrawal moeny", async (): Promise<void> => {
    // 石油王の財布を設定
    await token.transfer(addr2.address, defaultAmount);
    assert((await token.balanceOf(addr2.address)).toString() > 0, "No balance user");
    // クリエイター口座開設
    let tx: ContractTransaction = await donate.connect(addr1).Opening();
    await tx.wait();
    assert((await donate.connect(addr1).getVirtualAccountBalance()).toString() == 0, "Failed to open an account");
    // 石油王による寄付
    await token.connect(addr2).approve(donate.address, sendAmount);
    tx = await donate.connect(addr2).Transfers(addr1.address, sendAmount);
    await tx.wait();
    assert((await token.balanceOf(donate.address)).toString() > 0, "Failed to donate.");
    // 寄付額を引き出す
    await sleep(1 * 1000);
    tx = await donate.connect(addr1).Withdrawal();
    await tx.wait(1);
    assert(Number((await token.balanceOf(donate.address)).toString()) === 170000000000000000, "The balance of the contract did not match.");
    assert(Number((await token.balanceOf(addr1.address)).toString()) === 830000000000000000, "The balance of the account did not match.");
    console.log((await donate.connect(addr1).getVirtualAccountBalance()).toString())
  });
});

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}