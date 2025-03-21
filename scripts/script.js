const firebaseConfig = {
    apiKey: "AIzaSyDwfRfrhv_1PkU_5WCniJe26Gt3IPjzfE0",
    authDomain: "fir-form-90a51.firebaseapp.com",
    projectId: "fir-form-90a51",
    storageBucket: "fir-form-90a51.firebasestorage.app",
    messagingSenderId: "899326510689",
    appId: "1:899326510689:web:7eeba80e86ca486429cc20",
    measurementId: "G-060LX27S92"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

document.getElementById('signup-form').addEventListener('submit', (event) => {
    event.preventDefault();
    let hasErrors = false;

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const birthday = document.getElementById('birthday');

    clearErrors();

    // Username validation
    if (username.value.trim().length < 3) {
        showError(username, 'Username must be at least 3 characters');
        hasErrors = true;
    }

    if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        hasErrors = true;
    }

    if (password.value.length < 8) {
        showError(password, 'Password must be at least 8 characters');
        hasErrors = true;
    }

    if (!birthday.value) {
        showError(birthday, 'Please select your birthday');
        hasErrors = true;
    } else {
        const age = calculateAge(new Date(birthday.value));
        if (age < 13) {
            showError(birthday, 'You must be at least 13 years old');
            hasErrors = true;
        }
    }

    if (!hasErrors) {
        db.collection("users").add({
            username: username.value,
            email: email.value,
            password: password.value,
            birthday: birthday.value,
        })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }
});

function showError(input, message) {
    input.classList.add('error');
    const errorElement = document.getElementById(`${input.id}-error`);
    errorElement.textContent = message;
}

function clearErrors() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('error');
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) errorElement.textContent = '';
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function calculateAge(birthday) {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }

    return age;
}