import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

// Create account
export const createAccount = () => {
  const pair = StellarSdk.Keypair.random();

  return {
    publicKey: pair.publicKey(),
    secret: pair.secret(),
  };
};

// Get balance
export const getBalance = async (publicKey) => {
  try {
    const account = await server.loadAccount(publicKey);
    return account.balances;
  } catch (error) {
    console.error(error);
    alert("Account not funded!");
    return [];
  }
};

// Send XLM
export const sendXLM = async (secret, destination) => {
  try {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(secret);

    const account = await server.loadAccount(sourceKeypair.publicKey());

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destination,
          asset: StellarSdk.Asset.native(),
          amount: "10",
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);

    await server.submitTransaction(transaction);

    alert("✅ Transaction Successful!");
  } catch (error) {
    console.error(error);
    alert("❌ Transaction Failed!");
  }
};