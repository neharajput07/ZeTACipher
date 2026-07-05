package com.zetacipher.backend.network;

import com.zetacipher.backend.node.Node;
import com.zetacipher.backend.node.NodeClient;
import com.zetacipher.backend.node.NodeServer;
import com.zetacipher.backend.repository.HandshakeLogRepository;

import java.util.ArrayList;
import java.util.List;

public class MeshNetwork {

    private List<Node> nodes = new ArrayList<>();
    private HandshakeLogRepository logRepository;

    private static final String VALID_SECRET = "zeta-shared-secret-key";
    private static final String CORRUPTED_SECRET = "hacked-invalid-key";

    public MeshNetwork(HandshakeLogRepository logRepository) {
        this.logRepository = logRepository;
        setupNodes();
    }

    private void setupNodes() {
        // Shared secret key for this simple version (all nodes know it)
        String sharedSecret = VALID_SECRET;

        // 5 nodes in a ring: N1 -> N2 -> N3 -> N4 -> N5 -> N1
        Node n1 = new Node("N1", 8001, sharedSecret, "localhost", 8002, "N2");
        Node n2 = new Node("N2", 8002, sharedSecret, "localhost", 8003, "N3");
        Node n3 = new Node("N3", 8003, sharedSecret, "localhost", 8004, "N4");
        Node n4 = new Node("N4", 8004, sharedSecret, "localhost", 8005, "N5");
        Node n5 = new Node("N5", 8005, sharedSecret, "localhost", 8001, "N1");

        nodes.add(n1);
        nodes.add(n2);
        nodes.add(n3);
        nodes.add(n4);
        nodes.add(n5);
    }

    // Starts each node's server on its own thread
    public void startServers() {
        for (Node node : nodes) {
            Thread serverThread = new Thread(new NodeServer(node));
            serverThread.setDaemon(true);
            serverThread.start();
        }

        // Give servers a moment to start listening before handshakes begin
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    // Runs one full round of handshakes around the ring
    public void runHandshakeRound() {
        for (Node node : nodes) {
            NodeClient client = new NodeClient(node, logRepository);
            boolean trusted = client.challengeNeighbor();
            node.setStatus(trusted ? "TRUSTED" : "QUARANTINED");
        }
    }

    public boolean corruptNode(String nodeId) {
        for (Node node : nodes) {
            if (node.getNodeId().equals(nodeId)) {
                node.setSecretKey(CORRUPTED_SECRET);
                return true;
            }
        }
        return false;
    }

    public boolean restoreNode(String nodeId) {
        for (Node node : nodes) {
            if (node.getNodeId().equals(nodeId)) {
                node.setSecretKey(VALID_SECRET);
                return true;
            }
        }
        return false;
    }

    public List<Node> getNodes() {
        return nodes;
    }
}