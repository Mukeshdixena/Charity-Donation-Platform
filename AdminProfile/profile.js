
const token = localStorage.getItem('token');
const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));

async function getUserProfile() {
    try {
        console.log("working");
        console.log(token);
        const response = await axios.get(`${CONFIG.API_BASE_URL}/api/getUserById`,
            { headers: { "Authorization": token } }
        );
        const user = response.data;
        if (user.isAdmin) {
            document.querySelectorAll('.admin').forEach(element => {
                element.style.display = 'block';
            });
        }
        console.log(user)
        displayProfile(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
}

function displayProfile(user) {
    console.log(user);
    document.getElementById('user-name').innerText = user.username;
    document.getElementById('user-email').innerText = user.email;
    document.getElementById('user-contact').innerText = user.contact;
}

document.getElementById('edit-profile-btn').addEventListener('click', () => {
    populateForm();
    profileModal.show();
});

function populateForm() {
    document.getElementById('editName').value = document.getElementById('user-name').innerText;
    document.getElementById('editEmail').value = document.getElementById('user-email').innerText;
    document.getElementById('editContact').value = document.getElementById('user-contact').innerText;
}

document.getElementById('save-profile-btn').addEventListener('click', async () => {
    const updatedProfile = {
        username: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        contact: document.getElementById('editContact').value
    };

    try {
        await axios.patch(`${CONFIG.API_BASE_URL}/api/editUser`, updatedProfile, { headers: { "Authorization": token } });
        profileModal.hide();
        getUserProfile();
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
});
getUserProfile();

(async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("orderId");

    if (orderId) {
        console.log(orderId);
        await fetchPaymentStatus(orderId);
    }
})();

async function fetchPaymentStatus(orderId) {
    try {
        const response = await axios.get(`${CONFIG.API_BASE_URL}/payment/paymentStatus/${orderId}`);

        let status = response.data.data[0]?.payment_status;
        const amountDonated = response.data.data[0]?.payment_amount;
        const charityOrgId = JSON.parse(localStorage.getItem('selectedCharity')).id;

        if (status === 'SUCCESS') {

            try {
                const paymentId = orderId;
                await axios.post(`${CONFIG.API_BASE_URL}/api/postDonation`, { paymentId, amountDonated, charityOrgId }, { headers: { "Authorization": token } });

                const response = await axios.post(`${CONFIG.API_BASE_URL}/donation/confirmation`,
                    {
                        orderId, amountDonated, charityOrgId
                    },
                    {
                        headers: { "Authorization": token }
                    });

                console.log(response);
                window.location.href = '../Charity/Profile.html';

            } catch (error) {

                console.error("Error fetching on post donation:", error);
            }
            console.log("success");
        }
    } catch (error) {
        console.error("Error fetching payment status:", error);
    }
}


function updateDonationHistory(donations) {
    const donationHistoryDiv = document.getElementById('donation-history');
    donationHistoryDiv.innerHTML = ''; // Clear existing content

    if (donations.length === 0) {
        donationHistoryDiv.innerHTML = '<p>No donations found.</p>';
        return;
    }

    donations.forEach(donation => {
        const donationItem = document.createElement('div');
        donationItem.classList.add('donation-item');

        const donationAmount = document.createElement('p');
        donationAmount.innerHTML = `<span class="donation-amount">$${donation.amountDonated}</span> donated to Charity ID: ${donation.charityOrgId}`;
        donationItem.appendChild(donationAmount);

        const donationDate = document.createElement('p');
        donationDate.textContent = `Date: ${new Date(donation.createdAt).toLocaleDateString()}`;
        donationItem.appendChild(donationDate);

        donationHistoryDiv.appendChild(donationItem);
    });
}

async function fetchDonationHistory() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/getDonations`);
        if (!response.ok) {
            throw new Error('Failed to fetch donation history');
        }
        const donations = await response.json();
        updateDonationHistory(donations);
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', fetchDonationHistory);

async function downloadDonationReport() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${CONFIG.API_BASE_URL}/api/getDonationFile`, {
            headers: { "Authorization": token }
        });

        if (response.data && response.data.fileUrl) {
            window.open(response.data.fileUrl, "_blank");
        } else {
            console.error("File URL not found in response:", response);
        }
        await fetchDownloadList();
    } catch (error) {
        console.error("Error fetching expense file:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Replace this with your actual API endpoint
        const response = await axios.get(`${CONFIG.API_BASE_URL}/api/getCharityOrgs`);
        const charities = response.data;
        console.log(charities);

        const unverifiedTableBody = document.getElementById("charity-unverified-list-body");
        const verifiedTableBody = document.getElementById("charity-verified-list-body");
        let k = 1;
        charities.forEach((charity, index) => {

            if (charity.isVerified) {

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${k++}</td>
                    <td>${charity.name}</td>
                    <td>${charity.description}</td>
                    <td>$${charity.requiredAmount.toLocaleString()}</td>
                  
                `;

                verifiedTableBody.appendChild(row);
            } else {

                const row2 = document.createElement("tr");
                row2.innerHTML = `
                <td>${k++}</td>
                <td>${charity.name}</td>
                <td>${charity.description}</td>
                <td>$${charity.requiredAmount.toLocaleString()}</td>
                <td>
                <button class="btn btn-primary btn-sm" onclick="verify('${charity.id}', '${charity.name}')">
                verify
                </button>
                </td>
                `;
                unverifiedTableBody.appendChild(row2);
            }
        });
    } catch (error) {
        console.error("Error fetching charity data:", error);
    }
});
async function verify(charityOrgId, charityName) {
    console.log(`verify to: ${charityName} (ID: ${charityOrgId})`);

    const response = await axios.post(`${CONFIG.API_BASE_URL}/api/postCharityOrgVerified/${charityOrgId}`);

    location.reload();

}