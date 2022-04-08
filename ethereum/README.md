# Workflow

1. Deploy System.sol
    - Current deployment is at 0xC369c038b2A3808ADACfba0a2FAEE8e5e96C37b1

1. Creating Organisation
    - Create a new Organisation Contract on System.sol: registerOrganisation(name of Organisation : string, UEN of Organisation : string, address of admin : address)

1. Create new Certificate NFT contract for a specific Organisation
    - Get the Organisation Contract on System.sol: getOrganisation(UEN of Organisation: string) returns Organisation contract address
    - Create a new Certificate Contract on Organisation.sol: addCertificate(name of Certificate: string, Certificate ID: string)

1. Register an Employee to an Organisation
    - System.sol: registerEmployee(UEN of Organisation : string, email of Employee: string)

1. Mint a Certificate NFT for an Employee
    - Get the Organisation Contract on System.sol: getOrganisation(UEN of Organisation : string) returns (Organisation Contract : address)
    - Mint a new Certificate NFT on Organisation.sol: awardCertificate(email of Employee: string, Certificate ID: string, IPFS Hash: string)
