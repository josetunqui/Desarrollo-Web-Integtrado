package pe.utp.techstore.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.utp.techstore.dto.CategoriaDTO;
import pe.utp.techstore.repository.CategoriaRepository;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    // Devuelve DTO para evitar ciclo infinito JSON (Ticket 7 - Semana 16)
    @GetMapping
    public List<CategoriaDTO> listar() {
        return categoriaRepository.findAll().stream()
                .map(CategoriaDTO::desdeEntidad)
                .toList();
    }
}
