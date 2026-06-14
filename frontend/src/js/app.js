class ImageManager {
    constructor() {
        this.apiUrl = 'http://localhost:8080';
        this.dropZone = null;
        this.fileInput = null;
        this.gallery = null;
        this.images = [];
        this.init();
    }

    init() {
        this.dropZone = document.getElementById('drop-zone');
        this.fileInput = document.getElementById('file-input');
        this.gallery = document.getElementById('gallery');

        this.bindEvents();
        this.loadImages();
    }

    bindEvents() {
        this.dropZone.addEventListener('click', () => this.fileInput.click());

        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });
    }

    async loadImages() {
        try {
            const response = await fetch(`${this.apiUrl}/files`);
            this.images = await response.json();
            this.render();
        } catch (error) {
            console.error('Ошибка загрузки изображений:', error);
        }
    }

    async handleFiles(files) {
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                await this.uploadImage(file);
            }
        }
        this.fileInput.value = '';
        await this.loadImages();
    }

    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.apiUrl}/files`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('Файл загружен:', file.name);
            }
        } catch (error) {
            console.error('Ошибка загрузки файла:', error);
        }
    }

    async deleteImage(id) {
        try {
            await fetch(`${this.apiUrl}/files/${id}`, {
                method: 'DELETE'
            });
            await this.loadImages();
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    }

    render() {
        if (this.images.length === 0) {
            this.gallery.innerHTML = '<div class="empty-gallery">Нет изображений. Добавьте первое!</div>';
            return;
        }

        this.gallery.innerHTML = '';

        this.images.forEach(image => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.id = image.id;

            item.innerHTML = `
                <div class="image-container">
                    <img class="gallery-img" src="${this.apiUrl}${image.path}" alt="${image.filename}">
                </div>
                <div class="image-info">
                    <span>${image.filename.length > 20 ? image.filename.substring(0, 17) + '...' : image.filename}</span>
                    <span>${(image.size / 1024).toFixed(1)} KB</span>
                </div>
                <button class="delete-image-btn" data-id="${image.id}">✕</button>
            `;

            const deleteBtn = item.querySelector('.delete-image-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteImage(image.id);
            });

            this.gallery.appendChild(item);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageManager();
});