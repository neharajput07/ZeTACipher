package com.zetacipher.backend.crypto;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class HMACUtil {

    private static final String ALGORITHM = "HmacSHA256";

    // Generates HMAC-SHA256 hash of (message + secretKey)
    public static String generateHMAC(String message, String secretKey) {
        try {
            Mac mac = Mac.getInstance(ALGORITHM);
            SecretKeySpec keySpec = new SecretKeySpec(
                    secretKey.getBytes(),
                    ALGORITHM
            );
            mac.init(keySpec);

            byte[] hashBytes = mac.doFinal(message.getBytes());

            return Base64.getEncoder().encodeToString(hashBytes);

        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC", e);
        }
    }

    // Verifies if a received HMAC matches the expected one
    public static boolean verifyHMAC(String message, String secretKey, String receivedHMAC) {
        String expectedHMAC = generateHMAC(message, secretKey);
        return expectedHMAC.equals(receivedHMAC);
    }
}