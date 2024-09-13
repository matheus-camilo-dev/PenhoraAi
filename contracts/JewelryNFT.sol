
// SPDX-License-Identifier: MIT
//  licença MIT


// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Anel is ERC721, ERC721URIStorage, AutomationCompatibleInterface {
    using Counters for Counters.Counter;

    Counters.Counter public tokenIdCounter;
 
    // Metadata information for each stage of the NFT on IPFS.
    string[] IpfsUri = [
        "https://ipfs.io/ipfs/QmYB7TnAVUMcUKkiyGXjBnk7uLvzk3te74Y8QchFdmq8Kn/2G_Anel.json",
        "https://ipfs.io/ipfs/QmYB7TnAVUMcUKkiyGXjBnk7uLvzk3te74Y8QchFdmq8Kn/3G_Anel.json",
        "https://ipfs.io/ipfs/QmYB7TnAVUMcUKkiyGXjBnk7uLvzk3te74Y8QchFdmq8Kn/4G_Anel.json"
    ];

    uint public immutable interval;
    uint public lastTimeStamp;

    constructor(uint updateInterval) ERC721("PenhoraAi NFT 2024", "MW") {
        interval = updateInterval;
        lastTimeStamp = block.timestamp;
        safeMint(msg.sender);
    }

    function safeMint(address to) public {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, IpfsUri[0]);
    }

    // Determine the usage stage of the ring (returns 0, 1, or 2)
    function Size(uint256 _tokenId) public view returns (uint256) {
        string memory _uri = tokenURI(_tokenId);
        if (compareStrings(_uri, IpfsUri[0])) {
            return 0;  // New ring (2G)
        }
        if (compareStrings(_uri, IpfsUri[1])) {
            return 1;  // Mildly used (3G)
        }
        return 2;  // Old ring (4G)
    }

    function updateSize(uint256 _tokenId) public {
        uint256 currentSize = Size(_tokenId);  // Get the current size/stage
        if (currentSize >= 2) { return; }  // No updates if already at the final stage
        uint256 newVal = currentSize + 1;  // Move to the next stage
        string memory newUri = IpfsUri[newVal];  // Get the new URI
        _setTokenURI(_tokenId, newUri);  // Update the metadata URI
    }

    // Helper function to compare strings (IPFS URIs)
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    // Chainlink checkUpkeep: checks if an update is needed
    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        if ((block.timestamp - lastTimeStamp) > interval ) {
            uint256 tokenId = tokenIdCounter.current() - 1;
            if (Size(tokenId) < 2) {
                upkeepNeeded = true;  // Metadata needs updating
            }
        }
    }

    // Chainlink performUpkeep: performs the metadata update
    function performUpkeep(bytes calldata /* performData */) external override {
        if ((block.timestamp - lastTimeStamp) > interval ) {
            uint256 tokenId = tokenIdCounter.current() - 1;
            if (Size(tokenId) < 2) {
                lastTimeStamp = block.timestamp;  // Update timestamp
                updateSize(tokenId);  // Update the token's size/stage
            }
        }
    }

    // Override tokenURI to return the correct metadata URI
    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Override _burn function for ERC721URIStorage
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}



