// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Database {
    address payable owner;

    //+-The Message Struct Stores the single Chat Message and its MetaData:_
    struct message {
        address sender;
        address receiver;
        uint256 timestamp;
        string msg;
    }

    //+-Collection of Messages communicated in a Channel between 2 Users:_
    mapping(bytes32 => message[]) allMessages; // key : Hash(user1,user2)

    constructor() {
        owner = payable(msg.sender);
       }

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    function getOwner() public view virtual returns (address) {
        return owner;
    }

    //+-Returns a unique code for the channel created between the two users:_
    // Hash(key1,key2) where key1 is lexicographically smaller than key2
    function _getChatCode(address pubkey1, address pubkey2)
        internal
        pure
        returns (bytes32)
    {
        if (pubkey1 < pubkey2)
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        else return keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    //+-Sends a new message to a given friend:_
    function sendMessage(address friend_address, string calldata _msg)
        public
        payable
    {
        bytes32 chatCode = _getChatCode(msg.sender, friend_address);
        message memory newMsg = message(msg.sender, friend_address, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    //+-Returns all the chat messages communicated in a channel:_
    function readMessages(address friend_address)
        external
        view
        returns (message[] memory)
    {
        bytes32 chatCode = _getChatCode(msg.sender, friend_address);
        return allMessages[chatCode];
    }
}