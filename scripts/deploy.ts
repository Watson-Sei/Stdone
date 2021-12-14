// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [owner, addr1, addr2] = await ethers.getSigners();
  
  // Deploy Token 
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();
  console.log("Token deployed to:", token.address);

  // Amount Value
  const defaultAmount = "0x" + (10000 * 10 ** 18).toString(16);

  // Transfer Token
  await token.transfer(owner.address, defaultAmount);
  console.log(`${owner.address}: `,(await token.balanceOf(owner.address)).toString());
  await token.transfer(addr1.address, defaultAmount);
  console.log(`${addr1.address}: `,(await token.balanceOf(addr1.address)).toString());
  await token.transfer(addr2.address, defaultAmount);
  console.log(`${addr2.address}: `,(await token.balanceOf(addr2.address)).toString());

  // Deploy Donate
  const Donate = await ethers.getContractFactory("Donate");
  const donate = await Donate.connect(owner).deploy(token.address);
  await donate.deployed();
  console.log("Donate deployed to:", donate.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
