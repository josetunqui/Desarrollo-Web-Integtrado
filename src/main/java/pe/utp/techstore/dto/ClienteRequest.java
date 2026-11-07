package pe.utp.techstore.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClienteRequest(
        @NotBlank(message = "Los nombres son obligatorios")
        @Size(min = 2, max = 50, message = "Los nombres deben tener entre 2 y 50 caracteres")
        String nombres,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(min = 2, max = 50, message = "Los apellidos deben tener entre 2 y 50 caracteres")
        String apellidos,

        @NotBlank(message = "El DNI es obligatorio")
        @Pattern(regexp = "\\d{8}", message = "El DNI debe tener exactamente 8 dígitos")
        String dni,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no tiene un formato válido")
        String email,

        @NotBlank(message = "El celular es obligatorio")
        @Pattern(regexp = "9\\d{8}", message = "El celular debe tener 9 dígitos y empezar con 9")
        String celular,

        @NotBlank(message = "El tipo de comprobante es obligatorio")
        @Pattern(regexp = "BOLETA|FACTURA", message = "El comprobante debe ser BOLETA o FACTURA")
        String tipoComprobante,

        String ruc,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
        String password,

        @NotNull(message = "Debe aceptar los términos y condiciones")
        @AssertTrue(message = "Debe aceptar los términos y condiciones")
        Boolean aceptaTerminos
) {
    // Validación cruzada: si pide FACTURA, el RUC es obligatorio y debe ser válido
    @AssertTrue(message = "Para FACTURA el RUC es obligatorio: 11 dígitos que empiezan con 10 o 20")
    public boolean isRucValido() {
        if (!"FACTURA".equals(tipoComprobante)) {
            return true;
        }
        return ruc != null && ruc.matches("(10|20)\\d{9}");
    }
}

