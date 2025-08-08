package com.mazlogic.properties.service;

import com.mazlogic.properties.model.Agent;
import com.mazlogic.properties.model.dto.AgentDTO;
import com.mazlogic.properties.repository.AgentRepository;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentService {

    private final AgentRepository agentRepository;
    
    @Autowired
    public AgentService(AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }
    
    public List<AgentDTO> getAllAgents() {
        return agentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public AgentDTO getAgentById(Long id) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Agent not found with ID: " + id));
        return convertToDTO(agent);
    }
    
    public AgentDTO createAgent(AgentDTO agentDTO) {
        // Check for duplicate email
        if (agentRepository.existsByEmail(agentDTO.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + agentDTO.getEmail());
        }
        
        Agent agent = convertToEntity(agentDTO);
        Agent savedAgent = agentRepository.save(agent);
        return convertToDTO(savedAgent);
    }
    
    public AgentDTO updateAgent(Long id, AgentDTO agentDTO) {
        Agent existingAgent = agentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Agent not found with ID: " + id));
        
        // Check for duplicate email if changed
        if (!existingAgent.getEmail().equals(agentDTO.getEmail()) && 
            agentRepository.existsByEmail(agentDTO.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + agentDTO.getEmail());
        }
        
        // Update fields
        existingAgent.setName(agentDTO.getName());
        existingAgent.setEmail(agentDTO.getEmail());
        existingAgent.setPhone(agentDTO.getPhone());
        
        Agent updatedAgent = agentRepository.save(existingAgent);
        return convertToDTO(updatedAgent);
    }
    
    public void deleteAgent(Long id) {
        if (!agentRepository.existsById(id)) {
            throw new EntityNotFoundException("Agent not found with ID: " + id);
        }
        agentRepository.deleteById(id);
    }
    
    /**
     * Find agents by email (exact match)
     */
    public List<AgentDTO> findAgentsByEmail(String email) {
        return agentRepository.findByEmail(email)
                .map(agent -> {
                    List<Agent> agents = new ArrayList<>();
                    agents.add(agent);
                    return agents;
                })
                .orElse(Collections.emptyList())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // DTO to Entity conversion
    private Agent convertToEntity(AgentDTO agentDTO) {
        Agent agent = new Agent();
        agent.setId(agentDTO.getId());
        agent.setName(agentDTO.getName());
        agent.setEmail(agentDTO.getEmail());
        agent.setPhone(agentDTO.getPhone());
        return agent;
    }
    
    // Entity to DTO conversion
    private AgentDTO convertToDTO(Agent agent) {
        AgentDTO agentDTO = new AgentDTO();
        agentDTO.setId(agent.getId());
        agentDTO.setName(agent.getName());
        agentDTO.setEmail(agent.getEmail());
        agentDTO.setPhone(agent.getPhone());
        return agentDTO;
    }
}
