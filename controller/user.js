const User = require('../model/user');

module.exports.getAllUser = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	User.find()
		.select(['-_id'])
		.limit(limit)
		.sort({
			id: sort,
		})
		.then((users) => {
			res.json(users);
		})
		.catch((err) => console.log(err));
};

module.exports.getUser = (req, res) => {
	const id = req.params.id;

	User.findOne({
		id,
	})
		.select(['-_id'])
		.then((user) => {
			res.json(user);
		})
		.catch((err) => console.log(err));
};

module.exports.addUser = async (req, res) => {
	try {
		if (!req.body) {
			return res.json({
				status: 'error',
				message: 'data is undefined',
			});
		}

		// ✅ countDocuments() without callback
		let userCount = await User.countDocuments(); // Await ka use kiya hai

		console.log(req.body);
		const user = new User({
			id: userCount + 1,
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
		});

		// ✅ Save the user and return response
		const savedUser = await user.save();
		return res.json(savedUser);

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


module.exports.editUser = (req, res) => {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		res.json({
			id: parseInt(req.params.id),
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			name: {
				firstname: req.body.firstname,
				lastname: req.body.lastname,
			},
			address: {
				city: req.body.address.city,
				street: req.body.address.street,
				number: req.body.number,
				zipcode: req.body.zipcode,
				geolocation: {
					lat: req.body.address.geolocation.lat,
					long: req.body.address.geolocation.long,
				},
			},
			phone: req.body.phone,
		});
	}
};

module.exports.deleteUser = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		User.findOne({ id: req.params.id })
			.select(['-_id'])
			.then((user) => {
				res.json(user);
			})
			.catch((err) => console.log(err));
	}
};
