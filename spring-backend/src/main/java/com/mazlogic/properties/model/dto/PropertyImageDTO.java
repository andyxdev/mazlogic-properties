package com.mazlogic.properties.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyImageDTO {
    private Long id;
    private String imageUrl;
    private String description;
    private Integer displayOrder;
    private String originalFileName;
}
