package pe.utp.techstore.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import pe.utp.techstore.dto.ErrorResponse;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

// Atrapa las excepciones de TODOS los controladores y responde un JSON uniforme
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 400: falló alguna anotación de Bean Validation (@NotBlank, @Pattern, ...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> manejarValidacion(MethodArgumentNotValidException ex,
                                                          HttpServletRequest request) {
        Map<String, String> errores = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errores.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        return construir(HttpStatus.BAD_REQUEST, "Hay campos con datos inválidos", request, errores);
    }

    // 400: el cuerpo no es un JSON válido (falta una llave, una coma, etc.)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> manejarJsonInvalido(HttpMessageNotReadableException ex,
                                                            HttpServletRequest request) {
        return construir(HttpStatus.BAD_REQUEST, "El cuerpo de la petición no es un JSON válido",
                request, Map.of());
    }

    // 409: regla de negocio (DNI repetido)
    @ExceptionHandler(DniDuplicadoException.class)
    public ResponseEntity<ErrorResponse> manejarDniDuplicado(DniDuplicadoException ex,
                                                            HttpServletRequest request) {
        return construir(HttpStatus.CONFLICT, "No se pudo completar el registro.", request,
                Map.of("dni", ex.getMessage()));
    }

    // 404: el recurso pedido no existe
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> manejarNoEncontrado(RecursoNoEncontradoException ex,
                                                            HttpServletRequest request) {
        return construir(HttpStatus.NOT_FOUND, ex.getMessage(), request, Map.of());
    }

    // 404: la URL no corresponde a ningún endpoint
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> manejarRutaInexistente(NoResourceFoundException ex,
                                                               HttpServletRequest request) {
        return construir(HttpStatus.NOT_FOUND, "La ruta solicitada no existe", request, Map.of());
    }

    // 500: cualquier error no previsto. Se registra en el log, pero NO se muestra el detalle técnico al cliente
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> manejarGeneral(Exception ex, HttpServletRequest request) {
        log.error("Error no controlado en {}", request.getRequestURI(), ex);
        return construir(HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocurrió un error interno. Inténtalo más tarde.", request, Map.of());
    }

    private ResponseEntity<ErrorResponse> construir(HttpStatus status, String mensaje,
                                                   HttpServletRequest request,
                                                   Map<String, String> errores) {
        ErrorResponse cuerpo = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                mensaje,
                request.getRequestURI(),
                errores
        );
        return ResponseEntity.status(status).body(cuerpo);
    }
}

