document.addEventListener('DOMContentLoaded', () => {
    const stripe = Stripe('YOUR_PUBLIC_STRIPE_KEY');
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const paymentForm = document.getElementById('payment-form');

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { token, error } = await stripe.createToken(cardElement);
        if (error) {
            displayError(error.message);
        } else {
            handleToken(token);
        }
    });

    function handleToken(token) {
        const selectedMeals = JSON.parse(localStorage.getItem('selectedMeals'));

        fetch('/create-one-time-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                stripeToken: token.id,
                meals: selectedMeals
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Payment successful!');
                localStorage.removeItem('selectedMeals');
                window.location.href = '/thank-you';
            } else {
                displayError(data.error);
            }
        })
        .catch(error => {
            displayError(error.message);
        });
    }

    function displayError(error) {
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error;
    }
});
