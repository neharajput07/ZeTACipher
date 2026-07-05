package com.zetacipher.backend.node;

public class Node {

    private String nodeId;       // e.g. "N1"
    private int port;            // e.g. 8001
    private String secretKey;    // shared secret used in HMAC
    private String status;       // "TRUSTED", "QUARANTINED", "UNKNOWN"
    private String nextNodeHost; // host of neighbor node (e.g. "localhost")
    private int nextNodePort;    // port of neighbor node
    private String nextNodeId;   // id of neighbor node (e.g. "N2")

    public Node(String nodeId, int port, String secretKey, String nextNodeHost, int nextNodePort, String nextNodeId) {
        this.nodeId = nodeId;
        this.port = port;
        this.secretKey = secretKey;
        this.nextNodeHost = nextNodeHost;
        this.nextNodePort = nextNodePort;
        this.nextNodeId = nextNodeId;
        this.status = "UNKNOWN";
    }

    public String getNodeId() {
        return nodeId;
    }

    public int getPort() {
        return port;
    }

    public String getSecretKey() {
        return secretKey;
    }
    public void setSecretKey(String secretKey) {
    this.secretKey = secretKey;
}

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNextNodeHost() {
        return nextNodeHost;
    }

    public int getNextNodePort() {
        return nextNodePort;
    }

    public String getNextNodeId() {
        return nextNodeId;
    }

    @Override
    public String toString() {
        return "Node{" +
                "nodeId='" + nodeId + '\'' +
                ", port=" + port +
                ", status='" + status + '\'' +
                '}';
    }
}