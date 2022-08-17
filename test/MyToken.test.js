let chai = require('chai');
const web3 = require('web3');
const hardhat = require('hardhat');
const ethers = hardhat.ethers;
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
require('dotenv').config();

const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const expect = chai.expect;

describe("MyTokenContract", async () => {
    async function deployTokenFixture () {
        const [owner, addr1, addr2] = await ethers.getSigners();

        const MyToken = await ethers.getContractFactory("MyToken");
        const myToken = await MyToken.deploy(process.env.INITIAL_TOKENS);
        await myToken.deployed();
        return {myToken, owner, addr1, addr2};
    }

    describe("MyToken test", async () => {
        it("Shoud check that owner possesses all tokens", async () => {
            const {myToken, owner} = await loadFixture(deployTokenFixture);
            let totalSupply = await myToken.totalSupply();
            const balance = await myToken.balanceOf(owner.address);
            expect(balance).to.be.a.bignumber;
            expect(balance).to.equal(totalSupply);
        })
        
        it("Should transfer tokens from one to anoher account", async () => {
            const {myToken, owner, addr1} = await loadFixture(deployTokenFixture);

            const totalSupply = await myToken.totalSupply();
            await myToken.transfer(addr1.address, 100);
            expect(await myToken.balanceOf(owner.address)).to.be.a.bignumber;
            expect(await myToken.balanceOf(owner.address)).to.equal(totalSupply.sub(100));
            expect(await myToken.balanceOf(addr1.address)).to.be.a.bignumber;
            expect(await myToken.balanceOf(addr1.address)).to.equal(new BN(100));
        })
        it("Should reject overspending", async () => {
            const {myToken, owner, addr1} = await loadFixture(deployTokenFixture);
            const totalSupply = await myToken.balanceOf(owner.address);
    
            expect(myToken.transfer(addr1.address, new BN(totalSupply+1))).to.eventually.be.rejected;
            expect(totalSupply).to.be.a.bignumber;
            expect(await myToken.balanceOf(owner.address)).to.equal(totalSupply);
        })
    })
})

