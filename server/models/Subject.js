import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    sem: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    coverUrl: {
      type: String,
      default: 'https://via.placeholder.com/150?text=Workbook',
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
