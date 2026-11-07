package pe.utp.techstore.service.impl;

import pe.utp.techstore.repository.ProductoRepository;
import pe.utp.techstore.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    @Transactional
    public int aumentarPrecioPorCategoria(Integer categoriaId, double porcentaje) {
        return productoRepository.aumentarPrecioPorCategoria(categoriaId, porcentaje);
    }
}