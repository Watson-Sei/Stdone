// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { BigNumber } from "@ethersproject/bignumber";
import { ethers, waffle } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const JPYCToken = await ethers.getContractFactory("Token");
  const jpycToekn = await JPYCToken.deploy();

  await jpycToekn.deployed();

  console.log("Token deployed to:", jpycToekn.address);

  const Donate = await ethers.getContractFactory("Donate");
  const donate = await Donate.deploy(jpycToekn.address);

  await donate.deployed();

  console.log("Donate deployed to:", donate.address);

  // Donate Contractの残高が0であれば送金する
  const donatebalance = (await jpycToekn.balanceOf(donate.address)).toString();
  console.log(donatebalance);
  if (Number(donatebalance) <= 0) {
    await jpycToekn.transfer(donate.address, "0x" + (1000 * 10 ** 18).toString(16));
    const donatebalance = (await jpycToekn.balanceOf(donate.address)).toString();
    console.log(donatebalance)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
