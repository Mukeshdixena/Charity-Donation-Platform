
async function loadCharities() {
    try {
        const response = await axios.get(`${CONFIG.API_BASE_URL}/api/getCharityOrgs`);
        const charities = response.data;
        const charityList = document.getElementById('charity-list');
        charityList.innerHTML = '';

        charities.forEach((charity, index) => {
            const card = document.createElement('div');
            card.classList.add('charity-card');

            const charityName = document.createElement('h3');
            charityName.textContent = "Name: " + charity.name;
            card.appendChild(charityName);

            const charityRequiredAmount = document.createElement('p');
            charityRequiredAmount.textContent = "Required Amount: " + charity.requiredAmount;
            card.appendChild(charityRequiredAmount);

            const category = document.createElement('p');
            category.textContent = "category: " + charity.category;
            card.appendChild(category);

            const location = document.createElement('p');
            location.textContent = "location: " + charity.location;
            card.appendChild(location);

            const charityDesc = document.createElement('p');
            charityDesc.textContent = charity.description;
            card.appendChild(charityDesc);

            const donateButton = document.createElement('button');
            donateButton.textContent = 'Donate Now';
            donateButton.onclick = () => handleDonate(index);
            card.appendChild(donateButton);

            charityList.appendChild(card);
        });
    } catch (error) {
        console.error('There was an error loading charities:', error);
    }
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

function handleDonate(index) {
    alert(`Thank you for choosing to donate!`);
}

document.getElementById('create-charity-btn').addEventListener('click', () => {
    document.getElementById('charity-modal').style.display = 'flex';
});

function closeModal() {
    document.getElementById('charity-modal').style.display = 'none';
}

window.onload = loadCharities;
