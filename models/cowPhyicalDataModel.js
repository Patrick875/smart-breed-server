const mongoose = require("mongoose");

const cowPhysicalDataSchema = mongoose.Schema({
	temp: Number,
	heartbeat: Number,
	time: Date,
	date: Date,
	cow: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Cow",
		require: [true, "cow id is required"],
	},
});

const CowPhysicalData = new mongoose.model(
	"CowPhysicalData",
	cowPhysicalDataSchema
);

module.exports = CowPhysicalData;
