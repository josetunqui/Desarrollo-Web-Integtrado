package pe.utp.techstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record ProductoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 3, message = "El nombre debe tener al menos 3 caracteres")
        String nombre,

        @NotBlank(message = "La categoría es obligatoria")
        String categoria,

        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser mayor a 0")
        Double precio,

        @NotNull(message = "El stock es obligatorio")
        @PositiveOrZero(message = "El stock no puede ser negativo")
        Integer stock
) {}
