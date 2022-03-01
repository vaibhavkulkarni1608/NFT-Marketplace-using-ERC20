async function main() {
  const Marketplace = await ethers.getContractFactory("Marketplace");

  // Start deployment, returning a promise that resolves to a contract object
  const myMarketplace = await Marketplace.deploy();
  await myMarketplace.deployed();
  console.log("Contract deployed to address:", myMarketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
