package com.example.cartservice.mapper;

import com.example.cartservice.dto.response.CartItemResponse;
import com.example.cartservice.model.CartItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartMapper {

    CartItemResponse toCartItemResponse(CartItem cartItem);
}
