import { useState } from "react";
import { createAccount, getBalance, sendXLM } from "./stellar";

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState([]);
  const [destination, setDestination] = useState("");

  // Create account
  const handleCreate = () => {
    const acc = createAccount();
    setAccount(acc);
  };

  // Get balance
  const handleBalance = async () => {
    if (!account) {
      alert("⚠️ Create account first!");
      return;
    }

    const bal = await getBalance(account.publicKey);
    setBalance(bal);
  };

  // Send XLM
  const handleSend = async () => {
    if (!account) {
      alert("⚠️ Create account first!");
      return;
    }

    if (!destination || destination.trim() === "") {
      alert("⚠️ Enter destination!");
      return;
    }

    await sendXLM(account.secret, destination);
    setDestination(""); // clear input
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🚀 Stellar Wallet App</h1>

      <button onClick={handleCreate}>Create Account</button>
      <button onClick={handleBalance}>Check Balance</button>

      {account && (
        <div style={{ marginTop: "20px" }}>
          <p><b>Public Key:</b> {account.publicKey}</p>
          <p><b>Secret Key:</b> {account.secret}</p>
        </div>
      )}

      <h3>💰 Balance</h3>
      <ul>
        {balance.map((b, i) => (
          <li key={i}>{b.balance} XLM</li>
        ))}
      </ul>

      <h3>💸 Send XLM</h3>
      <input
        type="text"
        placeholder="Enter destination address"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <br /><br />
      <button onClick={handleSend}>Send 10 XLM</button>
    </div>
  );
}

export default App;
