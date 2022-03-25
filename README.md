# Staking Contract address
My Simple Staking Smart Contract

###Deploy to rinkeby network:
```
npx hardhat run --network rinkeby scripts/deploy.ts
```
###HardHat tasks:
stake tokens
```
npx hardhat stake --address [contract address] --amount=1000
```

unstake tokens
```
npx hardhat unstake --address [contract address]
```

claim reward
```
npx hardhat claim --address [contract address]
```

Staking contract address:
[0x32771Da5308184b6aDd2C09761E3006Df8cfA815](https://rinkeby.etherscan.io/address/0x32771Da5308184b6aDd2C09761E3006Df8cfA815
)

Reward tokens address:
[0xaBE404c526441d2A000D7098a09a8B763c1Be33d](https://rinkeby.etherscan.io/token/0xaBE404c526441d2A000D7098a09a8B763c1Be33d
)

LP uniswap tokens address:
[0xceFA480CF4436635832de56549909811C86CdA28](https://rinkeby.etherscan.io/token/0xceFA480CF4436635832de56549909811C86CdA28
)
