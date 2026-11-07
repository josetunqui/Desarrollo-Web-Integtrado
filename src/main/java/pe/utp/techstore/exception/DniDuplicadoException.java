package pe.utp.techstore.exception;

// Regla de negocio: no pueden existir dos clientes con el mismo DNI
public class DniDuplicadoException extends RuntimeException {
    public DniDuplicadoException(String dni) {
        super("Ya existe un cliente registrado con el DNI " + dni);
    }
}

