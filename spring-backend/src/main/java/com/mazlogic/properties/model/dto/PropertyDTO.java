package com.mazlogic.properties.model.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDTO {
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be a positive value")
    private Double price;
    
    @NotBlank(message = "Property type is required")
    private String type; // 'rent' or 'sale'
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Agent information is required")
    private AgentDTO agent;
    
    private List<PropertyImageDTO> images = new ArrayList<>();
}
