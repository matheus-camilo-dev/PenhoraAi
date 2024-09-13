// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract P2PNFTLending is ReentrancyGuard, Ownable {

    // Chainlink price feed contract for Gold/USD (XAU/USD) on Ethereum
    AggregatorV3Interface internal goldPriceFeed;

    // Gold price in USDC per gram conversion constant
    uint256 constant OUNCES_TO_GRAMS = 311035; // 1 ounce = 31.1035 grams (multiplied by 10^4 for precision)
    uint256 constant PRICE_MULTIPLIER = 10**8; // Adjust for Chainlink's 8 decimal precision

    // Constructor requires the owner address
    constructor(address _owner) Ownable(_owner) {
        goldPriceFeed = AggregatorV3Interface(0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea); // XAU/USD Chainlink feed
    }

    struct Loan {
        address borrower;
        address lender;
        uint256 nftId;
        address nftContract;
        uint256 loanAmount;
        uint256 repayAmount;
        uint256 dueDate;
        bool isRepaid;
        bool monthlyRepayment;
        uint256 lastRepaymentDate;
        uint256 installmentsPaid;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public loanCounter;

    uint256 constant SINGLE_REPAYMENT_INTEREST = 22; // 2.2% interest
    uint256 constant MONTHLY_REPAYMENT_INTEREST = 375; // 3.75% interest for 3 monthly parcels

    // Function to create a new loan with price calculated based on gold weight in grams
    function createLoan(
        address nftContract,
        uint256 nftId,
        uint256 goldGrams,  // Input from Java frontend in grams
        bool monthlyRepayment,
        uint256 dueDate
    ) external nonReentrant {
        // Calculate loan amount in USDC based on gold price
        uint256 loanAmount = getGoldPriceInUSDC(goldGrams);  // Step 4
        uint256 repayAmount = calculateRepayAmount(loanAmount, monthlyRepayment);
        
        IERC721(nftContract).transferFrom(msg.sender, address(this), nftId);
        
        loans[loanCounter] = Loan({
            borrower: msg.sender,
            lender: address(0),
            nftId: nftId,
            nftContract: nftContract,
            loanAmount: loanAmount,
            repayAmount: repayAmount,
            dueDate: dueDate,
            isRepaid: false,
            monthlyRepayment: monthlyRepayment,
            lastRepaymentDate: 0,
            installmentsPaid: 0
        });
        
        loanCounter++;
    }

    // Function to fetch gold price in USDC per gram and calculate the loan amount
    function getGoldPriceInUSDC(uint256 grams) public view returns (uint256) {
        (
            , 
            int price,  // Price from Chainlink Feed (XAU/USD)
            , 
            , 
        ) = goldPriceFeed.latestRoundData();
        
        // Convert XAU (1 ounce) price to price per gram
        uint256 pricePerGram = uint256(price) * PRICE_MULTIPLIER / OUNCES_TO_GRAMS;
        
        // Multiply by the number of grams provided
        return pricePerGram * grams / PRICE_MULTIPLIER;
    }

    // Calculate repayment amount based on repayment plan
    function calculateRepayAmount(uint256 loanAmount, bool monthlyRepayment) internal pure returns (uint256) {
        if (monthlyRepayment) {
            // Apply 3.75% interest for monthly installment plan
            return loanAmount + ((loanAmount * MONTHLY_REPAYMENT_INTEREST) / 10000); 
        } else {
            // Apply 2.2% interest for single repayment
            return loanAmount + ((loanAmount * SINGLE_REPAYMENT_INTEREST) / 1000);
        }
    }

    // Lender funds the loan by sending the required amount
    function fundLoan(uint256 loanId) external payable nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.loanAmount == msg.value, "Incorrect loan amount");
        require(loan.lender == address(0), "Loan already funded");

        loan.lender = msg.sender;
        payable(loan.borrower).transfer(msg.value);
    }

    // Borrower repays the loan in a single payment or in installments
    function repayLoan(uint256 loanId) external payable nonReentrant {
        Loan storage loan = loans[loanId];
        require(msg.sender == loan.borrower, "Not the borrower");
        require(block.timestamp <= loan.dueDate, "Loan overdue");

        if (loan.monthlyRepayment) {
            // Monthly repayment with 3 installments
            require(block.timestamp >= loan.lastRepaymentDate + 30 days, "Cannot repay before next installment is due");
            uint256 installmentAmount = loan.repayAmount / 3;
            require(msg.value == installmentAmount, "Incorrect installment amount");

            loan.installmentsPaid++;
            loan.lastRepaymentDate = block.timestamp;

            // After 3 installments, loan is considered repaid
            if (loan.installmentsPaid == 3) {
                loan.isRepaid = true;
                IERC721(loan.nftContract).transferFrom(address(this), loan.borrower, loan.nftId);
            }

            payable(loan.lender).transfer(msg.value);
        } else {
            // Single repayment with 2.2% interest
            require(msg.value == loan.repayAmount, "Incorrect repay amount");

            loan.isRepaid = true;
            payable(loan.lender).transfer(msg.value);
            IERC721(loan.nftContract).transferFrom(address(this), loan.borrower, loan.nftId);
        }
    }

    // Lender can liquidate the NFT if the loan is not repaid by the due date
    function liquidateLoan(uint256 loanId) external nonReentrant {
        Loan storage loan = loans[loanId];
        require(block.timestamp > loan.dueDate, "Loan not yet overdue");
        require(!loan.isRepaid, "Loan already repaid");

        IERC721(loan.nftContract).transferFrom(address(this), loan.lender, loan.nftId);
    }
}
