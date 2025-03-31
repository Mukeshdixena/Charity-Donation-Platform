
const token = localStorage.getItem('token');
function filterCharities() {
    const categoryFilter = document.getElementById("filter-category").value;
    const locationFilter = document.getElementById("filter-location").value;

    const charityList = document.querySelectorAll(".charity-card");

    charityList.forEach(card => {
        const charityCategory = card.getAttribute("data-category");
        const charityLocation = card.getAttribute("data-location");

        const categoryMatch = categoryFilter === "" || charityCategory === categoryFilter;
        const locationMatch = locationFilter === "" || charityLocation === locationFilter;

        if (categoryMatch && locationMatch) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}


async function loadCharities() {
    try {
        const response = await axios.get(`${CONFIG.API_BASE_URL}/api/getCharityOrgs`);
        const charities = response.data;
        const charityList = document.getElementById('charity-list');
        charityList.innerHTML = '';

        charities.forEach((charity, index) => {
            if (!charity.isVerified) {
                return;
            }
            const card = document.createElement('div');
            card.classList.add('charity-card');

            card.setAttribute('data-category', charity.category);
            card.setAttribute('data-location', charity.location);

            const charityName = document.createElement('h3');
            charityName.textContent = "Name: " + charity.name;
            card.appendChild(charityName);

            const charityRequiredAmount = document.createElement('p');
            charityRequiredAmount.textContent = "Required Amount: " + charity.requiredAmount;
            card.appendChild(charityRequiredAmount);

            const category = document.createElement('p');
            category.textContent = "Category: " + charity.category;
            card.appendChild(category);

            const location = document.createElement('p');
            location.textContent = "Location: " + charity.location;
            card.appendChild(location);

            const charityDesc = document.createElement('p');
            charityDesc.textContent = charity.description;
            card.appendChild(charityDesc);

            const donateButton = document.createElement('button');
            donateButton.textContent = 'Donate Now';
            donateButton.onclick = (event) => {
                event.stopPropagation();
                handleDonate(charity);
            };
            card.appendChild(donateButton);

            card.addEventListener('click', () => {
                handleCardClick(charity.id);
            });

            charityList.appendChild(card);
        });
    } catch (error) {
        console.error('There was an error loading charities:', error);
    }
}

function handleCardClick(charityId) {
    window.location.href = `/Charity/charity-detail.html?id=${charityId}`;
}
async function addCharity() {
    const charityName = document.getElementById('charity-name').value;
    const charityDesc = document.getElementById('charity-desc').value;
    const requiredAmount = document.getElementById('requiredAmount').value;
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value;

    if (!charityName || !charityDesc || !requiredAmount || !category || !location) {
        alert('Please fill out all fields.');
        return;
    }

    const charityData = {
        name: charityName,
        description: charityDesc,
        requiredAmount: Number(requiredAmount),
        category: category,
        location: location
    };

    try {
        const response = await axios.post(`${CONFIG.API_BASE_URL}/api/postCharityOrg`, charityData);
        console.log('Charity added successfully:', response.data);
        loadCharities();
        closeModal();
    } catch (error) {
        console.error('Error adding the charity:', error);
    }
}

function handleDonate(charity) {
    localStorage.setItem('selectedCharity', JSON.stringify(charity));
    window.location.href = '../Donation/donation.html';
}


document.getElementById('create-charity-btn').addEventListener('click', () => {
    document.getElementById('charity-modal').style.display = 'flex';
});

function closeModal() {
    document.getElementById('charity-modal').style.display = 'none';
}

window.onload = loadCharities;



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
        donationAmount.innerHTML = `<span class="donation-amount">$${donation.amountDonated}</span> donated to Charity ID: ${donation.charityOrgId}  by User ID:  ${donation.userId}`;
        donationItem.appendChild(donationAmount);

        const donationDate = document.createElement('p');
        donationDate.textContent = `Date: ${new Date(donation.createdAt).toLocaleDateString()}`;
        donationItem.appendChild(donationDate);

        donationHistoryDiv.appendChild(donationItem);
    });
}

async function fetchDonationHistory() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/getDonations`, { headers: { "Authorization": token } }); // Adjust the URL as needed
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