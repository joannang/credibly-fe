# Workflow

1. Deploy System.sol

1. Creating Organisation
    - Create a new Organisation Contract on System.sol: registerOrganisation(name of Organisation : string, UEN of Organisation : string, address of admin : address)

1. Create new Certificate NFT contract for a specific Organisation
    - Get the Organisation Contract on System.sol: getOrganisation(UEN of Organisation: string) returns Organisation contract address
    - Create a new Certificate Contract on Organisation.sol: addCertificate(name of Certificate: string, Certificate ID: string)

1. Mint a Certificate NFT for a specific Organisation
    - Get the Organisation Contract on System.sol: getOrganisation(UEN of Organisation : string) returns (Organisation Contract : address)
    - Mint a new Certificate NFT on Organisation.sol: awardCertificate(email of Employee: string, Certificate ID: string, IPFS Hash: string)

1. Get Employee Certificate in an Organisation by Email
    - Get : string) the Organisation Contract on System.sol: getOrganisation(UEN of Organisation : string) returns Organisation contract address
    - Get all Employee Certificates on Organisation.sol: getEmployeeCertificates( email of Employee: string) returns list of Employee Certificates as (Certificate : address, tokenID: int)
    - Get IPFS Hash of Certificate on Certificate.sol: tokenURI(tokenID: int) returns (IPSH Hash


