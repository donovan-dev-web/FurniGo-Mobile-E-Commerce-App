package com.furnigo.common.exception;

/** Exception levée quand une ressource est introuvable en base. */
public class ResourceNotFoundException extends RuntimeException {

    /** Constructeur avec message d'erreur. */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}