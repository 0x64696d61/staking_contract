import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

const contract_name = 'StakingHouse'
const prefix = contract_name + '_'

task(prefix + "stake", "Stake LP tokens")
    .addParam("address", "Contract address")
    .addParam("amount", "The amount LP tokens")
    .setAction(async (taskArgs, hre) => {
        const [acc1] = await hre.ethers.getSigners()
        const factory = await hre.ethers.getContractFactory(contract_name);
        const contract = await factory.attach(taskArgs.address)
        await contract.connect(acc1).stake(taskArgs.amount)
    });


task(prefix + "unstake", "Unstake LP tokens")
    .addParam("address", "Contract address")
    .setAction(async (taskArgs, hre) => {
        const [acc1] = await hre.ethers.getSigners()
        const factory = await hre.ethers.getContractFactory(contract_name);
        const contract = await factory.attach(taskArgs.address)
        await contract.connect(acc1).unstake()
    });

task(prefix + "claim", "Claim reward")
    .addParam("address", "Contract address")
    .setAction(async (taskArgs, hre) => {
        const [acc1] = await hre.ethers.getSigners()
        const Contract = await hre.ethers.getContractFactory(contract_name);
        const contract = await Contract.attach(taskArgs.address)
        await contract.connect(acc1).claim()
    });