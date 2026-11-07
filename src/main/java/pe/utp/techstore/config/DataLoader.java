package pe.utp.techstore.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pe.utp.techstore.entity.Categoria;
import pe.utp.techstore.entity.Producto;
import pe.utp.techstore.entity.Usuario;
import pe.utp.techstore.repository.CategoriaRepository;
import pe.utp.techstore.repository.ProductoRepository;
import pe.utp.techstore.repository.UsuarioRepository;

@Component
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UsuarioRepository usuarioRepository,
                      ProductoRepository productoRepository,
                      CategoriaRepository categoriaRepository,
                      PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Cargar usuarios si no existen
        if (usuarioRepository.count() == 0) {
            usuarioRepository.save(new Usuario("admin", passwordEncoder.encode("admin123"), "ADMIN"));
            usuarioRepository.save(new Usuario("gerente1", passwordEncoder.encode("clave123"), "ADMIN"));
            usuarioRepository.save(new Usuario("vendedor1", passwordEncoder.encode("vendedor123"), "VENDEDOR"));
            usuarioRepository.save(new Usuario("cliente1", passwordEncoder.encode("cliente123"), "CLIENTE"));
            System.out.println(">> Usuarios iniciales cargados en TechStore.");
        }

        // Cargar categorías y productos iniciales si la BD está vacía
        if (categoriaRepository.count() == 0) {
            Categoria laptops = new Categoria();
            laptops.setNombre("Laptops");
            categoriaRepository.save(laptops);

            Categoria accesorios = new Categoria();
            accesorios.setNombre("Accesorios");
            categoriaRepository.save(accesorios);

            Categoria monitores = new Categoria();
            monitores.setNombre("Monitores");
            categoriaRepository.save(monitores);

            crearProducto("Laptop Lenovo IdeaPad", 2499.0, 8, laptops);
            crearProducto("Mouse Logitech M280", 49.9, 25, accesorios);
            crearProducto("Teclado Redragon K552", 159.0, 0, accesorios);
            crearProducto("Monitor Samsung 24\"", 599.0, 4, monitores);
            crearProducto("Laptop HP Victus", 3199.0, 3, laptops);
            crearProducto("Audífonos Sony WH-CH520", 229.0, 12, accesorios);
            System.out.println(">> Categorías y productos iniciales cargados.");
        }
    }

    private void crearProducto(String nombre, double precio, int stock, Categoria cat) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setPrecio(precio);
        p.setStock(stock);
        p.setCategoria(cat);
        productoRepository.save(p);
    }
}

