package com.example.cartservice.controller;

import com.example.cartservice.dto.request.UpdateQuantityRequest;
import com.example.cartservice.dto.response.ApiResponse;
import com.example.cartservice.dto.response.CartItemResponse;
import com.example.cartservice.model.Cart;
import com.example.cartservice.model.CartItem;
import com.example.cartservice.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;


    @PostMapping("/create")
    public ApiResponse<Cart> createCart(@RequestParam String customerEmail) {
        return ApiResponse.<Cart>builder()
                .data(cartService.createCart(customerEmail))
                .build();
    }

    @PostMapping("/items")
    public ApiResponse<Cart> addItemsToCart(@RequestBody CartItem cartItem) {
        return ApiResponse.<Cart>builder()
                .data(cartService.addItemToCart(cartItem))
                .build();
    }

    @GetMapping()
    public ApiResponse<List<CartItemResponse>> getAllItems(){
        return ApiResponse.<List<CartItemResponse>>builder()
                .data(cartService.getCartItems())
                .build();
    }


    @PutMapping("/{id}")
    public ApiResponse<Void> updateQuantity(@PathVariable String id, @RequestBody UpdateQuantityRequest request){
        cartService.updateCartItemQuantity(id, request);
        return ApiResponse.<Void>builder().build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<Void> removeItem(@PathVariable String id){
        cartService.removeItemFromCart(id);
        return ApiResponse.<Void>builder().build();
    }
}
