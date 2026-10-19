// Unit tests mirroring docs/TESTPLAN.md
const { PassThrough } = require('stream');
const { DataStore, viewBalance, creditAccount, debitAccount, parseAmount, main } = require('./index');

describe('Student account (TESTPLAN)', () => {
  let store;
  beforeEach(() => { store = new DataStore(); });

  test('TC-001 view initial balance', () => {
    expect(viewBalance(store)).toBe('Current balance: 001000.00');
  });
  test('TC-002 credit valid amount', () => {
    expect(creditAccount(store, 100)).toBe('Amount credited. New balance: 001100.00');
    expect(store.read()).toBe(1100);
  });
  test('TC-003 credit zero amount', () => {
    creditAccount(store, 0);
    expect(store.read()).toBe(1000);
  });
  test('TC-004 debit valid amount', () => {
    expect(debitAccount(store, 50)).toBe('Amount debited. New balance: 000950.00');
    expect(store.read()).toBe(950);
  });
  test('TC-005 debit exact balance', () => {
    debitAccount(store, 1000);
    expect(store.read()).toBe(0);
  });
  test('TC-006 debit more than balance', () => {
    expect(debitAccount(store, 2000)).toBe('Insufficient funds for this debit.');
    expect(store.read()).toBe(1000);
  });
  test('TC-007 multiple operations', () => {
    creditAccount(store, 200);
    debitAccount(store, 300);
    expect(store.read()).toBe(900);
  });
  test('invalid amounts are rejected', () => {
    expect(parseAmount('-5')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('12.345')).toBe(12.35);
  });

  test('TC-008/TC-009 invalid choice then exit', async () => {
    const input = new PassThrough();
    const output = new PassThrough();
    let text = '';
    output.on('data', (d) => { text += d; });
    const done = main(input, output);
    input.write('9\n');
    input.write('4\n');
    await done;
    expect(text).toContain('Invalid choice, please select 1-4.');
    expect(text).toContain('Exiting the program. Goodbye!');
  });
});
