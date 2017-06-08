pragma solidity ^0.4.8;

contract RevenueShareContract {
    
    address vendor1 = 0xe2f33D28F36b73258be077eD05Fb9f99b8545E5b; 
    address vendor2 = 0xd9f9CA6c2Eae6Cb2383512bF3031130FE72De491; 
    
    function RevenueShareContract() {
    
    }
    // 1. clients sends an amount to the contract
    // 2. contract sends share of rev to vendor1 60% and vendor2 40%
    
    function revToContract() payable {
            
    }
    
    function splitRevenue() payable {
        uint256 revinflow;
        revinflow = this.balance;
        vendor1.transfer(3*revinflow/5); // 60% to vendor1
        vendor2.transfer(2*revinflow/5); // 40% to vendor2 
    }
}
