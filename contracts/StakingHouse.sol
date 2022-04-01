// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingHouse is Ownable {
    IERC20 private _stakingToken;
    IERC20 private _rewardToken;

    uint8 public stakingPercent = 20;
    uint public unstakeFrozenTime = 20 minutes;
    uint public stakingRewardTime = 10 minutes;

    event Stake(address indexed account, uint256 amount);
    event UnStake(address indexed account, uint256 amount);
    event Reward(address indexed account, uint256 amount);

    struct User
    {
        uint startTime;
        uint stakingBalance;
    }

    constructor(address stakingTokenAddress, address rewardTokenAddress) {
        _stakingToken = IERC20(stakingTokenAddress);
        _rewardToken = IERC20(rewardTokenAddress);
    }

    mapping(address => User) private _users;

    modifier userExist(){
        require(_users[msg.sender].stakingBalance > 0, "User not exist");
        _;
    }
    modifier checkTime(uint time) {
        require(block.timestamp >= _users[msg.sender].startTime + time, "It's too soon. Try later");
        _;
    }

    function stake(uint amount) external {
        require(amount > 100, "amount will be more");

        if (reward() > 0)
            claim();
        _users[msg.sender].stakingBalance += amount;
        _stakingToken.transferFrom(msg.sender, address(this), amount);
        _users[msg.sender].startTime = block.timestamp;
        emit Stake(msg.sender, amount);
    }

    function claim() public userExist checkTime(stakingRewardTime) {
        uint amount = reward();
        _rewardToken.transfer(msg.sender, amount);
        _users[msg.sender].startTime = block.timestamp;
        emit Reward(msg.sender, amount);
    }

    function unstake() external userExist checkTime(unstakeFrozenTime) {
        claim();
        _stakingToken.transfer(msg.sender, _users[msg.sender].stakingBalance);
        _users[msg.sender].stakingBalance = 0;
      //  emit UnStake(msg.sender, _users[msg.sender].stakingBalance);
    }

    function reward() private view returns (uint) {
        uint different = (block.timestamp - _users[msg.sender].startTime) / stakingRewardTime;
        uint rate = _users[msg.sender].stakingBalance / 100 * stakingPercent;
        uint _reward = rate * different;
        return _reward;
    }

    function changePercent(uint8 percent) external onlyOwner {
        stakingPercent = percent;
    }

    function changeFrozenTime(uint time) external onlyOwner {
        unstakeFrozenTime = time;
    }

}
