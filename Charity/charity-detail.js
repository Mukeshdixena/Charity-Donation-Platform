const token = localStorage.getItem('token');
function getCharityId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchCharityDetails(charityId) {
    try {
        const charityOrgId = charityId;
        const response = await axios.get(`${CONFIG.API_BASE_URL}/api/getCharityOrgById/${charityOrgId}`);
        const charity = response.data;

        const charityDetail = document.getElementById('charity-detail');
        charityDetail.innerHTML = `
            <h1>${charity.name}</h1>
            <p><strong>Category:</strong> ${charity.category}</p>
            <p><strong>Location:</strong> ${charity.location}</p>
            <p><strong>Required Amount:</strong> ${charity.requiredAmount}</p>
            <p>${charity.description}</p>
            
        `;
    } catch (error) {
        console.error('Error fetching charity details:', error);
        document.getElementById('charity-detail').innerHTML = '<p>Failed to load charity details.</p>';
    }
}

const charityId = getCharityId();
if (charityId) {
    fetchCharityDetails(charityId);
} else {
    document.getElementById('charity-detail').innerHTML = '<p>Invalid charity ID.</p>';
}


function updateDonationHistory(donations) {
    const donationHistoryDiv = document.getElementById('donation-history');
    donationHistoryDiv.innerHTML = '';
    if (donations.length === 0) {
        donationHistoryDiv.innerHTML = '<p>No donations found.</p>';
        return;
    }

    donations.forEach(donation => {
        const donationItem = document.createElement('div');
        donationItem.classList.add('donation-item');

        const donationAmount = document.createElement('p');
        donationAmount.innerHTML = `<span class="donation-amount">$${donation.amountDonated}</span> donated by user ID: ${donation.userId}`;
        donationItem.appendChild(donationAmount);

        const donationDate = document.createElement('p');
        donationDate.textContent = `Date: ${new Date(donation.createdAt).toLocaleDateString()}`;
        donationItem.appendChild(donationDate);

        donationHistoryDiv.appendChild(donationItem);
    });
}

async function fetchDonationHistory() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/getDonationByUser`, { headers: { "Authorization": token } });
        if (!response.ok) {
            throw new Error('Failed to fetch donation history');
        }
        const donations = await response.json();
        updateDonationHistory(donations);
    } catch (error) {
        console.error(error);
        document.getElementById('donation-history').innerHTML = '<p>Error loading donation history.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchDonationHistory);