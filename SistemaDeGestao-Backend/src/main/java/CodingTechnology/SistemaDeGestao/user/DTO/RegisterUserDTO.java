package CodingTechnology.SistemaDeGestao.user.DTO;

import lombok.Data;

@Data
public class RegisterUserDTO {
    private String username;
    private String password;
    private String role;
}
