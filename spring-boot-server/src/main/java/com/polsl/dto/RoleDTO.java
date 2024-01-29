package com.polsl.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;
@Getter
@Setter
public class RoleDTO {
    private Integer id;
    private String name;
    private Set<Long> userIds;
}

