package pe.utp.techstore.dto;

import pe.utp.techstore.entity.Producto;

public record ProductoDTO(
        Integer id,
        String nombre,
        String categoria,
        double precio,
        int stock
) {
    public static ProductoDTO from(Producto p) {
        String nombreCategoria = (p.getCategoria() != null && p.getCategoria().getNombre() != null)
                ? p.getCategoria().getNombre()
                : "General";
        return new ProductoDTO(p.getId(), p.getNombre(), nombreCategoria, p.getPrecio(), p.getStock());
    }
}
