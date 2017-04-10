var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.charge = function(token, amount) {
	return stripe.charges.create({
		amount: amount, // amount in cents
		currency: 'usd',
		source: token,
		description: 'dollar dollar make u holler'
	});
}
