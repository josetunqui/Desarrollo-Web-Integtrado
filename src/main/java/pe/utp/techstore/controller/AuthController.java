package pe.utp.techstore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import pe.utp.techstore.dto.LoginRequest;
import pe.utp.techstore.dto.LoginResponse;
import pe.utp.techstore.security.JwtService;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authManager, JwtService jwtService) {
        this.authManager = authManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req.username() == null || req.username().isBlank()
                || req.password() == null || req.password().isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("estado", 400, "mensaje", "Usuario y clave son obligatorios"));
        }

        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username(), req.password()));

        UserDetails user = (UserDetails) auth.getPrincipal();
        String token = jwtService.generarToken(user);
        String rol = user.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("ROLE_CLIENTE");

        return ResponseEntity.ok(new LoginResponse(
                token,
                "Bearer",
                user.getUsername(),
                rol,
                jwtService.getExpirationMs() / 1000
        ));
    }

    // Endpoint de Semana 14: requiere token válido
    @GetMapping("/perfil")
    public Map<String, String> perfil(Authentication auth) {
        String rol = auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("ROLE_CLIENTE");
        return Map.of(
                "usuario", auth.getName(),
                "rol", rol,
                "mensaje", "Token válido: el back-end te reconoció."
        );
    }

    // Endpoint de Semana 9: información del usuario autenticado
    @GetMapping("/auth/me")
    public ResponseEntity<?> usuarioActual(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("estado", 401, "mensaje", "No autenticado"));
        }
        return ResponseEntity.ok(Map.of(
                "username", auth.getName(),
                "authorities", auth.getAuthorities()
        ));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> credencialesIncorrectas() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("estado", 401, "mensaje", "Credenciales incorrectas"));
    }
}
