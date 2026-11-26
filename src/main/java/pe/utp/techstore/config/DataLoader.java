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
        // Usuarios de prueba (incluye admin/clave123 y cliente/clave123 de la Semana 14)
        asegurarUsuario("admin", "clave123", "ADMIN");
        asegurarUsuario("cliente", "clave123", "CLIENTE");
        asegurarUsuario("gerente1", "clave123", "ADMIN");
        asegurarUsuario("vendedor1", "vendedor123", "VENDEDOR");
        asegurarUsuario("cliente1", "cliente123", "CLIENTE");

        // Cargar categorías y productos iniciales si la BD está vacía
        if (categoriaRepository.count() == 0) {
            Categoria laptops = crearCategoria("Laptops");
            Categoria accesorios = crearCategoria("Accesorios");
            Categoria monitores = crearCategoria("Monitores");

            crearProducto("Laptop Lenovo IdeaPad 5", 2899.9, 12, laptops);
            crearProducto("Mouse Logitech M720", 159.0, 40, accesorios);
            crearProducto("Monitor LG 27\" 4K", 1349.0, 8, monitores);
            crearProducto("Teclado mecánico Redragon", 219.9, 25, accesorios);
            crearProducto("Laptop HP Victus 15", 3599.0, 5, laptops);
            crearProducto("Audífonos Sony WH-1000XM5", 1299.0, 10, accesorios);
            System.out.println(">> Categorías y productos iniciales cargados en TechStore.");
        }
    }

    private void asegurarUsuario(String username, String rawPassword, String rol) {
        if (usuarioRepository.findByUsername(username).isEmpty()) {
            usuarioRepository.save(new Usuario(username, passwordEncoder.encode(rawPassword), rol));
        }
    }

    private Categoria crearCategoria(String nombre) {
        Categoria c = new Categoria();
        c.setNombre(nombre);
        return categoriaRepository.save(c);
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
