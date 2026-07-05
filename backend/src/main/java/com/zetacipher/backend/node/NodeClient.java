package com.zetacipher.backend.node;

import com.zetacipher.backend.crypto.HMACUtil;
import com.zetacipher.backend.model.HandshakeLog;
import com.zetacipher.backend.repository.HandshakeLogRepository;

import java.io.*;
import java.net.Socket;
import java.util.UUID;

public class NodeClient {

    private Node node;
    private HandshakeLogRepository logRepository;

    public NodeClient(Node node, HandshakeLogRepository logRepository) {
        this.node = node;
        this.logRepository = logRepository;
    }

    public boolean challengeNeighbor() {
        String nonce = UUID.randomUUID().toString();
        String result;
        boolean trusted = false;

        try (
            Socket socket = new Socket(node.getNextNodeHost(), node.getNextNodePort());
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))
        ) {
            out.println(nonce);
            System.out.println(node.getNodeId() + " sent nonce to neighbor: " + nonce);

            String receivedHMAC = in.readLine();
            String expectedHMAC = HMACUtil.generateHMAC(nonce, node.getSecretKey());

            trusted = expectedHMAC.equals(receivedHMAC);
            result = trusted ? "TRUSTED" : "QUARANTINED";

            if (trusted) {
                System.out.println(node.getNodeId() + " -> Neighbor TRUSTED ✅");
            } else {
                System.out.println(node.getNodeId() + " -> Neighbor QUARANTINED 🚫");
            }

        } catch (IOException e) {
            System.out.println(node.getNodeId() + " could not reach neighbor: " + e.getMessage());
            result = "QUARANTINED";
        }

        // Save this handshake attempt to the database
        HandshakeLog log = new HandshakeLog(
                node.getNodeId(),
                node.getNextNodeId(),
                nonce,
                result
        );
        logRepository.save(log);

        return trusted;
    }
}