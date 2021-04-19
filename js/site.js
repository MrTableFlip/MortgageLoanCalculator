// getting the data
let balance = parseInt(document.getElementById("loanAmount").value);
let payTime = parseInt(document.getElementById("term").value) * 12;
let intRate = parseInt(document.getElementById("intRate").value);

//declaring needed variables
let monthPay = 0;
let totPrin = 0;
let paymentArray = [{
    month: "",
    payment: "",
    principal: "",
    interest: "",
    totalInterest: "",
    balance: "",
}];


//activates when the user clicks the button
function buildPaymentSchedule() {
    let totalInterPaid = 0;
    let payMonth = paymentArray;
    let remBal = balance;
    let counter = 1;
    monthPay = (balance) * (intRate / 1200) / (1 - Math.pow((1 + intRate / 1200), -payTime));

    //loop through and populate the Payment Array with all the info for each monthly payment
    for (let i = 0; i < payTime; i++) {
        //do the required math to find interest and balance for each monthly payment
        var obj = {};
        let interPay = calcInterest(remBal, intRate) / 1200;
        let prinPay = monthPay - interPay;
        totalInterPaid = totalInterPaid + interPay;
        totPrin += prinPay;
        remBal = remBal - prinPay;

        //push the calulated info into each row/month using "obj"
        obj['month'] = counter.toLocaleString();
        obj["payment"] = monthPay.toFixed(2).toLocaleString();
        obj["principal"] = prinPay.toFixed(2).toLocaleString();
        obj["interest"] = interPay.toFixed(2).toLocaleString();
        obj["totalInterest"] = totalInterPaid.toFixed(2).toLocaleString();
        obj["balance"] = remBal.toFixed(2).toLocaleString();

        payMonth.push(obj);

        localStorage.setItem("payArray", JSON.stringify(payMonth))

        counter++;
    }
    paymentArray.shift();
    displayData(paymentArray);
}

function calcInterest(balance, rate) {
    return balance * rate
}


//Display the data that is already in the Payment Array
function displayData(payArray) {
    //assign a value to the big "Monthly Payment" header in the calculator
    document.getElementById("mPay").textContent = "$" + monthPay.toLocaleString();

    //acquire the need HTML elements that will be written to
    const template = document.getElementById("mortData-Template");
    const mortBody = document.getElementById("mortBody");
    mortBody.innerHTML = "";
    //let totalInterPaid = 0;

    let curMonth = JSON.parse(localStorage.getItem("payArray")) || [];

    //make sure there actually is something in Payment Array
    if (curMonth.length == 0) {
        curMonth = payArray;
        localStorage.setItem("payArray", JSON.stringify(curMonth));
    }

    //Loop through the Payment Array and write it to the Data Template month by month
    for (var i = 1; i <= payArray.length; i++) {
        const monthRow = document.importNode(template.content, true);

        monthRow.getElementById("month").textContent = curMonth[i].month.toLocaleString();
        monthRow.getElementById("payment").textContent = "$" + curMonth[i].payment.toLocaleString();
        monthRow.getElementById("principal").textContent = "$" + curMonth[i].principal.toLocaleString();
        monthRow.getElementById("interest").textContent = "$" + curMonth[i].interest.toLocaleString();
        monthRow.getElementById("totalInterest").textContent = "$" + (curMonth[i].totalInterest).toLocaleString();
        monthRow.getElementById("balance").textContent = "$" + (Math.abs(parseFloat(curMonth[i].balance))).toLocaleString();

        mortBody.appendChild(monthRow);
    }
    let totalInterPaid = payArray[payArray.length - 1].totalInterest;

    //write the stats
    document.getElementById("princ").textContent = "$" + totPrin.toFixed(2).toLocaleLowerCase();
    document.getElementById("inter").textContent = "$" + parseFloat(totalInterPaid).toFixed(2);
    document.getElementById("cost").textContent = "$" + (totPrin + parseFloat(totalInterPaid)).toFixed(2).toLocaleLowerCase();
}