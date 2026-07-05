package com.zetacipher.backend.controller;

import com.zetacipher.backend.model.HandshakeLog;
import com.zetacipher.backend.model.NodeStatusDTO;
import com.zetacipher.backend.node.Node;
import com.zetacipher.backend.repository.HandshakeLogRepository;
import com.zetacipher.backend.service.NetworkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/network")
@CrossOrigin(origins = "*")
public class StatusController {

    private final NetworkService networkService;
    private final HandshakeLogRepository logRepository;

    public StatusController(NetworkService networkService, HandshakeLogRepository logRepository) {
        this.networkService = networkService;
        this.logRepository = logRepository;
    }

    @GetMapping("/status")
    public List<NodeStatusDTO> getStatus() {
        return toDTOList(networkService.getAllNodes());
    }

    @PostMapping("/handshake")
    public List<NodeStatusDTO> triggerHandshake() {
        return toDTOList(networkService.runHandshakeRound());
    }

    @GetMapping("/logs")
    public List<HandshakeLog> getLogs() {
        return logRepository.findAllByOrderByTimestampDesc();
    }

    @PostMapping("/corrupt/{nodeId}")
    public String corruptNode(@PathVariable String nodeId) {
        boolean success = networkService.corruptNode(nodeId);
        return success ? nodeId + " corrupted" : "Node not found";
    }

    @PostMapping("/restore/{nodeId}")
    public String restoreNode(@PathVariable String nodeId) {
        boolean success = networkService.restoreNode(nodeId);
        return success ? nodeId + " restored" : "Node not found";
    }
    @PostMapping("/simulate-attack")
    public String simulateAttack(@RequestParam String type, @RequestParam String nodeId) {
        networkService.corruptNode(nodeId);
        return "Attack simulated: " + type + " on " + nodeId;
    }

    private List<NodeStatusDTO> toDTOList(List<Node> nodes) {
        return nodes.stream()
                .map(NodeStatusDTO::new)
                .collect(Collectors.toList());
    }
}