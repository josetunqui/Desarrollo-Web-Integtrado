package pe.utp.techstore.dto;

import java.time.LocalDateTime;
import java.util.Map;

// Formato único de error para TODA la API
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String mensaje,
        String ruta,
        Map<String, String> errores
) {}

