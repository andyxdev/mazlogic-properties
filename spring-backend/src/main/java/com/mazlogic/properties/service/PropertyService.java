package com.mazlogic.properties.service;

import com.mazlogic.properties.model.Agent;
import com.mazlogic.properties.model.Property;
import com.mazlogic.properties.model.PropertyImage;
import com.mazlogic.properties.model.dto.AgentDTO;
import com.mazlogic.properties.model.dto.PropertyDTO;
import com.mazlogic.properties.model.dto.PropertyImageDTO;
import com.mazlogic.properties.repository.AgentRepository;
import com.mazlogic.properties.repository.PropertyRepository;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final AgentRepository agentRepository;
    private final PropertyImageService propertyImageService;
    
    @Autowired
    public PropertyService(
            PropertyRepository propertyRepository,
            AgentRepository agentRepository,
            PropertyImageService propertyImageService) {
        this.propertyRepository = propertyRepository;
        this.agentRepository = agentRepository;
        this.propertyImageService = propertyImageService;
    }
    
    public List<PropertyDTO> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public PropertyDTO getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + id));
        return convertToDTO(property);
    }
    
    @Transactional
    public PropertyDTO createProperty(PropertyDTO propertyDTO) {
        Property property = convertToEntity(propertyDTO);
        Property savedProperty = propertyRepository.save(property);
        return convertToDTO(savedProperty);
    }
    
    @Transactional
    public PropertyDTO updateProperty(Long id, PropertyDTO propertyDTO) {
        Property existingProperty = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + id));
        
        // Update fields
        existingProperty.setTitle(propertyDTO.getTitle());
        existingProperty.setDescription(propertyDTO.getDescription());
        existingProperty.setPrice(propertyDTO.getPrice());
        existingProperty.setType(propertyDTO.getType());
        existingProperty.setLocation(propertyDTO.getLocation());
        
        // Update agent if needed
        if (propertyDTO.getAgent() != null) {
            Agent agent = agentRepository.findById(propertyDTO.getAgent().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Agent not found with ID: " + propertyDTO.getAgent().getId()));
            existingProperty.setAgent(agent);
        }
        
        Property updatedProperty = propertyRepository.save(existingProperty);
        return convertToDTO(updatedProperty);
    }
    
    @Transactional
    public void deleteProperty(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new EntityNotFoundException("Property not found with ID: " + id);
        }
        
        // Delete associated images first
        propertyImageService.deleteImagesForProperty(id);
        
        // Delete the property
        propertyRepository.deleteById(id);
    }
    
    public List<PropertyDTO> searchProperties(String keyword) {
        return propertyRepository.searchByKeyword(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PropertyDTO> getPropertiesByType(String type) {
        return propertyRepository.findByType(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PropertyDTO> getPropertiesByAgentId(Long agentId) {
        return propertyRepository.findByAgentId(agentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PropertyDTO> getPropertiesByMaxPrice(Double maxPrice) {
        return propertyRepository.findByPriceLessThanEqual(maxPrice).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // DTO to Entity conversion
    private Property convertToEntity(PropertyDTO dto) {
        Property property = new Property();
        property.setId(dto.getId());
        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setPrice(dto.getPrice());
        property.setType(dto.getType());
        property.setLocation(dto.getLocation());
        
        // Set agent
        if (dto.getAgent() != null) {
            Agent agent = agentRepository.findById(dto.getAgent().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Agent not found with ID: " + dto.getAgent().getId()));
            property.setAgent(agent);
        }
        
        return property;
    }
    
    // Entity to DTO conversion
    private PropertyDTO convertToDTO(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setPrice(property.getPrice());
        dto.setType(property.getType());
        dto.setLocation(property.getLocation());
        
        // Set agent
        if (property.getAgent() != null) {
            AgentDTO agentDTO = new AgentDTO();
            agentDTO.setId(property.getAgent().getId());
            agentDTO.setName(property.getAgent().getName());
            agentDTO.setEmail(property.getAgent().getEmail());
            agentDTO.setPhone(property.getAgent().getPhone());
            dto.setAgent(agentDTO);
        }
        
        // Set images
        List<PropertyImageDTO> imageDTOs = new ArrayList<>();
        if (property.getImages() != null) {
            for (PropertyImage image : property.getImages()) {
                PropertyImageDTO imageDTO = new PropertyImageDTO();
                imageDTO.setId(image.getId());
                imageDTO.setImageUrl(image.getImageUrl());
                imageDTO.setDescription(image.getDescription());
                imageDTO.setDisplayOrder(image.getDisplayOrder());
                imageDTO.setOriginalFileName(image.getOriginalFileName());
                imageDTOs.add(imageDTO);
            }
        }
        dto.setImages(imageDTOs);
        
        return dto;
    }
}
