package com.zetacipher.backend.node;

import com.zetacipher.backend.crypto.HMACUtil;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class NodeServer implements Runnable {

    private Node node;

    public NodeServer(Node node) {
        this.node = node;
    }

    @Override
    public void run() {
        try (ServerSocket serverSocket = new ServerSocket(node.getPort())) {
            System.out.println(node.getNodeId() + " listening on port " + node.getPort());

            while (true) {
                // Wait for an incoming connection (a challenge)
                Socket clientSocket = serverSocket.accept();

                handleConnection(clientSocket);
            }

        } catch (IOException e) {
            System.out.println(node.getNodeId() + " server error: " + e.getMessage());
        }
    }

    private void handleConnection(Socket clientSocket) {
        try (
            BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)
        ) {
            // Receive the nonce (challenge) from the calling node
            String nonce = in.readLine();
            System.out.println(node.getNodeId() + " received nonce: " + nonce);

            // Compute HMAC using nonce + this node's secret key
            String hmacResponse = HMACUtil.generateHMAC(nonce, node.getSecretKey());

            // Send the HMAC back as the response
            out.println(hmacResponse);

            clientSocket.close();

        } catch (IOException e) {
            System.out.println(node.getNodeId() + " connection error: " + e.getMessage());
        }
    }
}