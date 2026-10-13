const hre = require("hardhat");

async function main() {
  const DominionDAO =
    await hre.ethers.getContractFactory("DominionDAO");

  const dominionDAO = await DominionDAO.deploy();

  await dominionDAO.waitForDeployment();

  console.log(
    "DominionDAO deployed to:",
    await dominionDAO.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });