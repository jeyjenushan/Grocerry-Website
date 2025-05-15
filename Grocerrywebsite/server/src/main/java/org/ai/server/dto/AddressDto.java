package org.ai.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDto {
    private Long id;

    private Long userId;

    private String firstName;

    private String lastName;

    private String email;

    private String street;
    private String city;
    private String state;

    private Integer zipcode;

    private String country;

    private String phone;
}
