document.getElementById('donationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;

    if (name && amount) {
        addDonation(name, amount);
        document.getElementById('donationForm').reset();
    }
});

function addDonation(name, amount) {
    const donationList = document.getElementById('donationList');

    const donation = document.createElement('div');
    donation.classList.add('donation');
    donation.innerHTML = `<strong>${name}</strong> donated <strong>$${amount}</strong>`;

    donationList.insertBefore(donation, donationList.firstChild);
}
