package com.example.cartservice.service;

import com.example.cartservice.dto.request.UpdateQuantityRequest;
import com.example.cartservice.dto.response.CartItemResponse;
import com.example.cartservice.exception.AppException;
import com.example.cartservice.exception.ErrorCode;
import com.example.cartservice.mapper.CartMapper;
import com.example.cartservice.model.Cart;
import com.example.cartservice.model.CartItem;
import com.example.cartservice.repo.CartItemRepository;
import com.example.cartservice.repo.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartMapper cartMapper;

    public Cart createCart(String customerEmail) {
        Cart cart = Cart.builder()
                .customerEmail(customerEmail)
                .build();
        return cartRepository.save(cart);
    }

    public Cart addItemToCart(CartItem cartItem) {
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

//        var cart = cartRepository.findByCustomerEmail(email)
//                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        Optional<Cart> optionalCart = cartRepository.findByCustomerEmail(email);

        if(!optionalCart.isPresent()){
            createCart(email);
        }
//        Cart cart;
        var cart = optionalCart.get();

        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(item -> item.getTitle().equals(cartItem.getTitle()))
                .findFirst();

        if (existingCartItem.isPresent()) {
            CartItem item = existingCartItem.get();
            item.setQuantity(item.getQuantity() + (cartItem.getQuantity() > 0 ? cartItem.getQuantity() : 1));
            cartItemRepository.save(item);
        } else {
            if (cartItem.getQuantity() <= 0) {
                cartItem.setQuantity(1);
            }
            cartItem.setCart(cart);
            cart.getItems().add(cartItem);
            cartItemRepository.save(cartItem);
        }
        return cartRepository.save(cart);



    }

    public List<CartItemResponse> getCartItems() {
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();



        var cartItems = cartItemRepository.findAllByCustomerEmail(email) ;

        return cartItems.stream()
                .map(cartMapper::toCartItemResponse)
                .collect(Collectors.toList());

    }

    public CartItem updateCartItemQuantity(String cartItemId, UpdateQuantityRequest request) {
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        var cart = cartRepository.findByCustomerEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!cart.getItems().contains(cartItem)) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        cartItem.setQuantity(request.getQuantity());
        return cartItemRepository.save(cartItem);
    }

    public void removeItemFromCart(String cartItemId) {
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        var cart = cartRepository.findByCustomerEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!cart.getItems().contains(cartItem)) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        cartRepository.save(cart);
    }
}
