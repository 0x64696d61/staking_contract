import {expect} from "chai";
import {ethers, network} from "hardhat";
import {address} from "hardhat/internal/core/config/config-validation";

describe("ERC20 token", function () {
    const value = 200
    const unstakeFrozenTime = 20
    const stakingRewardTime = 10
    const staking_percent = 20;

    let acc1: any
    let acc2: any
    let acc3: any
    let rewardToken: any
    let stakingToken: any
    let stakingHouse: any

    beforeEach(async function () {

        [acc1, acc2, acc3] = await ethers.getSigners()

        let Contract = await ethers.getContractFactory('MyStakingToken', acc1)
        stakingToken = await Contract.deploy();
        await stakingToken.deployed()

        Contract = await ethers.getContractFactory('MyRewardToken', acc2)
        rewardToken = await Contract.deploy();
        await rewardToken.deployed()

        Contract = await ethers.getContractFactory('StakingHouse', acc3)
        stakingHouse = await Contract.deploy(stakingToken.address, rewardToken.address);
        await stakingHouse.deployed()

        await stakingToken.connect(acc1).approve(stakingHouse.address, value)
        await rewardToken.connect(acc2).transfer(stakingHouse.address, value)
    })

    it("Should be deployed", async function () {
        expect(stakingToken.address).to.be.properAddress
        expect(rewardToken.address).to.be.properAddress
        expect(stakingHouse.address).to.be.properAddress
    })

    describe("stake method", function () {
        it("Should be possible stake tokens", async function () {
            await stakingHouse.connect(acc1).stake(value)

            expect(await stakingToken.balanceOf(stakingHouse.address)).eq(value)
        })
        it("Should be return reward before new stake tokens", async function () {
            await stakingHouse.connect(acc1).stake(value)
            await network.provider.send("evm_increaseTime", [stakingRewardTime * 60])
            await stakingToken.connect(acc1).approve(stakingHouse.address, value)
            await stakingHouse.connect(acc1).stake(value)

            expect(await rewardToken.balanceOf(acc1.address)).eq(value * (staking_percent * 0.01))
        })


        it("Should be reverted if amount less 100", async function () {
            await expect(stakingHouse.connect(acc1).stake(90)).to.be.revertedWith("amount will be more")
        })

    })

    describe("unstake method", function () {
        it("Should be possible unstake tokens", async function () {
            await stakingHouse.connect(acc1).stake(value)
            await network.provider.send("evm_increaseTime", [unstakeFrozenTime * 60])
            await stakingHouse.connect(acc1).unstake()

            expect(await stakingToken.balanceOf(stakingHouse.address)).eq(0)
        })

        it("Should be revered if try unstake in frozen time", async function () {
            await stakingHouse.connect(acc1).stake(value)

            await expect(stakingHouse.connect(acc1).unstake()).to.be.revertedWith("It's too soon. Try later")
        })
    })
    describe("claim method", function () {
        it("Should be reward for staking", async function () {
            await stakingHouse.connect(acc1).stake(value)
            await network.provider.send("evm_increaseTime", [stakingRewardTime * 60])
            await stakingHouse.connect(acc1).claim()

            expect(await rewardToken.balanceOf(acc1.address)).eq(value * (staking_percent * 0.01))
        })
        it("Should be reverted if user don't exist", async function () {
            await expect(stakingHouse.connect(acc2).claim()).to.be.revertedWith("User not exist")
        })
    })
    it("Should be possible change percent of reward", async function () {
        await stakingHouse.connect(acc3).changePercent(value)

        expect(await stakingHouse.connect(acc3).stakingPercent()).eq(value)
    })
    it("Should be reverted if not owner try change percent of reward", async function () {
        await expect(stakingHouse.connect(acc1).changePercent(value)).to.be.revertedWith("Ownable: caller is not the owner")
    })
    it("Should be possible change unstake frozen time", async function () {
        await stakingHouse.connect(acc3).changeFrozenTime(22)

        expect(await stakingHouse.connect(acc3).unstakeFrozenTime()).eq(22)
    })
    it("Should be reverted if not owner try change unstake frozen time", async function () {
        await expect(stakingHouse.connect(acc1).changeFrozenTime(22)).to.be.revertedWith("Ownable: caller is not the owner")
    })

});
