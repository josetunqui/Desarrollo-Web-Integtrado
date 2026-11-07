package pe.utp.techstore.controller;

import pe.utp.techstore.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @PostMapping
    public ResponseEntity<String> registrarVenta(
            @RequestParam Long productoId,
            @RequestParam int cantidad) {
        try {
            ventaService.registrarVenta(productoId, cantidad);
            return ResponseEntity.ok("Venta registrada correctamente.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error inesperado: " + e.getMessage());
        }
    }
}