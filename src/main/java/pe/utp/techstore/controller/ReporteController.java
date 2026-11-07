package pe.utp.techstore.controller;

import pe.utp.techstore.dto.ReporteCategoriaDTO;
import pe.utp.techstore.repository.ProductoRepository;
import pe.utp.techstore.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:4200")
public class ReporteController {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private VentaRepository ventaRepository;

    // Reto avanzado Sesión 7: Precio promedio por categoría
    @GetMapping("/precio-promedio")
    public List<ReporteCategoriaDTO> reportePrecioPromedio() {
        return productoRepository.reportePrecioPromedioPorCategoriaDTO();
    }

    // Ejercicio 1 Sesión 8: Solo ADMIN accede a /api/reportes/ventas
    @GetMapping("/ventas")
    public Map<String, Object> reporteVentas() {
        Map<String, Object> reporte = new HashMap<>();
        reporte.put("totalVentasRegistradas", ventaRepository.count());
        reporte.put("ventas", ventaRepository.findAll());
        return reporte;
    }
}

