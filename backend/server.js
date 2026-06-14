const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Создаем папку для загрузок, если её нет
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage });

// Хранилище информации о файлах в памяти
let files = [];

// GET /files - получение списка всех файлов
app.get('/files', (req, res) => {
    res.json(files);
});

// GET /files/:id - получение информации о файле
app.get('/files/:id', (req, res) => {
    const file = files.find(f => f.id === req.params.id);
    if (file) {
        res.json(file);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// POST /files - загрузка файла
app.post('/files', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileData = {
        id: uuidv4(),
        filename: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
        uploadedAt: Date.now()
    };

    files.push(fileData);
    res.status(201).json(fileData);
});

// DELETE /files/:id - удаление файла
app.delete('/files/:id', (req, res) => {
    const index = files.findIndex(f => f.id === req.params.id);

    if (index !== -1) {
        const file = files[index];
        const filePath = path.join(uploadsDir, path.basename(file.path));

        // Удаляем файл с диска
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        files.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});