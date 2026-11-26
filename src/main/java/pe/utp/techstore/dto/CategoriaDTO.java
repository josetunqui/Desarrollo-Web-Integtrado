package pe.utp.techstore.dto;

import pe.utp.techstore.entity.Categoria;

public record CategoriaDTO(
        Integer id,
        String nombre,
        int cantidadProductos
) {
    public static CategoriaDTO desdeEntidad(Categoria c) {
        int total = (c.getProductos() != null) ? c.getProductos().size() : 0;
        return new CategoriaDTO(c.getId(), c.getNombre(), total);
    }
}
