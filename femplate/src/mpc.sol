// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract MPC {
    mapping(address => bool) public isOwner;
    mapping(address => bool) public approved;
    mapping(address => bool) private hasApproved;
    mapping(address => uint256) private lastApprovedAt;

    mapping(address => address[3]) public Guardians;

    event GuardianAdded(address indexed owner, address[3] guardians);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    function ownerInput(address[3] memory _owners) public {
        require(_owners.length > 0 && _owners.length <= 3, "owners required");
        Guardians[msg.sender] = _owners;

        emit GuardianAdded(msg.sender, _owners);
    }

    function getGuardians(
        address owner
    ) public view returns (address[3] memory) {
        return Guardians[owner];
    }

    function setApproval(address guardian) public {
        require(!hasApproved[guardian], "guardian already approved");
        require(
            block.timestamp >= lastApprovedAt[guardian] + 10 minutes,
            "guardian needs to wait before approving again"
        );

        approved[guardian] = true;
        hasApproved[guardian] = true;
        lastApprovedAt[guardian] = block.timestamp;
    }

    function getApproval(address guardian) public view returns (bool) {
        return hasApproved[guardian];
    }

    function clearOwners(address owner) public onlyOwner {
        delete Guardians[owner];
    }

    function clearApproval(address guardian) public {
        require(
            block.timestamp >= lastApprovedAt[guardian] + 5 minutes,
            "Cannot clear approval before 5 minutes"
        );

        if (approved[guardian] && hasApproved[guardian]) {
            address[3] memory guardians = Guardians[msg.sender];
            bool allApproved = true;

            for (uint256 i = 0; i < guardians.length; i++) {
                if (!approved[guardians[i]] || !hasApproved[guardians[i]]) {
                    allApproved = false;
                    break;
                }
            }

            if (allApproved) {
                lastApprovedAt[guardian] = block.timestamp + 20 minutes;
                hasApproved[guardian] = false;
            } else if (
                block.timestamp >= lastApprovedAt[guardian] + 5 minutes
            ) {
                hasApproved[guardian] = false;
            }
        }
    }
}
