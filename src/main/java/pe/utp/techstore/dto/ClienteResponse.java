package pe.utp.techstore.dto;

import java.time.LocalDateTime;

// DTO de salida: nunca devolvemos la contraseña
public record ClienteResponse(
        Long id,
        String nombres,
        String apellidos,
        String dni,
        String email,
        String celular,
        String tipoComprobante,
        String ruc,
        LocalDateTime fechaRegistro
) {}

