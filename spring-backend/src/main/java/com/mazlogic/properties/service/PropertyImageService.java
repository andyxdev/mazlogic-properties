package com.mazlogic.properties.service;

import com.mazlogic.properties.model.Property;
import com.mazlogic.properties.model.PropertyImage;
import com.mazlogic.properties.model.dto.PropertyImageDTO;
import com.mazlogic.properties.repository.PropertyImageRepository;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyImageService {

    private final PropertyImageRepository propertyImageRepository;
    private final FileStorageService fileStorageService;
    
    @Autowired
    public PropertyImageService(
            PropertyImageRepository propertyImageRepository,
            FileStorageService fileStorageService) {
        this.propertyImageRepository = propertyImageRepository;
        this.fileStorageService = fileStorageService;
    }
    
    public List<PropertyImageDTO> getImagesByPropertyId(Long propertyId) {
        return propertyImageRepository.findByPropertyIdOrderByDisplayOrderAsc(propertyId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public PropertyImageDTO uploadImage(Property property, MultipartFile file, String description, Integer displayOrder) {
        try {
            System.out.println("Starting image upload for property ID: " + property.getId());
            
            // Store the file
            String fileName = fileStorageService.storeFile(file);
            System.out.println("File saved with filename: " + fileName);
            
            // Create image URL - make sure it's accessible from Angular's origin
            // Use localhost explicitly since ServletUriComponentsBuilder might return null for host in some environments
            String host = "localhost";
            String port = "8081"; // Updated to match the port in application.yml
            
            // Create absolute URL
            String fileDownloadUri = "http://" + host + ":" + port + "/images/" + fileName;
            System.out.println("Generated image URL: " + fileDownloadUri);
            
            // Create image entity
            PropertyImage image = new PropertyImage();
            image.setFileName(fileName);
            image.setOriginalFileName(file.getOriginalFilename());
            image.setFileSize(file.getSize());
            image.setContentType(file.getContentType());
            image.setImageUrl(fileDownloadUri);
            image.setDescription(description != null ? description : "Property Image");
            image.setDisplayOrder(displayOrder != null ? displayOrder : 0);
            
            // First save the image to get an ID
            image.setProperty(property); // Set the relationship first
            PropertyImage savedImage = propertyImageRepository.save(image);
            System.out.println("Image saved to database with ID: " + savedImage.getId());
            
            // Now add the image to the property's collection to maintain the bidirectional relationship
            if (!property.getImages().contains(savedImage)) {
                property.getImages().add(savedImage);
                System.out.println("Added image to property's collection. Current image count: " + property.getImages().size());
            }
            
            return convertToDTO(savedImage);
        } catch (Exception e) {
            System.err.println("Error uploading image: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }
    
    public PropertyImageDTO getImage(Long id) {
        PropertyImage image = propertyImageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Image not found with ID: " + id));
        return convertToDTO(image);
    }
    
    @Transactional
    public void deleteImage(Long id) {
        PropertyImage image = propertyImageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Image not found with ID: " + id));
        
        // Delete file from storage
        fileStorageService.deleteFile(image.getFileName());
        
        // Delete from database
        propertyImageRepository.delete(image);
    }
    
    @Transactional
    public void deleteImagesForProperty(Long propertyId) {
        List<PropertyImage> images = propertyImageRepository.findByPropertyId(propertyId);
        
        // Delete files from storage
        for (PropertyImage image : images) {
            fileStorageService.deleteFile(image.getFileName());
        }
        
        // Delete from database
        propertyImageRepository.deleteByPropertyId(propertyId);
    }
    
    public PropertyImageDTO updateImageDetails(Long id, String description, Integer displayOrder) {
        PropertyImage image = propertyImageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Image not found with ID: " + id));
        
        image.setDescription(description);
        image.setDisplayOrder(displayOrder);
        
        PropertyImage updatedImage = propertyImageRepository.save(image);
        return convertToDTO(updatedImage);
    }
    
    // Entity to DTO conversion
    private PropertyImageDTO convertToDTO(PropertyImage image) {
        PropertyImageDTO dto = new PropertyImageDTO();
        dto.setId(image.getId());
        dto.setImageUrl(image.getImageUrl());
        dto.setDescription(image.getDescription());
        dto.setDisplayOrder(image.getDisplayOrder());
        dto.setOriginalFileName(image.getOriginalFileName());
        return dto;
    }
    
    // Debug method to check if property has images
    public void debugPropertyImages(Long propertyId) {
        Property property = propertyImageRepository.findById(propertyId)
                .map(PropertyImage::getProperty)
                .orElseThrow(() -> new EntityNotFoundException("No images found for property ID: " + propertyId));
        
        System.out.println("DEBUG - Property ID: " + property.getId());
        System.out.println("DEBUG - Property Title: " + property.getTitle());
        System.out.println("DEBUG - Image count: " + property.getImages().size());
        
        property.getImages().forEach(image -> {
            System.out.println("DEBUG - Image ID: " + image.getId());
            System.out.println("DEBUG - Image URL: " + image.getImageUrl());
            System.out.println("DEBUG - Image File: " + image.getFileName());
        });
    }
}
