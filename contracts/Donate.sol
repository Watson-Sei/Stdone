// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0/contracts/token/ERC20/IERC20.sol
interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

contract Donate {
    
    // 変数リスト
    address public owner;
    IERC20 public token;

    // 仮想口座構造
    struct VirtualAccount {
        // 開設済みであれば1、未開設であれば0
        uint check;
        // 口座主アドレス
        address owner;
        // 口座貯金額
        uint savingAmount;
        // 口座引き出し制限開始日
        uint256 restriction;
    }

    // 全仮想口座
    mapping(address => VirtualAccount) public VirtualAccounts;

    // コントラクトの初期化
    constructor(address _token) {
        // コントラクト管理者
        owner = msg.sender;
        // トークンのコントラクトアドレスをERC20規格に渡す
        token = IERC20(_token);
    }

    // リクエストユーザーの口座情報取得
    function getVirtualAccountBalance() public view returns (uint) {
        require(VirtualAccounts[msg.sender].check == 1, "There is no account associated with this address");
        return VirtualAccounts[msg.sender].savingAmount;
    }

    // 口座開設関数
    function Opening() public {
        require(VirtualAccounts[msg.sender].check == 0, "Already have an account");
        VirtualAccount memory account = VirtualAccount(1, msg.sender, 0, block.timestamp);
        VirtualAccounts[msg.sender] = account;
    }

    // 口座振り込み
    function Transfers(address _to, uint256 _amount) public {
        require(VirtualAccounts[_to].check == 1, "The account at this address does not exist");
        // require(token.approve(msg.sender, _amount), "Failed to allow.");
        // require(token.allowance(address(this), msg.sender) >= _amount, "Insuficient Allowance");
        require(token.transferFrom(msg.sender, address(this), _amount), "transfer Failed");
    }

    // 口座引き出し
    function Withdrawal() public payable {
        require(VirtualAccounts[msg.sender].check == 1, "The account at this address does not exist");
        require(token.balanceOf(address(this)) >= VirtualAccounts[msg.sender].savingAmount, "The balance is insufficient");
        require(block.timestamp >= 1 seconds + VirtualAccounts[msg.sender].restriction, "It hasn't been a month.");
        VirtualAccounts[msg.sender].restriction = block.timestamp;
        require(token.transfer(msg.sender, VirtualAccounts[msg.sender].savingAmount * 83 / 100), "Failed to transfer funds.");
        VirtualAccounts[msg.sender].savingAmount -= 0;
    }
}