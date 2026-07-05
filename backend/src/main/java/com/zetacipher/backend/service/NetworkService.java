package com.zetacipher.backend.service;

import com.zetacipher.backend.network.MeshNetwork;
import com.zetacipher.backend.node.Node;
import com.zetacipher.backend.repository.HandshakeLogRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NetworkService {

    private final HandshakeLogRepository logRepository;
    private MeshNetwork meshNetwork;

    public NetworkService(HandshakeLogRepository logRepository) {
        this.logRepository = logRepository;
    }

    @PostConstruct
    public void init() {
        meshNetwork = new MeshNetwork(logRepository);
        meshNetwork.startServers();
        System.out.println("Mesh network initialized and servers started.");
    }

    public List<Node> getAllNodes() {
        return meshNetwork.getNodes();
    }

    public List<Node> runHandshakeRound() {
        meshNetwork.runHandshakeRound();
        return meshNetwork.getNodes();
    }

    public boolean corruptNode(String nodeId) {
        return meshNetwork.corruptNode(nodeId);
    }

    public boolean restoreNode(String nodeId) {
        return meshNetwork.restoreNode(nodeId);
    }
}