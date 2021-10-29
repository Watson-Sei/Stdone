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

    event AccountId(uint);
    event AccountBalance(uint);
    
    // 変数リスト
    address public owner;
    IERC20 public token;

    // 仮想口座構造
    struct VirtualAccount {
        // 口座番号
        uint id;
        // 口座主アドレス
        address owner;
        // 口座貯金額
        uint savingAmount;
        // 口座引き出し制限開始日
        uint256 restriction;
    }

    // 全仮想口座
    VirtualAccount[] public VirtualAccounts;
    
    // コントラクトの初期化
    constructor(address _token) {
        // コントラクトの管理者
        owner = msg.sender;
        // トークンのコントラクトアドレスをERC20規格に渡す
        token = IERC20(_token);
    }

    // 口座配列取得関数
    function getVirtualAccounts() public view returns (VirtualAccount[] memory) { return VirtualAccounts; }
    // 自身の口座残高の取得
    function getVirtualAccountBalance() public view returns (uint) {
        uint index = 0;
        for (uint i = 0; i < VirtualAccounts.length; i++) {
            if (VirtualAccounts[i].owner == msg.sender) {
                index = i;
                break;
            }
        }
        if (index == 0) {
            return 0;
        }
        return VirtualAccounts[index].savingAmount;
    }

    // 口座開設関数
    function Opening() public {
        // 全口座数から被らない口座番号を設定
        uint id = VirtualAccounts.length;
        // 全口座に新口座情報を追加
        VirtualAccounts.push(VirtualAccount({
            id: id,
            // 口座開設リクエストを送信したユーザーのアドレスを登録
            owner: msg.sender,
            savingAmount: 0,
            //　口座開設時のタイムスタンプを設定
            restriction: block.timestamp
        }));
        emit AccountId(id);
    }

    // 口座に振り込み
    function Transfer(uint _id) public payable {
        uint index = 0;
        for (uint i = 0; i < VirtualAccounts.length; i++) {
            if (VirtualAccounts[i].id == _id) {
                index = i;
                break;
            }
        }
        // 口座コントラクトに対して送金された金額をsavingAmountに追加する
        VirtualAccounts[index].savingAmount += msg.value;
    }

    // 口座から引き出し
    function Withdrawal(uint _id) public payable {
        uint index = 0;
        for (uint i = 0; i < VirtualAccounts.length; i++) {
            if (VirtualAccounts[i].id == _id) {
                index = i;
                break;
            }
        }
        // 前回の制限から1ヶ月経っているかを確認
        require(block.timestamp >= 30 days + VirtualAccounts[index].restriction, "It hasn't been a month.");
        // 口座主であるか確認
        require(VirtualAccounts[index].owner == msg.sender, "This account is not a subscriber.");
        // 制限を更新します
        VirtualAccounts[index].restriction = block.timestamp;
        // 口座から口座主に送金します
        require(token.transfer(msg.sender, VirtualAccounts[index].savingAmount * (0.83 * 10 ** 18)), "The remittance process failed.");
    }
}