
const charity = JSON.parse(localStorage.getItem('selectedCharity'));

if (!charity) {
    alert('No charity data found!');
    window.location.href = '../Charity/CharityHome.html';
}

document.getElementById('charity-name').textContent = `Donating to: ${charity.name}`;
document.getElementById('charity-description').textContent = charity.description;
document.getElementById('required-amount').textContent = charity.requiredAmount;


const cashfree = Cashfree({
    mode: "sandbox",
});


async function submitDonation() {
    const donationAmount = document.getElementById('donation-amount').value;
    alert(`Thank you for donating ₹${donationAmount} to ${charity.name}!`);


    const responce = await axios.post(`${CONFIG.API_BASE_URL}/service/createOrder`, { amount: donationAmount });
    console.log(responce.data);
    let checkoutOptions = {
        paymentSessionId: responce.data.paymentSessionId,
        redirectTarget: "_self",
    };
    cashfree.checkout(checkoutOptions);

}


