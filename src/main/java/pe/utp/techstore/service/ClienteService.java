package pe.utp.techstore.service;

import org.springframework.stereotype.Service;
import pe.utp.techstore.dto.ClienteRequest;
import pe.utp.techstore.dto.ClienteResponse;
import pe.utp.techstore.exception.DniDuplicadoException;
import pe.utp.techstore.exception.RecursoNoEncontradoException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ClienteService {

    private final Map<Long, ClienteResponse> clientes = new ConcurrentHashMap<>();
    private final AtomicLong secuencia = new AtomicLong(0);

    public ClienteResponse registrar(ClienteRequest req) {
        boolean dniExiste = clientes.values().stream()
                .anyMatch(c -> c.dni().equals(req.dni()));
        if (dniExiste) {
            throw new DniDuplicadoException(req.dni());
        }

        Long id = secuencia.incrementAndGet();
        String ruc = "FACTURA".equals(req.tipoComprobante()) ? req.ruc() : null;
        ClienteResponse nuevo = new ClienteResponse(
                id,
                req.nombres().trim(),
                req.apellidos().trim(),
                req.dni(),
                req.email().toLowerCase(),
                req.celular(),
                req.tipoComprobante(),
                ruc,
                LocalDateTime.now()
        );
        clientes.put(id, nuevo);
        return nuevo;
    }

    public List<ClienteResponse> listar() {
        return List.copyOf(clientes.values());
    }

    public ClienteResponse buscarPorId(Long id) {
        ClienteResponse cliente = clientes.get(id);
        if (cliente == null) {
            throw new RecursoNoEncontradoException("No existe el cliente con id " + id);
        }
        return cliente;
    }
}

