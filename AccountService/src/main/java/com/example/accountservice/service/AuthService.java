package com.example.accountservice.service;

import com.example.accountservice.dto.request.IntrospectRequest;
import com.example.accountservice.dto.request.LoginUserRequest;
import com.example.accountservice.dto.request.LogoutRequest;
import com.example.accountservice.dto.request.RefreshTokenRequest;
import com.example.accountservice.dto.response.IntrospectResponse;
import com.example.accountservice.dto.response.LoginUserResponse;
import com.example.accountservice.exception.AppException;
import com.example.accountservice.exception.ErrorCode;
import com.example.accountservice.model.InvalidToken;
import com.example.accountservice.model.User;
import com.example.accountservice.repo.InvalidTokenRepository;
import com.example.accountservice.repo.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    InvalidTokenRepository invalidTokenRepository;

    @Value("${jwt.secretKey}")
    protected String SECRET_KEY;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginUserResponse authenticated(LoginUserRequest request){
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if(!user.isActivate()){
            throw new AppException(ErrorCode.ACCOUNT_UNACTIVATED);
        }

        if(user.isLock()){
            throw new AppException(ErrorCode.ACCOUNT_LOCKED);
        }

        System.out.println("Login user: " + user.getEmail());
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
//        System.out.println("match "+ authenticated);

        if(!authenticated){
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        }

        var token = generateToken(user);

        var roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());

        return LoginUserResponse.builder()
                .token(token)
                .authenticated(true)
                .roles(roles)
                .build();

    }

    private String generateToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope",buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try{
            jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
            return jwsObject.serialize();
        }
        catch (JOSEException e){

            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles())){
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if(!CollectionUtils.isEmpty(role.getPermissions())){
                    role.getPermissions().forEach(permission ->
                            stringJoiner.add(permission.getName()));
                }
            });
        }
        return stringJoiner.toString();
    }

    private SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (invalidTokenRepository
                .existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    public IntrospectResponse validateToken(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();

        boolean isValid = true;
        try {
            verifyToken(token);
            System.out.println("verify token " + verifyToken(token));
        }catch (AppException exception){


            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();

    }
    public LoginUserResponse refreshToken(RefreshTokenRequest request) throws ParseException, JOSEException {
        var signJWT = verifyToken(request.getToken());

        var jit = signJWT.getJWTClaimsSet().getJWTID();
        var expirationTime = signJWT.getJWTClaimsSet().getExpirationTime();

        InvalidToken invalidToken = InvalidToken.builder()
                .id(jit)
                .expireTime(expirationTime)
                .build();

        invalidTokenRepository.save(invalidToken);

//        Create new Token

        var email = signJWT.getJWTClaimsSet().getSubject();
        var user = userRepository.findByEmail(email).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));

        var token = generateToken(user);

        return LoginUserResponse.builder()
                .token(token)
                .authenticated(true)
                .build();

    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        var signToken = verifyToken(request.getToken());

        String jit = signToken.getJWTClaimsSet().getJWTID();
        Date expirateTime = signToken.getJWTClaimsSet().getExpirationTime();

        InvalidToken invalidToken = InvalidToken.builder()
                .id(jit)
                .expireTime(expirateTime)
                .build();

        invalidTokenRepository.save(invalidToken);

    }
}