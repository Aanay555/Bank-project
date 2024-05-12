#! /usr/bin/env node
import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";
class customer {
    firstname;
    lastname;
    age;
    gender;
    mobileNumber;
    AccNumber;
    constructor(fName, Lname, age, gender, mob, account) {
        this.firstname = fName;
        this.lastname = Lname;
        this.age = age;
        this.gender = gender;
        this.mobileNumber = mob;
        this.AccNumber = account;
    }
}
//bank class
class bank {
    customer = [];
    account = [];
    addcustmer(object) {
        this.customer.push(object);
    }
    addAccountNo(object) {
        this.account.push(object);
    }
    //accobject is a new account for updation
    transactions(accobject) {
        let newAccount = this.account.filter((acc) => acc.AccNumber !== accobject.AccNumber);
        this.account = [...newAccount, accobject];
    }
}
let meezanBank = new bank();
//create custmer
for (let i = 1; i <= 5; i++) {
    let Fname = faker.person.firstName('male');
    let lastName = faker.person.lastName();
    let phonNum = parseInt(faker.string.numeric('68######'));
    const cust = new customer(Fname, lastName, 27 * i, "male", phonNum, 1000 + i);
    meezanBank.addcustmer(cust);
    meezanBank.addAccountNo({ AccNumber: cust.AccNumber, Balance: 20000 * i });
}
//bank functionality
async function bankservice(meezanBank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please select the service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        });
        //view balance
        if (service.select == "View Balance") {
            let userResponse = await inquirer.prompt({
                type: "input",
                name: "number",
                message: " Please Enter your Account Number"
            });
            let account = meezanBank.account.find((accon) => accon.AccNumber == userResponse.number);
            if (!account) {
                console.log(chalk.bold.yellow("Invalid Account Number."));
            }
            if (account) {
                let name = meezanBank.customer.find((item) => item.AccNumber == account?.AccNumber);
                console.log(`Dear ${chalk.bold.red(name?.firstname)} ${chalk.bold.green(name?.lastname)} your account Balance is ${chalk.bold.red(`$${account.Balance}`)}`);
            }
        }
        //cash withdraw
        if (service.select == "Cash Withdraw") {
            let userResponse = await inquirer.prompt({
                type: "input",
                name: "number",
                message: " Please Enter your Account Number"
            });
            let account = meezanBank.account.find((accon) => accon.AccNumber == userResponse.number);
            if (!account) {
                console.log(chalk.bold.yellow("###### Invalid Account Number ######"));
            }
            if (account) {
                let answer = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Enter Your Amount",
                });
                if (answer.rupee > account.Balance) {
                    console.log(chalk.bold.red("******* amount is unsufficient *******"));
                }
                //minus balance
                let newbalance = account.Balance - answer.rupee;
                // transaction method
                meezanBank.transactions({ AccNumber: account.AccNumber, Balance: newbalance });
                // console.log(newbalance);
            }
        }
        //cash deposite
        if (service.select == "Cash Deposit") {
            {
                let userResponse = await inquirer.prompt({
                    type: "input",
                    name: "number",
                    message: " Please Enter your Account Number"
                });
                let account = meezanBank.account.find((accon) => accon.AccNumber == userResponse.number);
                if (!account) {
                    console.log(chalk.bold.yellow("##### Invalid Account Number #####"));
                }
                if (account) {
                    let answer = await inquirer.prompt({
                        type: "number",
                        name: "rupee",
                        message: "Enter Your Amount",
                    });
                    //add balance
                    let newbalance = account.Balance + answer.rupee;
                    // transaction method call
                    meezanBank.transactions({ AccNumber: account.AccNumber, Balance: newbalance });
                    console.log(newbalance);
                }
            }
        }
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
bankservice(meezanBank);
