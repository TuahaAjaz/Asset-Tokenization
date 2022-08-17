require('dotenv').config();

async function main() {
  // This is just a convenience check
  
  const [deployer] = await ethers.getSigners();


  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(process.env.INITIAL_TOKENS);

  console.log(token.address);

  const TokenSale = await ethers.getContractFactory("MyTokenSale");
  const tokenSale = await TokenSale.deploy(1, deployer.address, token.address);

  console.log("here");

  await token.deployed();
  await token.transfer(tokenSale.address, process.env.INITIAL_TOKENS)  

  //console.log("Token Sale address:", tokenSale.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
