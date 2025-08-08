import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
  constructor() {}
  
  /**
   * Convert a file to a data URL
   */
  fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * Store an image in local storage
   * This is just a demo implementation - in a real app, you'd upload to a server
   */
  async storeImage(file: File): Promise<string> {
    try {
      const dataUrl = await this.fileToDataUrl(file);
      return dataUrl;
    } catch (error) {
      console.error('Error converting file to data URL:', error);
      throw error;
    }
  }
}
