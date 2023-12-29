const mongoose = require("mongoose");

const cowSchema = mongoose.Schema(
	{
		cowId: {
			type: String,
			require: [true, "AnimalId is required"],
			trim: true,
		},
	},
	{
		timestamps: true,

		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
	}
);

cowSchema.virtual("physicalData", {
	ref: "CowPhysicalData",
	localField: "_id",
	foreignField: "cow",
	justOne: false,
});

cowSchema.virtual("owner", {
	ref: "User",
	localField: "_id",
	foreignField: "cows",
	justOne: false,
});

const Cow = new mongoose.model("Cow", cowSchema);

module.exports = Cow;
