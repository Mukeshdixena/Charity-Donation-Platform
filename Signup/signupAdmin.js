async function signup() {
    let hostkey = document.getElementById('hostkey').value;
    let username = document.getElementById('username').value;
    let currEmail = document.getElementById('email').value;
    let contact = document.getElementById('contact').value;
    let password = document.getElementById('password').value;

    if (!username || !currEmail || !password || !hostkey) {
        alert('All fields are required!');
        return;
    }

    try {
        const response = await axios.get(`${CONFIG.API_BASE_URL}/user`);

        const emailExists = response.data.some(({ email }) => email === currEmail);

        if (emailExists) {
            alert('This email already exists. Please sign in.');
            return;
        }

        await axios.post(`${CONFIG.API_BASE_URL}/adminUser`, { hostkey, username, email: currEmail, contact, password });
        window.location.href = '../Login/adminLogin.html';

    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred. Please try again later.');
    }
}
