from flask import Flask, request, jsonify
import stripe

app = Flask(__name__)
stripe.api_key = 'YOUR_SECRET_STRIPE_KEY'

@app.route('/create-one-time-payment', methods=['POST'])
def create_one_time_payment():
    data = request.get_json()
    try:
        charge = stripe.Charge.create(
            amount=5000,  # Amount in cents
            currency='usd',
            description='One week subscription',
            source=data['stripeToken']
        )
        return jsonify(success=True)
    except stripe.error.StripeError as e:
        return jsonify(success=False, error=str(e))

if __name__ == '__main__':
    app.run()
