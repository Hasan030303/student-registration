const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Student = require('../models/student');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ name, email, password: hashedPassword });
    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully' });
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful' });
});

router.get('/profile', auth, async (req, res) => {
    const student = await Student.findById(req.user.id).select('-password');
    res.json(student);
});

router.put('/profile', auth, async (req, res) => {
    const { name, profilePicture } = req.body;
    await Student.findByIdAndUpdate(req.user.id, { name, profilePicture });
    res.json({ message: 'Profile updated successfully' });
});

router.post('/upload', auth, upload.single('file'), async (req, res) => {
    const student = await Student.findById(req.user.id);
    student.files.push(req.file.filename);
    await student.save();
    res.json({ message: 'File uploaded successfully', file: req.file });
});

router.get('/files', auth, async (req, res) => {
    const student = await Student.findById(req.user.id).populate('files');
    res.json
}