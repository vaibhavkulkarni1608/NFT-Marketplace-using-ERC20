// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Marketplace is ERC1155 {
    address public platform; //Platform address
    uint256 id; 
    uint256 NFTPrice; 
    
    constructor() ERC1155("") {
        platform=msg.sender; //set Deployer as Platform Owner
    }

    //define structure to store NFT metadata
    struct Property {
        uint256 id;
        string name;
        string color;
        string description;
        string tokenURI;
        string dateTime;
    }

    //Array of structure
    Property[] public Propertylist;

    //Caller should not be the Platform Owner
    modifier notOwner(){
        require(msg.sender!=platform,"You don't have permission");
        _;
    }

    //Caller should be the Platform Owner
    modifier onlyOwner(){
        require(msg.sender==platform,"You don't have permission");
        _;
    }

    //Function to set the price of NFT which accepts amount as an argument.
    function setNFTPrice(uint256 _setAmount)onlyOwner public returns(uint256){
        NFTPrice=_setAmount;
        return NFTPrice;
    }

    //Function to create/mint ERC20 tokens which accepts amount i.e number of tokens to mint.
    function mintERC20(uint amount)notOwner public{
        _mint(msg.sender, id, amount, "");
         id=id+1;
    }

    /*Function to create/mint NFT which accepts id of ERC20 token to sell, 
    and other parameters to set NFT metadata*/
    function mintNFT(
        uint256 _id, 
        string memory name,
        string memory color,
        string memory description,
        string memory tokenURI,
        string memory dateTime
    ) notOwner public{
       
        uint256 erc20Balance=balanceOf(msg.sender,0);
        require(erc20Balance>=NFTPrice,"Insufficient balance");
        safeTransferFrom(msg.sender, platform, _id, NFTPrice, "");
        _mint(msg.sender, id, 1, "");
        Propertylist.push(
            Property(
                id,
                name,
                color,
                description,
                tokenURI,
                dateTime
            )
        );
    }
}

