import {
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";

export function openGallery(callback: (res: ImagePickerResult) => void) {
  launchImageLibraryAsync({ mediaTypes: MediaTypeOptions.Images }).then(
    callback
  );
}
export function openCamera(callback: (res: ImagePickerResult) => void) {
  launchCameraAsync({ mediaTypes: MediaTypeOptions.Images }).then(callback);
}
