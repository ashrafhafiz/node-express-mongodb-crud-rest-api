import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const tutorialSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    published: Boolean,
  },
  { timestamps: true }
);

tutorialSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

tutorialSchema.plugin(mongoosePaginate);

const Tutorial = mongoose.model("tutorials", tutorialSchema);

export default Tutorial;
