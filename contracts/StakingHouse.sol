// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StakingHouse is Ownable {
    using SafeMath for uint;
    IERC20 private _stakingToken;
    IERC20 private _rewardToken;

    uint8 public stakingPercent = 20;
    uint public unstakeFrozenTime = 20 minutes;
    uint public stakingRewardTime = 10 minutes;
    uint public _totalStakingTokens;


    struct User
    {
        uint startTime;
        uint256 stakingBalance;
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

    function stake(uint256 amount) external {
        require(amount > 100, "amount will be more");

        if (reward() > 0)
            claim();
        _stakingToken.transferFrom(msg.sender, address(this), amount);
        _users[msg.sender].stakingBalance += amount;
        _totalStakingTokens += amount;
        _users[msg.sender].startTime = block.timestamp;
    }

    function claim() public userExist checkTime(stakingRewardTime) {
        _rewardToken.transfer(msg.sender, reward());
    }

    function unstake() external userExist checkTime(unstakeFrozenTime) {
        claim();
        _stakingToken.transfer(msg.sender, _users[msg.sender].stakingBalance);
        _users[msg.sender].stakingBalance = 0;
    }

    function reward() private view returns (uint256) {
        uint different = block.timestamp.sub(_users[msg.sender].startTime).div(stakingRewardTime);
        uint rate = _users[msg.sender].stakingBalance.div(100).mul(stakingPercent);
        uint _reward = rate.mul(different);
        return _reward;
    }

    function changePercent(uint8 percent) external onlyOwner {
        stakingPercent = percent;
    }

    function changeFrozenTime(uint time) external onlyOwner {
        unstakeFrozenTime = time;
    }

}
