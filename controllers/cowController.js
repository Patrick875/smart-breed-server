const Cow = require("./../models/cowModel");
const CowPhysicalData = require("./../models/cowPhyicalDataModel");

exports.getAll = async (req, res) => {
	try {
		const cows = await Cow.find()
			.populate({ path: "physicalData", options: { sort: { date: -1 } } })
			.populate("owner")
			.exec();
		res.status(200).json({
			status: "success",
			results: cows.length,
			data: cows,
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ message: "failed fetching", status: "server error" });
	}
};
exports.getOne = async (req, res) => {
	console.log(req.params);
	let cow = await Cow.findOne({ cowId: req.params.id })
		.populate({ path: "physicalData", options: { sort: { date: -1 } } })
		.populate("owner");

	res.status(200).json({
		status: "success",
		data: cow,
	});
};
exports.recordCurrentData = async (req, res) => {
	const { cowId, temp, heartbeat, time } = req.query;

	try {
		let cow = await Cow.findOne({ cowId });
		if (!cow) {
			cow = await Cow.create({ cowId });
		}
		const date = Date.now();

		const physicalData = await CowPhysicalData.create({
			cow: cow.id,
			temp: temp,
			heartbeat: heartbeat,
			time,
			date,
		});

		res.status(201).json({
			status: "success",
			data: cow,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ data: "server error", message: "server error" });
	}
};

exports.deleteAnimal = async (req, res) => {
	await Cow.findByIdAndDelete(req.params.id);
	res.status(204).json({
		status: "success",
		message: "deleted",
	});
};

exports.deleteAll = async (req, res) => {
	await Cow.deleteMany();
	res.status(204).json({
		status: "success",
		message: "deleted",
	});
};
