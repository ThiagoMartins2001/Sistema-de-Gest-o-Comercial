package CodingTechnology.SistemaDeGestao.auth.DTO;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}