# gherkin-easy

Minimalistic Gherkin testing for JavaScript

[![Build Status](https://travis-ci.org/eezing/gherkin-easy.svg?branch=master)](https://travis-ci.org/eezing/gherkin-easy)

## Prerequisites

- Node.js v6 +
- Test runner such as [Jest](https://facebook.github.io/jest) or [Mocha](https://mochajs.org)

## Install

    $ npm install gherkin-easy

## Getting Started

1. Create a gherkin feature file:

```gherkin

# ./withdraw-cash.feature

Feature: Withdraw Cash

    Scenario Outline: Withdraw cash from bank account
        Given my account balance is <startingBalance> dollars
        When I withdraw <withdrawAmount> dollars from my account
        Then my account should have a remaining balance of <remainingBalance> dollars

        Examples:
            | startingBalance | withdrawAmount | remainingBalance |
            | 100             | 50             | 50               |
            | 100             | 0              | 100              |
            | 100             | 1.25           | 98.75            |
            | 1               | 0.50           | 0.50             |
            | 1               | 5.00           | -4.00            |

```

2. Create feature code:

```javascript

// ./bank-account.js

class BankAccount {

    constructor(balance = 0) {
        this.balance = balance;
        this.withdraw = this.withdraw.bind(this);
    }

    withdraw(amt = 0) {
        this.balance = this.balance - amt;
        return amt;
    }

    getBalance() {
        return this.balance;
    }
}

module.exports = BankAccount;

```

3. Create test code:

```javascript

// ./__tests__/withdraw-cash-test.js

const FeatureTest = require('gherkin-easy');
const BankAccount = require('../bank-account');
const featureTest = new FeatureTest('../withdraw-cash.feature');

featureTest.run(({ given, when, then, example }) => {

    let account;

    beforeAll(() => {
        account = new BankAccount(example.startingBalance);
    });

    test(given, () => {
        expect(account.getBalance()).toBe(example.startingBalance);
    });

    test(when, () => {
        expect(account.withdraw(example.withdrawAmount)).toBe(example.withdrawAmount);
    });

    test(then, () => {
        expect(account.getBalance()).toBe(example.remainingBalance);
    });
});

```

4. Run test (using Jest CLI in this example):

``` $ jest ``` -->

```shell

PASS  examples/__tests__/withdraw-cash-test.js
 Feature: Withdraw Cash
   Scenario: Withdraw cash from bank account | Example 1
     ✓ Given my account balance is 100 dollars (2ms)
     ✓ When I withdraw 50 dollars from my account
     ✓ Then my account should have a remaining balance of 50 dollars
   Scenario: Withdraw cash from bank account | Example 2
     ✓ Given my account balance is 100 dollars
     ✓ When I withdraw 0 dollars from my account
     ✓ Then my account should have a remaining balance of 100 dollars (1ms)
   Scenario: Withdraw cash from bank account | Example 3
     ✓ Given my account balance is 100 dollars
     ✓ When I withdraw 1.25 dollars from my account
     ✓ Then my account should have a remaining balance of 98.75 dollars (1ms)
   Scenario: Withdraw cash from bank account | Example 4
     ✓ Given my account balance is 1 dollars
     ✓ When I withdraw 0.5 dollars from my account
     ✓ Then my account should have a remaining balance of 0.5 dollars
   Scenario: Withdraw cash from bank account | Example 5
     ✓ Given my account balance is 1 dollars
     ✓ When I withdraw 5 dollars from my account
     ✓ Then my account should have a remaining balance of -4 dollars
  ```
