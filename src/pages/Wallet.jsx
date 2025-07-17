import { useContext, useEffect, useState } from "react";
import { storeContext } from "../assets/context/storeContext";
import { toast } from "react-toastify";
// import { Link } from "react-router-dom";

// import Spinner from "../assets/layout/Spinner";

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [fundAmount, setFundAmount] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

//   const   apiUrl  = import.meta.env.VITE_BACKEND_URL;
  const { token, apiUrl } =
      useContext(storeContext);

//   const token = localStorage.getItem("token");


  // Persisted transaction tab (all | fund | sent | received)
  const [selectedTab, setSelectedTab] = useState(
    localStorage.getItem("walletTab") || "all"
  );

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    localStorage.setItem("walletTab", tab);
  };

  // Fetch wallet data

  const fetchWallet = async () => {
    try {
      const res = await fetch(`${apiUrl}/wallet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch wallet");
      const data = await res.json();
      setWallet(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wallet");
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // Fund wallet

  const handleFundWallet = async () => {
    if (!fundAmount || isNaN(fundAmount)) {
      return toast.error("Enter a valid amount");
    }

    try {
      const res = await fetch(`${apiUrl}/wallet/fundwallet`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: fundAmount }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error funding wallet");

      toast.success(data.message);
      setFundAmount("");
      fetchWallet();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  // Send money

  const handleSendMoney = async () => {
    if (!sendAmount || !recipientEmail || isNaN(sendAmount)) {
      return toast.error("Enter valid input");
    }

    try {
      const res =  await fetch(`${apiUrl}/wallet/sendmoney`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: sendAmount,
          recipientEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Transfer failed");

      toast.success(data.message);
      setSendAmount("");
      setRecipientEmail("");
      fetchWallet();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  // Filtered transactions

  const filteredTransactions = [
    ...(wallet?.transactionsReceived || []),
    ...(wallet?.transactionsSent || []),
  ]
    .filter((tx) => (selectedTab === "all" ? true : tx.type === selectedTab))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">💼 My Wallet</h2>

      {/* Balance */}
      <div className="bg-white shadow rounded-xl p-4 mb-6 text-center">
        <h3 className="text-sm text-gray-500">Available Balance</h3>
        <p className="text-2xl font-bold text-green-600">
          ₦
          {wallet?.balance?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Fund wallet */}
      <div className="bg-white shadow rounded-xl p-4 mb-6">
        <h4 className="font-semibold mb-2">Fund Wallet</h4>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="number"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            placeholder="Enter amount"
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleFundWallet}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Fund
          </button>
        </div>
      </div>

      {/* Send money */}
      <div className="bg-white shadow rounded-xl p-4 mb-6">
        <h4 className="font-semibold mb-2">Send Money</h4>
        <input
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="Recipient email"
          className="border px-3 py-2 rounded w-full mb-2"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="number"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            placeholder="Enter amount"
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleSendMoney}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </div>

      {/* Transaction filter tabs */}
      <div className="bg-white shadow rounded-xl p-4">
        <h4 className="font-semibold mb-2">Transaction History</h4>

        <div className="flex gap-2 mb-4 text-sm">
          {["all", "fund", "sent", "received"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-3 py-1 rounded-full ${
                selectedTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab === "all"
                ? "All"
                : tab === "fund"
                ? "Funded"
                : tab === "sent"
                ? "Sent"
                : "Received"}
            </button>
          ))}
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions found.</p>
        ) : (
          <ul className="text-sm space-y-2 max-h-64 overflow-y-auto">
            {filteredTransactions.map((tx, index) => (
              <li
                key={index}
                className="border p-2 rounded flex justify-between items-center"
              >
                <span>
                  {tx.type === "fund"
                    ? "💰 Funded"
                    : tx.type === "send"
                    ? "📤 Sent"
                    : "📥 Received"}
                </span>
                <span>₦{tx.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Wallet;
