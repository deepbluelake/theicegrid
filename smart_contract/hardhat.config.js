// https://eth-sepolia.g.alchemy.com/v2/CiRewkziJEXAAqTxeG9tSdNmT4Lc0Agj

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/CiRewkziJEXAAqTxeG9tSdNmT4Lc0Agj',
      accounts: ['8adfc190e0caab72b1f15502c2bba962f1139fb430981fb0eef9d3f4fd2a07ca'],
    },
  },
};
