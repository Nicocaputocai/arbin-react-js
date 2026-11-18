import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { compressImageFile } from "./compressImage";

export const captureOrSelectPhoto = async (fileFromInput = null) => {
  // 1. Si estamos en el APK nativo (Android / iOS Capacitor)
  if (Capacitor.isNativePlatform()) {
    const image = await Camera.getPhoto({
      quality: 80,
      width: 1280,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // Pregunta al usuario: "Tomar foto" o "Elegir de galería"
      promptLabelHeader: "Seleccionar imagen",
      promptLabelPhoto: "Elegir de la galería",
      promptLabelPicture: "Tomar foto ahora",
    });
    return image.dataUrl;
  }

  // 2. Si estamos en navegador Web (PC o Safari en iPhone)
  if (fileFromInput) {
    return await compressImageFile(fileFromInput);
  }

  return null;
};