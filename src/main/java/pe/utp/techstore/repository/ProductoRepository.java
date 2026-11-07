package pe.utp.techstore.repository;

import pe.utp.techstore.dto.ReporteCategoriaDTO;
import pe.utp.techstore.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    // Parte 1: Stock bajo con parámetro con nombre
    @Query("SELECT p FROM Producto p WHERE p.stock < :stockMinimo")
    List<Producto> buscarConStockBajo(@Param("stockMinimo") int stockMinimo);

    // Parte 2: Listar por categoría con JOIN y ordenados por precio ascendente
    @Query("SELECT p FROM Producto p JOIN p.categoria c WHERE c.nombre = :nombreCategoria ORDER BY p.precio ASC")
    List<Producto> listarPorCategoriaOrdenado(@Param("nombreCategoria") String nombreCategoria);

    // Parte 3: Actualización masiva de precios
    @Modifying
    @Query("UPDATE Producto p SET p.precio = p.precio * (1 + :porcentaje / 100.0) WHERE p.categoria.id = :categoriaId")
    int aumentarPrecioPorCategoria(@Param("categoriaId") Integer categoriaId, @Param("porcentaje") double porcentaje);

    // Reto avanzado (Sesión 7): Reporte de precio promedio por categoría
    @Query("SELECT new pe.utp.techstore.dto.ReporteCategoriaDTO(c.nombre, AVG(p.precio)) " +
           "FROM Producto p JOIN p.categoria c GROUP BY c.nombre ORDER BY c.nombre")
    List<ReporteCategoriaDTO> reportePrecioPromedioPorCategoriaDTO();

    @Query("SELECT c.nombre, AVG(p.precio) FROM Producto p JOIN p.categoria c GROUP BY c.nombre ORDER BY c.nombre")
    List<Object[]> reportePrecioPromedioPorCategoria();
}
