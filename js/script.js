"use strict";

// Header part
const inputUser = document.querySelector(".login__form--username");
const inputPin = document.querySelector(".login__form--pin");
const loginBtn = document.querySelector(".login__form--btn");
const welcomeMessage = document.querySelector(".welcome__message");

// main app part
const mainAppContainer = document.querySelector(".main__app");

// balance
const balanceAmount = document.querySelector(".balance-amount");

// movement
const movementsContainer = document.querySelector(".main__app--movements");

// summary
const summaryIn = document.querySelector(".sumamry__in--amount");
const summaryOut = document.querySelector(".summary__out--amount");

// operations
const transferBtn = document.querySelector(".transfer-btn");
const inputTransferTo = document.querySelector(".transfer-to-input");
const inputTransferToAmount = document.querySelector(".transfer-amount-input");

const requestLoanBtn = document.querySelector(".request-loan-btn");
const inputRequestAmount = document.querySelector(".request-amount-input");

const closeAccountBtn = document.querySelector(".close-account-btn");
const inputCloseAccountUser = document.querySelector(".confirm__user--input");
const inputCloseAccountPin = document.querySelector(".confirm__pin--input");



const user1 = {
    owner: 'Beqa Tsiramua',
    age: 21,
    movements: [400, -100, 300, 700, -200, 1600, -500, -200, 500],
    pin: 1111,
}

const user2 = {
    owner: 'first and last',
    age: 20,
    movements: [-200, -500, 100, 300, -400],
    pin: 2222
}

const users = [user1, user2];
let currentUser = null;


const displayMovements = user => {
    movementsContainer.innerHTML = '';

    user.movements.forEach((el, ind)=> {
        const movementType = el > 0 ? 'deposit' : 'withdrawal';

        const movementsHtml = `
            <div class="main__app--movements-row">
                <div class="movements__type movements__type--${movementType}">${ind+1} ${movementType}</div>
                <div class="movements__date">3 days ago</div>
                <div class="movements__value">${el} €</div>
            </div>
        `

        movementsContainer.insertAdjacentHTML('afterbegin', movementsHtml);
    })
}

const calculateSummary = user => {
    summaryIn.textContent = `${user.movements.filter(mov=> mov > 0).reduce((acc, cur)=> acc + cur, 0)}€`
    summaryOut.textContent = `${Math.abs(user.movements.filter(mov=> mov < 0).reduce((acc, cur)=> acc + cur, 0))}€`
}

const calculateBalanceValue = user=> {
    user.balance = user.movements.reduce((acc, cur)=> acc + cur, 0);
    balanceAmount.textContent = `${user.balance} €`
}

const createUsernames = user=> {
    user.forEach(el=> {
        el.username = el.owner.toLowerCase().split(' ').map(user=> user[0]).join('');
    })
}

createUsernames(users);

const updateUI = user=> {
    displayMovements(user);
    calculateSummary(user);
    calculateBalanceValue(user);
}

loginBtn.addEventListener("click", function(e) {
    e.preventDefault();

    currentUser = users.find(user=> user.username === inputUser.value.toLowerCase());
    welcomeMessage.textContent = `Good morning ${currentUser.owner.split(" ")[0]}`
    if (currentUser?.pin === +(inputPin.value)) {
        inputPin.style.borderColor = inputUser.style.borderColor = '#fff';
        updateUI(currentUser);
        mainAppContainer.style.opacity = 100;
    } else {
        inputPin.style.borderColor = inputUser.style.borderColor = 'red';
    }

    inputUser.value = inputPin.value = null;
})

transferBtn.addEventListener("click", e=> {
    e.preventDefault();

    const transferAmount = +(inputTransferToAmount.value);
    const recieverUser = users.find(user=> user.username === inputTransferTo.value);

    if (transferAmount > 0 && recieverUser && recieverUser?.username !== currentUser.username && transferAmount < currentUser.balance) {
        recieverUser.movements.push(transferAmount);
        currentUser.movements.push(-transferAmount);
        updateUI(currentUser);
    }
    inputTransferTo.value = inputTransferToAmount.value = null;
})


requestLoanBtn.addEventListener("click", e=> {
    e.preventDefault();

    const requestAmount = +(inputRequestAmount.value);
    if (currentUser.balance > requestAmount && requestAmount > 0) {
        currentUser.movements.push(requestAmount);
        updateUI(currentUser);
    }
    inputRequestAmount.value = '';
})

closeAccountBtn.addEventListener("click", e=> {
    e.preventDefault();

    const currentUserIndex = users.findIndex(user=> user.username === currentUser.username && user.pin === currentUser.pin);
    if (currentUser.username === inputCloseAccountUser.value && currentUser.pin === +(inputCloseAccountPin.value)) {
        users.splice(currentUserIndex, 1);
        mainAppContainer.style.opacity = 0;
    }
    console.log(users);
})