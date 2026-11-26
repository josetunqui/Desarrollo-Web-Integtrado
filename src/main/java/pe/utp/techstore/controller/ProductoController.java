package pe.utp.techstore.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utp.techstore.dto.ProductoDTO;
import pe.utp.techstore.dto.ProductoRequest;
import pe.utp.techstore.entity.Categoria;
import pe.utp.techstore.entity.Producto;
import pe.utp.techstore.exception.RecursoNoEncontradoException;
import pe.utp.techstore.repository.CategoriaRepository;
import pe.utp.techstore.repository.ProductoRepository;
import pe.utp.techstore.service.ProductoService;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoService productoService;

    public ProductoController(ProductoRepository productoRepository,
                              CategoriaRepository categoriaRepository,
                              ProductoService productoService) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.productoService = productoService;
    }

    // Público: listar todos los productos o filtrar por ?q=texto (nombre o categoría)
    @GetMapping
    public List<ProductoDTO> listar(@RequestParam(defaultValue = "") String q) {
        String texto = q.trim().toLowerCase();
        return productoRepository.findAll().stream()
                .map(ProductoDTO::from)
                .filter(p -> texto.isEmpty()
                        || p.nombre().toLowerCase().contains(texto)
                        || p.categoria().toLowerCase().contains(texto))
                .sorted(Comparator.comparing(ProductoDTO::id))
                .toList();
    }

    // Público: consultar stock bajo (Sesión 7)
    @GetMapping("/stock-bajo")
    public List<ProductoDTO> obtenerStockBajo(@RequestParam(defaultValue = "5") int limite) {
        return productoRepository.buscarConStockBajo(limite).stream()
                .map(ProductoDTO::from)
                .toList();
    }

    // Público: listar por categoría ordenado por precio (Sesión 7)
    @GetMapping("/categoria/{nombreCategoria}")
    public List<ProductoDTO> obtenerPorCategoria(@PathVariable String nombreCategoria) {
        return productoRepository.listarPorCategoriaOrdenado(nombreCategoria).stream()
                .map(ProductoDTO::from)
                .toList();
    }

    // Solo ADMIN: aumento masivo de precios (Sesión 7)
    @PutMapping("/categoria/{categoriaId}/aumentar-precio")
    public String aumentarPrecio(@PathVariable Integer categoriaId,
                                 @RequestParam double porcentaje) {
        int filas = productoService.aumentarPrecioPorCategoria(categoriaId, porcentaje);
        return filas + " producto(s) actualizado(s).";
    }

    // Público: buscar por id (devuelve 404 JSON si no existe)
    @GetMapping("/{id}")
    public ProductoDTO obtenerPorId(@PathVariable Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con id: " + id));
        return ProductoDTO.from(producto);
    }

    // Solo ROLE_ADMIN: crear producto (Sesión 14 + Bean Validation Sesión 13)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoDTO crear(@Valid @RequestBody ProductoRequest req) {
        Categoria categoria = obtenerOCrearCategoria(req.categoria());
        Producto producto = new Producto();
        producto.setNombre(req.nombre().trim());
        producto.setCategoria(categoria);
        producto.setPrecio(req.precio());
        producto.setStock(req.stock());
        return ProductoDTO.from(productoRepository.save(producto));
    }

    // Solo ROLE_ADMIN: actualizar producto (Reto 3 Sesión 14)
    @PutMapping("/{id}")
    public ProductoDTO actualizar(@PathVariable Integer id,
                                  @Valid @RequestBody ProductoRequest req) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con id: " + id));
        Categoria categoria = obtenerOCrearCategoria(req.categoria());
        producto.setNombre(req.nombre().trim());
        producto.setCategoria(categoria);
        producto.setPrecio(req.precio());
        producto.setStock(req.stock());
        return ProductoDTO.from(productoRepository.save(producto));
    }

    // Solo ROLE_ADMIN: eliminar producto (Sesión 14 -> 204 No Content)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        if (!productoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Producto no encontrado con id: " + id);
        }
        productoRepository.deleteById(id);
    }

    private Categoria obtenerOCrearCategoria(String nombreCategoria) {
        String limpio = nombreCategoria.trim();
        return categoriaRepository.findByNombreIgnoreCase(limpio)
                .orElseGet(() -> {
                    Categoria nueva = new Categoria();
                    nueva.setNombre(limpio);
                    return categoriaRepository.save(nueva);
                });
    }
}
