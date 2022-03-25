import { ethers } from "hardhat";

const contract_name='StakingHouse'
const staking_token_address='0xceFA480CF4436635832de56549909811C86CdA28';
const reward_token_address='0xaBE404c526441d2A000D7098a09a8B763c1Be33d';


async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const factory = await ethers.getContractFactory(contract_name);
    const contract = await factory.deploy(staking_token_address, reward_token_address);
    await contract.deployed();

    console.log("Contract deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });