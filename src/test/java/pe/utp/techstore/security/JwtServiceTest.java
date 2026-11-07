package pe.utp.techstore.security;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtServiceTest {

    static final String SECRET = "dXRwLXNlc2lvbjktand0LWNsYXZlLWRlbW8tMjU2Yml0cy0yMDI2";

    // Token vencido firmado con la misma clave (del laboratorio Semana 9)
    static final String TOKEN_VENCIDO = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
            + "eyJzdWIiOiJkb2NlbnRlMSIsInJvbCI6IlJPTEVfRE9DRU5URSIsImlh"
            + "dCI6MTc4ODAwMDAwMCwiZXhwIjoxNzg4MDAzNjAwfQ."
            + "fRQl0HWN0IBHC1V4aAqcK0GSk1MxSbYkRevRpHB6vDc";

    final JwtService jwt = new JwtService(SECRET, 3_600_000);

    @Test
    void generaTokenValido() {
        UserDetails u = User.withUsername("cliente1")
                .password("x").roles("CLIENTE").build();

        String token = jwt.generarToken(u);

        assertEquals(3, token.split("\\.").length);
        assertEquals("cliente1", jwt.extraerUsername(token));
        assertEquals("ROLE_CLIENTE", jwt.extraerClaims(token).get("rol", String.class));
    }

    @Test
    void tokenVencidoLanzaExcepcion() {
        assertThrows(ExpiredJwtException.class, () -> jwt.extraerClaims(TOKEN_VENCIDO));
    }
}
