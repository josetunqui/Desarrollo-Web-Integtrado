package pe.utp.techstore.dto;

public record LoginResponse(
        String token,
        String tipo,
        String usuario,
        String rol,
        long expiraEn
) {}
