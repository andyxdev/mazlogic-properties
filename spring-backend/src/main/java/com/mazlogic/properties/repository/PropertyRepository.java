package com.mazlogic.properties.repository;

import com.mazlogic.properties.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByType(String type);
    
    List<Property> findByAgentId(Long agentId);
    
    @Query("SELECT p FROM Property p WHERE p.price <= :maxPrice")
    List<Property> findByPriceLessThanEqual(Double maxPrice);
    
    @Query("SELECT p FROM Property p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.location) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Property> searchByKeyword(String keyword);
}
