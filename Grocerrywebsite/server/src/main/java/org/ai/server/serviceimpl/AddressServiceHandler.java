package org.ai.server.serviceimpl;

import lombok.AllArgsConstructor;
import org.ai.server.Repository.AddressRepository;
import org.ai.server.dto.Response;
import org.ai.server.mapper.DtoConverter;
import org.ai.server.model.AddressEntity;
import org.ai.server.service.AddressService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
public class AddressServiceHandler implements AddressService {

    private final AddressRepository addressRepository;


    @Override
    public Response addAddress(AddressEntity address) {
        if (address == null) {
            return Response.error("Please provide complete address details", 400);
        }

        try {
            AddressEntity savedAddress = addressRepository.save(address);

            return Response.success("Address saved successfully!")
                    .withAddress(DtoConverter.convertAddresstoAddressDto(savedAddress));

        } catch (Exception e) {
            return Response.error("We're having trouble saving your address right now. Please try again in a few minutes.", 500);
        }
    }

    @Override
    public Response getAddressUser(Long userId) {
        if (userId == null) {
            return Response.error("Please provide your user information", 400);
        }

        try {
            List<AddressEntity> addresses = addressRepository.findByUserId(userId);

            if (addresses == null) {
                return Response.error("We couldn't find your address information", 500);
            }

            if (addresses.isEmpty()) {
                return Response.success("You haven't saved any addresses yet")
                        .withAddress(Collections.emptyList());
            }

            return Response.success("Here are your saved addresses")
                    .withAddress(DtoConverter.convertAddressListToAddressDtoList(addresses));

        } catch (Exception e) {
            return Response.error("We're having trouble loading your addresses right now. Please try again later.", 500);
        }
    }
}
