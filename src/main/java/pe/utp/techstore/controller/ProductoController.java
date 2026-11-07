package pe.utp.techstore.controller;

import pe.utp.techstore.dto.ReporteCategoriaDTO;
import pe.utp.techstore.entity.Producto;
import pe.utp.techstore.repository.ProductoRepository;
import pe.utp.techstore.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ProductoService productoService;

    // Listar todos los productos
    @GetMapping
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    // Consultar stock bajo
    @GetMapping("/stock-bajo")
    public List<Producto> obtenerStockBajo(
            @RequestParam(defaultValue = "5") int limite) {
        return productoRepository.buscarConStockBajo(limite);
    }

    // Listar por categoría
    @GetMapping("/categoria/{nombreCategoria}")
    public List<Producto> obtenerPorCategoria(
            @PathVariable String nombreCategoria) {
        return productoRepository.listarPorCategoriaOrdenado(nombreCategoria);
    }

    // Aumento masivo de precios
    @PutMapping("/categoria/{categoriaId}/aumentar-precio")
    public String aumentarPrecio(
            @PathVariable Integer categoriaId,
            @RequestParam double porcentaje) {
        int filas = productoService.aumentarPrecioPorCategoria(categoriaId, porcentaje);
        return filas + " producto(s) actualizado(s).";
    }

    // Buscar por id
    @GetMapping("/{id}")
    public Producto obtenerPorId(@PathVariable Integer id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
    }
}
