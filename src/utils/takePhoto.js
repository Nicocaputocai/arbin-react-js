import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { compressImageFile } from "./compressImage";

export const captureOrSelectPhoto = async (fileFromInput = null) => {
  // 1. Si estamos en el APK nativo (Android / iOS Capacitor)
  if (Capacitor.isNativePlatform()) {
    // Verificamos y solicitamos los permisos nativos de cámara y galería
    let permissions = await Camera.checkPermissions();

    if (permissions.camera !== "granted" || permissions.photos !== "granted") {
      permissions = await Camera.requestPermissions({
        permissions: ["camera", "photos"],
      });
    }

    if (permissions.camera !== "granted" && permissions.photos !== "granted") {
      alert(
        "Permiso de cámara y galería denegado. Habilitalo en Ajustes > Aplicaciones > Arbin > Permisos."
      );
      return null;
    }

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