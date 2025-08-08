package com.mazlogic.properties.repository;

import com.mazlogic.properties.model.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {
    List<PropertyImage> findByPropertyId(Long propertyId);
    
    List<PropertyImage> findByPropertyIdOrderByDisplayOrderAsc(Long propertyId);
    
    void deleteByPropertyId(Long propertyId);
}
