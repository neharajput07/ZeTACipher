package com.zetacipher.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "handshake_logs")
public class HandshakeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String initiatorNodeId;   // node that sent the challenge
    private String responderNodeId;   // node that responded
    private String nonce;             // random challenge value used
    private String result;            // "TRUSTED" or "QUARANTINED"
    private LocalDateTime timestamp;  // when this handshake happened

    public HandshakeLog() {
        // required by JPA
    }

    public HandshakeLog(String initiatorNodeId, String responderNodeId, String nonce, String result) {
        this.initiatorNodeId = initiatorNodeId;
        this.responderNodeId = responderNodeId;
        this.nonce = nonce;
        this.result = result;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getInitiatorNodeId() {
        return initiatorNodeId;
    }

    public String getResponderNodeId() {
        return responderNodeId;
    }

    public String getNonce() {
        return nonce;
    }

    public String getResult() {
        return result;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}