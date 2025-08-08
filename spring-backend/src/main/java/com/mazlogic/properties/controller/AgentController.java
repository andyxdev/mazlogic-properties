package com.mazlogic.properties.controller;

import com.mazlogic.properties.model.dto.AgentDTO;
import com.mazlogic.properties.service.AgentService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
@CrossOrigin(origins = "*") // Allow requests from Angular frontend
public class AgentController {

    private final AgentService agentService;
    
    @Autowired
    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }
    
    @GetMapping
    public ResponseEntity<List<AgentDTO>> getAllAgents(
            @RequestParam(name = "email", required = false) String email) {
        
        if (email != null && !email.isBlank()) {
            // If email parameter is provided, filter by email
            List<AgentDTO> agents = agentService.findAgentsByEmail(email);
            return ResponseEntity.ok(agents);
        } else {
            // Otherwise, return all agents
            List<AgentDTO> agents = agentService.getAllAgents();
            return ResponseEntity.ok(agents);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AgentDTO> getAgentById(@PathVariable Long id) {
        AgentDTO agent = agentService.getAgentById(id);
        return ResponseEntity.ok(agent);
    }
    
    @PostMapping
    public ResponseEntity<AgentDTO> createAgent(@Valid @RequestBody AgentDTO agentDTO) {
        AgentDTO createdAgent = agentService.createAgent(agentDTO);
        return new ResponseEntity<>(createdAgent, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AgentDTO> updateAgent(
            @PathVariable Long id,
            @Valid @RequestBody AgentDTO agentDTO) {
        AgentDTO updatedAgent = agentService.updateAgent(id, agentDTO);
        return ResponseEntity.ok(updatedAgent);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable Long id) {
        agentService.deleteAgent(id);
        return ResponseEntity.noContent().build();
    }
}
