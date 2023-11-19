const cssFont = fetch(  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap").body;
const css = fetch(
  "https://gist.githubusercontent.com/armsves/128e3df2b069e2339ede8ba1aee1ac8f/raw/c30e36a5bccbb5b61d3a1357ed9a48ad8baca146/gistfile1.txt"
).body;

if (!cssFont || !css) return "";

if (!state.theme) {
  State.update({
    theme: styled.div`
    font-family: Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    ${cssFont}
    ${css}
`,
  });
}
const Theme = state.theme;

if (state.sender === undefined) {
  const accounts = Ethers.send("eth_requestAccounts", []);
  if (accounts.length) {
    State.update({ sender: accounts[0] });
    //console.log("set sender", accounts[0]);
  }
}

const contractAddress = "0x526922E0426d0705eCa8ace5dF50399654657bE0";
const sender = Ethers.send("eth_requestAccounts", [])[0];
const abi = fetch("https://api-sepolia.scrollscan.com/api?module=contract&action=getabi&address=0x526922E0426d0705eCa8ace5dF50399654657bE0");
if (!abi.ok) { return "Abi not found"; }

const messages = [
  {
    sender: '0x9567D433240681653fb4DD3E05e08D60fe54210d',
    receiver: '0x00f02f3a111D452C0DFbF576f09A4003b2F18284',
    timestamp: 1700351240,
    message: 'testing',
  },
  {
    sender: '0x00f02f3a111D452C0DFbF576f09A4003b2F18284',
    receiver: '0x9567D433240681653fb4DD3E05e08D60fe54210d',
    timestamp: 1700351277,
    message: 'testing2',
  },
  {
    sender: '0x9567D433240681653fb4DD3E05e08D60fe54210d',
    receiver: '0x00f02f3a111D452C0DFbF576f09A4003b2F18284',
    timestamp: 1700351289,
    message: 'testing3',
  },
  {
    sender: '0x00f02f3a111D452C0DFbF576f09A4003b2F18284',
    receiver: '0x9567D433240681653fb4DD3E05e08D60fe54210d',
    timestamp: 1700354758,
    message: 'hello fren',
  },
];

/*
const wEthContract = new ethers.Contract(contractAddress, abi.body.result, Ethers.provider().getSigner());
wEthContract.readMessages(sender).then((transactionHash) => {
  transactionHash.map((item, index) => (
    console.log('mensaje: '+item)
      ))
});
*/
const getSender = () => {
  return !state.sender
    ? ""
    : state.sender.substring(0, 6) +
        "..." +
        state.sender.substring(state.sender.length - 4, state.sender.length);
};

const prettyAddress = (address) => {
  const string = address.substring(0, 2) + "..." + address.substring(address.length - 4, address.length);
  return string
}

const hour = (unix_timestamp) => {
  var date = new Date(unix_timestamp * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var formattedTime = hours + ':' + minutes.substr(-2);
  return formattedTime
};

return (
  <Theme>
    <div class="background-green"></div>
    <div class="main-container">
      <div class="left-container">
        <div class="header">
          <div class="nav-icons">
          {state.sender ? ( <li> { prettyAddress(state.sender) }</li>) : ('')}
          <li>
            {!state.sender ? ( <Web3Connect connectLabel="Connect Wallet" />) : (<Web3Connect disconnectLabel="Disconnect"/>) }
        </li>
          </div>
        </div>
        <div class="search-container">
          <div class="input">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search or start new chat   " />
          </div>
          <i class="fa-sharp fa-solid fa-bars-filter"></i>
        </div>
        <div class="chat-list">
          <div class="chat-box active">
            <div class="chat-details">
              <div class="text-head">
                <h4>{
                state.sender.toLowerCase() === messages[0].sender.toLowerCase()
                ? prettyAddress(messages[0].receiver)
                : prettyAddress(messages[0].sender)
                }</h4>
                <p class="time">07:49</p>
              </div>
              <div class="text-message">
                <p>{messages[messages.length - 1].message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-container">
        <div class="header">
          <div class="img-text">
            <h4>
              {
                state.sender.toLowerCase() === messages[0].sender.toLowerCase()
                ? prettyAddress(messages[0].receiver)
                : prettyAddress(messages[0].sender)
                }
              <br />
              <span>Online</span>
            </h4>
          </div>
          <div class="nav-icons">
            <li><i class="fa-solid fa-magnifying-glass"></i></li>
            <li><i class="fa-solid fa-ellipsis-vertical"></i></li>
          </div>
        </div>
        <div class="chat-container">
          {
            messages.map((item, index) => {
              //console.log('sender '+sender.toLowerCase())
              //console.log('item.sender '+item.sender.toLowerCase())
              if (state.sender.toLowerCase().toString() == item.sender.toLowerCase().toString()) {
                return (
                  <div class="message-box my-message">
                  <p>
                    {item.message}
                    <br />
                    <span>{hour(item.timestamp)}</span>
                  </p>
                 </div>
                )
              } else if (state.sender.toString === item.receiver.toString) {
                return (
                <div class="message-box friend-message">
                <p>
                {item.message}
                  <br />
                  <span>{hour(item.timestamp)}</span>
                </p>
              </div>
            )
              }
            return null
          })
          }
        </div>
        <div class="chatbox-input">
          <i class="fa-regular fa-face-grin"></i>
          <i class="fa-sharp fa-solid fa-paperclip"></i>
          <input type="text" placeholder="Type a message" />
          <i class="fa-solid fa-microphone"></i>
        </div>
      </div>
    </div>
  </Theme>
);