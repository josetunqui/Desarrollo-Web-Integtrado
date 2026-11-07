package pe.utp.techstore.service.impl;

import pe.utp.techstore.entity.Producto;
import pe.utp.techstore.entity.Venta;
import pe.utp.techstore.repository.ProductoRepository;
import pe.utp.techstore.repository.VentaRepository;
import pe.utp.techstore.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
public class VentaServiceImpl implements VentaService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private VentaRepository ventaRepository;

    @Override
    @Transactional
    public void registrarVenta(Long productoId, int cantidad) {
        //Buscar el producto
        Producto producto = productoRepository.findById(productoId.intValue())
                .orElseThrow(() -> new NoSuchElementException("Producto no encontrado"));

        //Validar stock suficiente
        if (producto.getStock() < cantidad) {
            throw new IllegalStateException("Stock insuficiente para el producto: " + producto.getNombre());
        }

        //Descontar el stock y guardar
        producto.setStock(producto.getStock() - cantidad);
        productoRepository.save(producto);

        //Registrar la venta
        ventaRepository.save(new Venta(productoId, cantidad));
    }
}