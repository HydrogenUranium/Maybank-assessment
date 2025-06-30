package com.dhl.discover.google.helpers;

import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Slf4j
@UtilityClass
public class GoogleApiHelper {

    /**
     * Normalizes a string by converting it to lowercase and optionally trimming intermediate spaces.
     * Then hashes the normalized string using the provided MessageDigest.
     *
     * @param digest the digest to use to hash the normalized string.
     * @param s the string to normalize and hash.
     * @param trimIntermediateSpaces if true, removes all whitespace characters; otherwise, trims leading and trailing spaces.
     * @return the hexadecimal representation of the hash of the normalized string.
     */
    public static String normalizeAndHash(MessageDigest digest, String s, boolean trimIntermediateSpaces) {
        String normalized = s.toLowerCase();
        if (trimIntermediateSpaces) {
            normalized = normalized.replaceAll("\\s+", "");
        } else {
            normalized = normalized.trim();
        }

        byte[] hash = digest.digest(normalized.getBytes(StandardCharsets.UTF_8));
        var result = new StringBuilder();
        for (byte b : hash) {
            result.append(String.format("%02x", b));
        }

        return result.toString();
    }

    /**
     * Returns the result of normalizing and hashing an email address. For this use case, Google Ads
     * requires removal of any '.' characters preceding {@code gmail.com} or {@code googlemail.com}.
     *
     * @param digest the digest to use to hash the normalized string.
     * @param emailAddress the email address to normalize and hash.
     */
    public static String normalizeAndHashEmailAddress(MessageDigest digest, String emailAddress) {
        String normalizedEmail = emailAddress.toLowerCase();
        String[] emailParts = normalizedEmail.split("@");
        if (emailParts.length > 1 && emailParts[1].matches("^(gmail|googlemail)\\.com\\s*")) {
            emailParts[0] = emailParts[0].replace(".", "");
            normalizedEmail = String.format("%s@%s", emailParts[0], emailParts[1]);
        }
        return normalizeAndHash(digest, normalizedEmail, true);
    }

    /**
     * Returns the result of normalizing and hashing an email address using SHA-256.
     * For this use case, Google Ads requires removal of any '.' characters preceding {@code gmail.com} or {@code googlemail.com}.
     *
     * @param emailAddress the email address to normalize and hash.
     * @throws NoSuchAlgorithmException if SHA-256 algorithm is not available.
     */
    public static String normalizeAndHashEmailAddress(String emailAddress) throws NoSuchAlgorithmException {
        var sha256Digest = MessageDigest.getInstance("SHA-256");
        return normalizeAndHashEmailAddress(sha256Digest, emailAddress);
    }
}
