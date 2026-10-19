// Node.js port of the COBOL Student Account Management System.
// main.cob -> main(), operations.cob -> operations(), data.cob -> DataStore.
const readline = require('readline');

const INITIAL_BALANCE = 1000.0;
const MAX_AMOUNT = 999999.99; // PIC 9(6)V99

// data.cob: in-memory storage with READ / WRITE
class DataStore {
  constructor(balance = INITIAL_BALANCE) { this.storageBalance = balance; }
  read() { return this.storageBalance; }
  write(balance) { this.storageBalance = balance; }
}

const format = (n) => n.toFixed(2).padStart(9, '0');

function parseAmount(input) {
  const amount = Number(String(input).trim());
  if (!Number.isFinite(amount) || amount < 0 || amount > MAX_AMOUNT) return null;
  return Math.round(amount * 100) / 100;
}

// operations.cob: TOTAL / CREDIT / DEBIT
function viewBalance(store) {
  return `Current balance: ${format(store.read())}`;
}

function creditAccount(store, amount) {
  const balance = Math.round((store.read() + amount) * 100) / 100;
  store.write(balance);
  return `Amount credited. New balance: ${format(balance)}`;
}

function debitAccount(store, amount) {
  const balance = store.read();
  if (balance < amount) return 'Insufficient funds for this debit.';
  const next = Math.round((balance - amount) * 100) / 100;
  store.write(next);
  return `Amount debited. New balance: ${format(next)}`;
}

const MENU = [
  '--------------------------------',
  'Account Management System',
  '1. View Balance',
  '2. Credit Account',
  '3. Debit Account',
  '4. Exit',
  '--------------------------------',
].join('\n');

// main.cob: menu loop
async function main(input = process.stdin, output = process.stdout) {
  const rl = readline.createInterface({ input, terminal: false });
  const lines = rl[Symbol.asyncIterator]();
  const ask = async (q) => { output.write(q); const { value, done } = await lines.next(); return done ? '4' : value; };
  const store = new DataStore();
  let running = true;
  while (running) {
    output.write(MENU + '\n');
    const choice = (await ask('Enter your choice (1-4): ')).trim();
    switch (choice) {
      case '1': output.write(viewBalance(store) + '\n'); break;
      case '2': case '3': {
        const label = choice === '2' ? 'credit' : 'debit';
        const amount = parseAmount(await ask(`Enter ${label} amount: `));
        if (amount === null) { output.write('Invalid amount.\n'); break; }
        output.write((choice === '2' ? creditAccount : debitAccount)(store, amount) + '\n');
        break;
      }
      case '4': running = false; break;
      default: output.write('Invalid choice, please select 1-4.\n');
    }
  }
  output.write('Exiting the program. Goodbye!\n');
  rl.close();
}

if (require.main === module) main();

module.exports = { DataStore, viewBalance, creditAccount, debitAccount, parseAmount, format, main, INITIAL_BALANCE };
