import mongoose from "mongoose";

const CoursevideoSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
})

const CourseVideo = mongoose.model('CourseVideo', CoursevideoSchema);

export default CourseVideo;