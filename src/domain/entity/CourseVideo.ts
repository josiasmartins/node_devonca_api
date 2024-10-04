import mongoose from 'mongoose';

const courseVideoSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    data: { type: Buffer, required: true }, // Armazena o vídeo como Buffer
    size: { type: Number, required: true },
});

const CourseVideo = mongoose.model('CourseVideo', courseVideoSchema);

export default CourseVideo;
