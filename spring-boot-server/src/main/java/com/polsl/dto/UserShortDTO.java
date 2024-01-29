package com.polsl.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserShortDTO {
    String username;
    public UserShortDTO(String username){
        this.username = username;
    }
}
