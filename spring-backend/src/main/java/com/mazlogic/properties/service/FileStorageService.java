package com.mazlogic.properties.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${application.storage.image-directory}")
    private String uploadDirectory;
    
    private Path fileStorageLocation;
    
    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDirectory)
                .toAbsolutePath().normalize();
        
        System.out.println("FileStorageService initialized with directory: " + this.fileStorageLocation);
                
        try {
            Files.createDirectories(this.fileStorageLocation);
            System.out.println("File storage directory created or verified: " + this.fileStorageLocation);
            System.out.println("Directory exists: " + Files.exists(this.fileStorageLocation));
            System.out.println("Directory is writable: " + Files.isWritable(this.fileStorageLocation));
        } catch (IOException ex) {
            System.err.println("Failed to create directory: " + this.fileStorageLocation);
            ex.printStackTrace();
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }
    
    public String storeFile(MultipartFile file) {
        // Normalize file name
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        // Generate unique filename
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        System.out.println("Storing file with original name: " + originalFileName);
        System.out.println("Generated file name: " + fileName);
        System.out.println("File size: " + file.getSize() + " bytes");
        System.out.println("File content type: " + file.getContentType());
        System.out.println("Target directory: " + this.fileStorageLocation.toString());
        
        try {
            // Copy file to the target location
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            System.out.println("Saving file to: " + targetLocation.toString());
            
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Verify file was saved
            boolean fileExists = Files.exists(targetLocation);
            System.out.println("File saved successfully: " + fileExists);
            if (fileExists) {
                System.out.println("Saved file size: " + Files.size(targetLocation) + " bytes");
            }
            
            return fileName;
        } catch (IOException ex) {
            System.err.println("Failed to store file: " + ex.getMessage());
            ex.printStackTrace();
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
    
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found: " + fileName, ex);
        }
    }
    
    public void deleteFile(String fileName) {
        try {
            Path file = this.fileStorageLocation.resolve(fileName);
            Files.deleteIfExists(file);
        } catch (IOException ex) {
            throw new RuntimeException("Error deleting file: " + fileName, ex);
        }
    }
}
