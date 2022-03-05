// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
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
import { expandTo18Decimals } from "../test/shared/utilities";
import { ContractTransaction } from "ethers";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();
  
  // Deploy Token
  // USDC
  const USDC09 = await ethers.getContractFactory(ERC20_ABI, ERC20_BYTECODE);
  const USDC = await USDC09.connect(addr1).deploy(expandTo18Decimals(1000), "USD Coin", "USDC");
  // WETH
  const WETH09 = await ethers.getContractFactory(ERC20_ABI, ERC20_BYTECODE);
  const WETH = await WETH09.connect(addr1).deploy(expandTo18Decimals(1000), "Wrapped ETH", "WETH");

  // deploy factory v2
  const FactoryV2 = await ethers.getContractFactory(FACTORY_ABI, FACTORY_BYTECODE);
  const factoryV2 = await FactoryV2.deploy(owner.address);

  // deploy router02
  const Router02 = await ethers.getContractFactory(ROUTER02_ABI, ROUTER02_BYTECODE);
  const router02 = await Router02.deploy(factoryV2.address, WETH.address);

  // deploy donate contract
  const Donate = await ethers.getContractFactory(
    DONATE_ABI,
    DONATE_BYTECODE
  );
  const donate = await Donate.connect(addr1).deploy(WETH.address, router02.address);

  // addLiquidity 100WETH and 100USDC pair
  await USDC.connect(addr1).approve(router02.address, ethers.constants.MaxUint256);
  await WETH.connect(addr1).approve(router02.address, ethers.constants.MaxUint256);
  await router02.connect(addr1).addLiquidity(
    USDC.address,
    WETH.address,
    expandTo18Decimals(10),
    expandTo18Decimals(10),
    0,
    0,
    addr1.address,
    ethers.constants.MaxUint256
  );

  // let tx: ContractTransaction = await donate.connect(addr2).CreateAccount();
  // await tx.wait();

  console.log("USDC Address: ", USDC.address);
  console.log("WETH Address: ", WETH.address);
  console.log("Donate Address: ", donate.address);

  console.log("Owner Address: ", owner.address);
  console.log("Addr1 Address: ", addr1.address);
  console.log("Addr2 Address: ", addr2.address);
  console.log("Addr3 Address: ", addr3.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
