// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IUniswapV2Router02.sol";

contract Donate {
    // This contract owner address
    address public owner;
    // ERC20 Standard Interface
    IERC20 public token;
    // Address of Uniswap V2 Router
    address public ROUTER02;
    // Standard currency in contract
    address public WETH;

    // Account Struct
    struct VirtualAccount {
        uint check;
        address owner;
        uint256 savingAmount;
        uint256 restriction;
    }

    // Account Struct Array
    mapping(address => VirtualAccount) public VirtualAccounts;

    // Initialize
    constructor(address _WETH, address _ROUTER02) {
        owner = msg.sender;
        WETH = _WETH;
        ROUTER02 = _ROUTER02;
    }

    // get account balance
    function getAccountBalance() public view returns (uint) {
        require(VirtualAccounts[msg.sender].check == 1, "There is no account associated with this address");
        return VirtualAccounts[msg.sender].savingAmount;
    }

    // make accounts
    function CreateAccount() public {
        require(VirtualAccounts[msg.sender].check == 0, "Already have an account");
        VirtualAccount memory account = VirtualAccount(1, msg.sender, 0, block.timestamp);
        VirtualAccounts[msg.sender] = account;
    }

    // deposit
    function Deposit(address _to, address _tokenIn, uint256 _amountIn) public {
        require(VirtualAccounts[_to].check == 1, "The account at this address does not exist");
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenIn).approve(ROUTER02, _amountIn);

        address[] memory path;
        if (_tokenIn == WETH) {
            VirtualAccounts[_to].savingAmount += _amountIn;
        } else {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = WETH;

            (uint[] memory amount) = IUniswapV2Router(ROUTER02).swapExactTokensForTokens(
                _amountIn, 
                0, 
                path, 
                address(this),
                block.timestamp
            );
            VirtualAccounts[_to].savingAmount += amount[1];
        }
    }

    // withdrawals
    function Withdrawal() public payable {
        require(VirtualAccounts[msg.sender].check == 1, "The account at this address does not exist");
        require(IERC20(WETH).balanceOf(address(this)) >= VirtualAccounts[msg.sender].savingAmount, "The balance is insufficient");
        VirtualAccounts[msg.sender].restriction = block.timestamp;
        require(IERC20(WETH).approve(address(this), VirtualAccounts[msg.sender].savingAmount * 83 / 100), "Failed to allow.");
        require(IERC20(WETH).transferFrom(address(this), msg.sender, VirtualAccounts[msg.sender].savingAmount * 83 / 100), "Failed to transfer funds.");
        VirtualAccounts[msg.sender].savingAmount = 0;
    }
}