/* eslint-disable node/no-missing-import */
import { Contract, ContractReceipt, ContractTransaction } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { assert } from "console";
import { ethers } from "hardhat";

// ABI & BYTECODE
import {
  abi as ERC20_ABI,
  bytecode as ERC20_BYTECODE
} from "../artifacts/contracts/ERC20.sol/WERC20.json";
import {
  abi as FACTORY_ABI,
  bytecode as FACTORY_BYTECODE
} from "@uniswap/v2-core/build/UniswapV2Factory.json";
import {
  abi as ROUTER02_ABI,
  bytecode as ROUTER02_BYTECODE
} from "@uniswap/v2-periphery/build/UniswapV2Router02.json";
import {
  abi as DONATE_ABI,
  bytecode as DONATE_BYTECODE
} from "../artifacts/contracts/Donate.sol/Donate.json";
import { expandTo18Decimals } from "./shared/utilities";

describe("Donate", () => {
  
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;

  let WETH: Contract;
  let USDC: Contract;
  let JPYC: Contract;

  let factoryV2: Contract;
  let router02: Contract;
  let donate: Contract;

  beforeEach(async () => {
    // setting user
    // owner: Uniswap Address
    // addr1: Donate Developer Address
    // addr2: Creator
    // addr3: Donate User
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // deploy tokens 
    // WETH - standard
    // USDC - other
    // JPYC - other
    const WETH09 = await ethers.getContractFactory(
      ERC20_ABI,
      ERC20_BYTECODE
    );
    WETH = await WETH09.connect(addr1).deploy(expandTo18Decimals(1000), "Wrapped ETH", "WETH");
    assert(await WETH.deployed(), "contract was not deployed");
    const USDC09 = await ethers.getContractFactory(
      ERC20_ABI,
      ERC20_BYTECODE
    );
    USDC = await USDC09.connect(addr1).deploy(expandTo18Decimals(1000), "USD Coin", "USDC");
    assert(await USDC.deployed(), "contract was not deployed");
    const JPYC09 = await ethers.getContractFactory(
      ERC20_ABI,
      ERC20_BYTECODE
    );
    JPYC = await JPYC09.connect(addr1).deploy(expandTo18Decimals(1000), "JPY Coin", "JPYC");
    assert(await JPYC.deployed(), "contract was not deployed");

    // deploy factory v2
    const FactoryV2 = await ethers.getContractFactory(
      FACTORY_ABI,
      FACTORY_BYTECODE
    );
    factoryV2 = await FactoryV2.deploy(owner.address);
    assert(await factoryV2.deployed(), "contract was not deployed");

    // deploy router02
    const Router02 = await ethers.getContractFactory(
      ROUTER02_ABI,
      ROUTER02_BYTECODE
    );
    router02 = await Router02.deploy(factoryV2.address, WETH.address);
    assert(await router02.deployed(), "contract was not deployed");

    // deploy donate contract
    const Donate = await ethers.getContractFactory(
      DONATE_ABI,
      DONATE_BYTECODE
    );
    donate = await Donate.connect(addr1).deploy(WETH.address, router02.address);
    assert(await donate.deployed(), "contract was not deployed");

    // addLiquidity 1000WETH and 1000USDC pair
    await USDC.connect(addr1).approve(router02.address, ethers.constants.MaxUint256);
    await WETH.connect(addr1).approve(router02.address, ethers.constants.MaxUint256);
    await router02.connect(addr1).addLiquidity(
      USDC.address,
      WETH.address,
      expandTo18Decimals(100),
      expandTo18Decimals(100),
      0,
      0,
      addr1.address,
      ethers.constants.MaxUint256
    )

    // addLiquidity 1000WETH and 1000 JPYC pair
    await JPYC.connect(addr1).approve(router02.address, ethers.constants.MaxUint256);
    await WETH.connect(addr1).approve(router02.address, ethers.constants.MaxUint256);
    await router02.connect(addr1).addLiquidity(
      JPYC.address,
      WETH.address,
      expandTo18Decimals(100),
      expandTo18Decimals(100),
      0,
      0,
      addr1.address,
      ethers.constants.MaxUint256,
    );
  })
  it("Create Account Test", async () => {
    // First account creation
    let tx: ContractTransaction = await donate.connect(addr2).CreateAccount();
    await tx.wait();
    assert((await donate.connect(addr2).getAccountBalance()).toString() === "0", "Failed to create an account");

    // Already opened an account
    await expect(donate.connect(addr2).CreateAccount()).to.be.reverted;
  })
  it("Deposit Test WETH", async () => {
    // addr3 100WETH -> addr2 xxxWETH
    // initialize addr3 balance
    await WETH.connect(addr1).transfer(addr3.address, expandTo18Decimals(10), {from: addr1.address});
    assert((await WETH.balanceOf(addr3.address)).toString() === expandTo18Decimals(10).toString(), "Charge is not completed");

    // create account for addr2
    let tx: ContractTransaction = await donate.connect(addr2).CreateAccount();
    await tx.wait();
    assert((await donate.connect(addr2).getAccountBalance()).toString() === "0", "Failed to create an account");

    // deposit for addr2 account
    await WETH.connect(addr3).approve(donate.address, ethers.constants.MaxUint256);
    tx = await donate.connect(addr3).Deposit(addr2.address, WETH.address, expandTo18Decimals(10));
    await tx.wait();
    assert((await donate.connect(addr2).getAccountBalance()).toString() > "0", "Improper deposit")
  })
  it("Deposit Test USDC", async () => {
    // addr3 100USDC -> addr2 xxxWETH
    // initliaze addr3 balance
    await USDC.connect(addr1).transfer(addr3.address, expandTo18Decimals(10), {from: addr1.address});
    assert((await USDC.balanceOf(addr3.address)).toString() === expandTo18Decimals(10).toString(), "Charge is not completed");

    // create account for addr2
    let tx: ContractTransaction = await donate.connect(addr2).CreateAccount();
    await tx.wait();
    assert((await donate.connect(addr2).getAccountBalance()).toString() === "0", "Failed to create an account");

    // deposit for addr2 account
    await USDC.connect(addr3).approve(donate.address, ethers.constants.MaxUint256);
    tx = await donate.connect(addr3).Deposit(addr2.address, USDC.address, expandTo18Decimals(10))
    await tx.wait();
    assert((await donate.connect(addr2).getAccountBalance()).toString() > "0", "Improper deposit")
  })
  it("Withdrawal Test", async () => {
    // Deposit Transaction 
    // addr3 100USDC -> addr2 xxxWETH
    // initliaze addr3 balance
    await USDC.connect(addr1).transfer(addr3.address, expandTo18Decimals(10), {from: addr1.address});
    assert((await USDC.balanceOf(addr3.address)).toString() === expandTo18Decimals(10).toString(), "Charge is not completed");

    // create account for addr2
    let tx: ContractTransaction = await donate.connect(addr2).CreateAccount();
    await tx.wait();
    assert((await donate.connect(addr2).getAccountBalance()).toString() === "0", "Failed to create an account");

    // deposit for addr2 account
    await USDC.connect(addr3).approve(donate.address, ethers.constants.MaxUint256);
    tx = await donate.connect(addr3).Deposit(addr2.address, USDC.address, expandTo18Decimals(10));
    await tx.wait();
    assert((await donate.connect(addr2).getAccountBalance()).toString() > "0", "Remittance could not be completed");

    // donate contract -> addr2 address xxxWETH
    tx = await donate.connect(addr2).Withdrawal();
    await tx.wait();
    // console.log((await WETH.balanceOf(addr2.address)).toString());
    assert((await WETH.balanceOf(addr2.address)).toString() > "0", "There is no balance or it could not be obtained normally.");
    assert((await donate.connect(addr2).getAccountBalance()).toString() === "0", "The withdrawal from the account is not successful and the account is not empty.");
  })
})
