package com.zetacipher.backend.model;

import com.zetacipher.backend.node.Node;

public class NodeStatusDTO {

    private String nodeId;
    private int port;
    private String status;

    public NodeStatusDTO(Node node) {
        this.nodeId = node.getNodeId();
        this.port = node.getPort();
        this.status = node.getStatus();
    }

    public String getNodeId() {
        return nodeId;
    }

    public int getPort() {
        return port;
    }

    public String getStatus() {
        return status;
    }
}