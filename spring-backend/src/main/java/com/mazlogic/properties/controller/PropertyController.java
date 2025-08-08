package com.mazlogic.properties.controller;

import com.mazlogic.properties.model.Property;
import com.mazlogic.properties.model.dto.PropertyDTO;
import com.mazlogic.properties.model.dto.PropertyImageDTO;
import com.mazlogic.properties.repository.PropertyRepository;
import com.mazlogic.properties.service.PropertyImageService;
import com.mazlogic.properties.service.PropertyService;
import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:8081"}) // Allow requests from Angular frontend
public class PropertyController {

    private final PropertyService propertyService;
    private final PropertyImageService imageService;
    private final PropertyRepository propertyRepository;
    
    @Autowired
    public PropertyController(
            PropertyService propertyService,
            PropertyImageService imageService,
            PropertyRepository propertyRepository) {
        this.propertyService = propertyService;
        this.imageService = imageService;
        this.propertyRepository = propertyRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<PropertyDTO>> getAllProperties() {
        List<PropertyDTO> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long id) {
        PropertyDTO property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }
    
    @PostMapping
    public ResponseEntity<PropertyDTO> createProperty(@Valid @RequestBody PropertyDTO propertyDTO) {
        PropertyDTO createdProperty = propertyService.createProperty(propertyDTO);
        return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PropertyDTO> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyDTO propertyDTO) {
        PropertyDTO updatedProperty = propertyService.updateProperty(id, propertyDTO);
        return ResponseEntity.ok(updatedProperty);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<PropertyDTO>> searchProperties(@RequestParam String keyword) {
        List<PropertyDTO> properties = propertyService.searchProperties(keyword);
        return ResponseEntity.ok(properties);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<PropertyDTO>> getPropertiesByType(@PathVariable String type) {
        List<PropertyDTO> properties = propertyService.getPropertiesByType(type);
        return ResponseEntity.ok(properties);
    }
    
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<PropertyDTO>> getPropertiesByAgentId(@PathVariable Long agentId) {
        List<PropertyDTO> properties = propertyService.getPropertiesByAgentId(agentId);
        return ResponseEntity.ok(properties);
    }
    
    @GetMapping("/price")
    public ResponseEntity<List<PropertyDTO>> getPropertiesByMaxPrice(@RequestParam Double maxPrice) {
        List<PropertyDTO> properties = propertyService.getPropertiesByMaxPrice(maxPrice);
        return ResponseEntity.ok(properties);
    }
    
    // Image related endpoints
    @GetMapping("/{propertyId}/images")
    public ResponseEntity<List<PropertyImageDTO>> getPropertyImages(@PathVariable Long propertyId) {
        List<PropertyImageDTO> images = imageService.getImagesByPropertyId(propertyId);
        return ResponseEntity.ok(images);
    }
    
    @PostMapping("/{propertyId}/images")
    @Transactional
    public ResponseEntity<PropertyImageDTO> uploadPropertyImage(
            @PathVariable Long propertyId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "displayOrder", required = false) Integer displayOrder) {
        
        // Log start of image upload process
        System.out.println("Received file upload request for property ID: " + propertyId);
        System.out.println("File name: " + file.getOriginalFilename());
        System.out.println("File size: " + file.getSize() + " bytes");
        System.out.println("File content type: " + file.getContentType());
        
        try {
            // Verify property exists
            Property property = propertyRepository.findById(propertyId)
                    .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + propertyId));
            
            // Check if property already has images
            System.out.println("Property current image count: " + 
                (property.getImages() != null ? property.getImages().size() : "null"));
            
            // Use Property's helper method to ensure proper bidirectional relationship
            PropertyImageDTO uploadedImage = imageService.uploadImage(property, file, description, displayOrder);
            
            // Save the property again to ensure relationship is persisted
            property = propertyRepository.save(property);
            
            // Log the result of the upload
            System.out.println("Image saved with ID: " + uploadedImage.getId());
            System.out.println("Image URL: " + uploadedImage.getImageUrl());
            
            // Verify images are associated with the property
            Property updatedProperty = propertyRepository.findById(propertyId).orElseThrow();
            System.out.println("Updated property image count: " + 
                (updatedProperty.getImages() != null ? updatedProperty.getImages().size() : "null"));
            
            return new ResponseEntity<>(uploadedImage, HttpStatus.CREATED);
        } catch (Exception e) {
            // Improved error logging
            System.err.println("Error processing image upload for property ID " + propertyId);
            e.printStackTrace();
            throw e; // Re-throw to let Spring handle the error response
        }
    }
    
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<Void> deletePropertyImage(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/images/{imageId}")
    public ResponseEntity<PropertyImageDTO> updateImageDetails(
            @PathVariable Long imageId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "displayOrder", required = false) Integer displayOrder) {
        
        PropertyImageDTO updatedImage = imageService.updateImageDetails(imageId, description, displayOrder);
        return ResponseEntity.ok(updatedImage);
    }
}
