import React, { useEffect, useState } from 'react';
import './style/gallery.css'


const PhotoViewer = ({ item }) => {
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const loadImagesFromFolder = async (folderName) => {
            const numImages = 4; // Número máximo de imágenes a cargar
            const supportedExtensions = ['jpg', 'jpeg', 'png', 'webp']; // Extensiones de archivo compatibles
            const loadedImages = [];

            for (let i = 1; i <= numImages; i++) {
                for (const ext of supportedExtensions) {
                    const imagePath = `../public/modelo/${folderName}/${i}.${ext}`;
                    try {
                        await loadImage(imagePath);
                        const image = {
                            original: imagePath,
                            thumbnail: imagePath,
                            description: `Descripción de la imagen ${i}`
                        };
                        loadedImages.push(image);
                        break; // Rompe el bucle de extensiones si se encontró la imagen
                    } catch (error) {
                        console.error(`Error loading image: ${imagePath}`, error);
                    }
                }
            }
            return loadedImages;
        };

        const loadImage = (path) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => reject();
                img.src = path;
            });
        };

        const fetchImages = async () => {
            try {
                const images = await loadImagesFromFolder(item[0][1]);
                setImages(images);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, [item]);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    if (images.length === 0) {
        return <div></div>;
    }

    return (
        <div className="photo-viewer">
            <div className="image-container">
                <img
                    src={images[currentImageIndex].original}
                    alt={images[currentImageIndex].description}
                    className="main-image"
                    style={{ width: "35vw", height: "20 hv"}}
                />
                {/* <button className="prev-button" onClick={prevImage}>
                    &#10094;
                </button>
                <button className="next-button" onClick={nextImage}>
                    &#10095;
                </button> */}
            </div>
            <div className="thumbnail-container">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image.thumbnail}
                        alt={image.description}
                        className={index === currentImageIndex ? "thumbnail active" : "thumbnail"}
                        onClick={() => setCurrentImageIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PhotoViewer;
