pragma solidity ^0.4.8;

contract RevenueShareContract {
    
    address vendor1 ;//= 0xA774D5eE6294ab782c1d099F5D5ed7666B3E1767; 
    address vendor2 ;//= 0xEb3d454BC0d25A5f7955C2FFe1cD398A2cD159eF; 
    
    function getbalance() returns (uint balance){
     balance=this.balance;
    }

    function RevenueShareContract() {
    
    }
    // 1. clients sends an amount to the contract
    // 2. contract sends share of rev to vendor1 60% and vendor2 40%
    
    function revToContract() payable {
            
    }

    function splitRevenue(address _vendor1,address _vendor2) payable {
        vendor1=_vendor1;
        vendor2=_vendor2;
        uint256 revinflow;
        revinflow = this.balance;
        vendor1.transfer(3*revinflow/5); // 60% to vendor1
        vendor2.transfer(2*revinflow/5); // 40% to vendor2 
    }
}
