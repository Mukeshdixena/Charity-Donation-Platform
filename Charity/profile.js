
const token = localStorage.getItem('token');
const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));

// Get user profile (GET request using async/await)
async function getUserProfile() {
    try {
        console.log("working");
        console.log(token);
        const response = await axios.get(`${CONFIG.API_BASE_URL}/api/getUserById`,
            { headers: { "Authorization": token } }
        );  // Replace with your API
        const user = response.data;
        console.log(user)
        displayProfile(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
}

// Display user profile
function displayProfile(user) {
    console.log(user);
    document.getElementById('user-name').innerText = user.username;
    document.getElementById('user-email').innerText = user.email;
    document.getElementById('user-contact').innerText = user.contact;
}

// Open modal to edit profile
document.getElementById('edit-profile-btn').addEventListener('click', () => {
    populateForm();
    profileModal.show();
});

// Populate form with current profile data
function populateForm() {
    document.getElementById('editName').value = document.getElementById('user-name').innerText;
    document.getElementById('editEmail').value = document.getElementById('user-email').innerText;
    document.getElementById('editContact').value = document.getElementById('user-contact').innerText;
}

// Save updated profile (PUT request)
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
            const token = localStorage.getItem('token');
            try {
                const paymentId = orderId;
                await axios.post(`${CONFIG.API_BASE_URL}/api/postDonation`, { paymentId, amountDonated, charityOrgId }, { headers: { "Authorization": token } });

                // window.location.href = '../Charity/Profile.html';


            } catch (error) {

                console.error("Error fetching on post donation:", error);
            }
            console.log("success");
        }
    } catch (error) {
        console.error("Error fetching payment status:", error);
    }
}