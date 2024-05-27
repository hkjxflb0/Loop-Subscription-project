document.addEventListener('DOMContentLoaded', () => {
    const subscriptionForm = document.getElementById('subscription-form');
    const mealSelectionSection = document.getElementById('meal-selection');
    const mealCategoriesDiv = document.getElementById('meal-categories');
    const submitMealsButton = document.getElementById('submit-meals');
    const paymentSection = document.getElementById('payment-section');
    const paymentForm = document.getElementById('payment-form');
    const stripe = Stripe('YOUR_PUBLIC_STRIPE_KEY');
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const meals = {
        breakfast: [
            { name: 'Pancakes', image: 'https://th.bing.com/th/id/OIP.yEmcrPHXLjG3Z1Rp2mtwFgHaJ4?w=208&h=277&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' },
            { name: 'Omelette', image: 'https://th.bing.com/th/id/OIP.VCElRJNLcd3tQ9IW-kQuegHaE8?w=275&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' },
            { name: 'Granola', image: 'https://th.bing.com/th/id/OIP.1jYGq8uJDEV_r1QehUFdJQAAAA?w=204&h=305&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' }
        ],
        lunch: [
            { name: 'Caesar Salad', image: 'https://th.bing.com/th?id=OSK.65f7cae3203873a658c9706e0a92dea2&w=194&h=226&rs=2&qlt=80&o=6&cdv=1&dpr=1.3&pid=16.1.jpg' },
            { name: 'Chicken Wrap', image: 'https://th.bing.com/th/id/OIP.CAMQa06rRZEfpeBNFW98YgHaE8?w=288&h=192&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' },
            { name: 'Sushi', image: 'https://th.bing.com/th/id/OIP.1BWLZHXAmr5xLn5zF7ybUwHaE8?w=297&h=198&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' }
        ],
        dinner: [
            { name: 'Steak', image: 'https://th.bing.com/th/id/OIP.vNwEV9yK5j7JdifFbm3LGQHaE8?w=282&h=188&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' },
            { name: 'Pasta', image: 'https://th.bing.com/th/id/OIP.7Mp_pYcuUa8MHuRC79koSwHaJx?w=208&h=275&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' },
            { name: 'Pizza', image: 'https://th.bing.com/th/id/OIP.OZny5F6g0QAQPLsU_4HnEAHaE8?w=277&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' }
        ],
        desserts: [
            { name: 'Brownie', image: 'https://th.bing.com/th/id/OIP.Q8KlpCu0xovDq2F7bKbifAHaLC?w=204&h=373&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' },
            { name: 'Ice Cream', image: 'https://th.bing.com/th/id/OIP.EZ8OgezZCRRsjPL9TVOeVwHaE8?w=208&h=139&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' },
            { name: 'Cheesecake', image: 'https://th.bing.com/th/id/OIP.q_yMTN3NPbskEk-BB4jTWQHaHa?w=208&h=208&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' }
        ],
        beverages: [
            { name: 'Smoothie', image: 'https://th.bing.com/th/id/OIP._bs_-9HEZeTSzmMZIOe0BAHaHa?w=208&h=208&c=7&r=0&o=5&dpr=1.3&pid=1.7e.jpg' },
            { name: 'Juice', image: 'https://th.bing.com/th/id/OIP.G3gXlUmYlvI6bQbEVbN3pwHaJQ?w=232&h=205&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' },
            { name: 'Coffee', image: 'https://th.bing.com/th/id/OIP.O9d8qLzx66xVtDkm4QK4KwHaE8?w=276&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7.jpg' }
        ]
    };

    const mealLimits = {
        6: 6,
        12: 12
    };

    subscriptionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        subscriptionForm.classList.add('hidden');
        mealSelectionSection.classList.remove('hidden');
        loadMeals();
    });

    submitMealsButton.addEventListener('click', () => {
        const selectedMeals = document.querySelectorAll('#meal-categories input:checked');
        if (selectedMeals.length === mealLimits[getBoxSize()]) {
            // Store selected meals in localStorage or sessionStorage
            const selectedMealsArray = Array.from(selectedMeals).map(meal => meal.value);
            localStorage.setItem('selectedMeals', JSON.stringify(selectedMealsArray));

            // Redirect to payment page
            window.location.href = 'payment.html';
        } else {
            alert(`Please select ${mealLimits[getBoxSize()]} meals.`);
        }
    });

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { token, error } = await stripe.createToken(cardElement);
        if (error) {
            displayError(error.message);
        } else {
            handleToken(token);
        }
    });

    function loadMeals() {
        mealCategoriesDiv.innerHTML = '';
        Object.keys(meals).forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            categoryDiv.innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>`;
            meals[category].forEach(meal => {
                const mealItemDiv = document.createElement('div');
                mealItemDiv.className = 'meal-item';
                mealItemDiv.innerHTML = `
                    <img src="${meal.image}" alt="${meal.name}" style="width: 100px; height: 100px;">
                    <label>${meal.name}</label>
                    <input type="checkbox" value="${meal.name}">
                `;
                categoryDiv.appendChild(mealItemDiv);
            });
            mealCategoriesDiv.appendChild(categoryDiv);
        });
    }

    function getBoxSize() {
        return parseInt(document.querySelector('input[name="box-size"]:checked').value);
    }

    function displayError(error) {
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error;
    }

    async function handleToken(token) {
        const response = await fetch('/charge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token.id })
        });

        if (response.ok) {
            alert('Payment successful!');
            // Further actions like updating the UI or redirecting the user
        } else {
            displayError('Payment failed.');
        }
    }
});
