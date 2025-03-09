/*
package com.sudoers.elvitrinabackend.service.user;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    public static final String  SECRET_KEY ="d3ed356e113bb5ca19fcd6ab061d201716342b2438ad5e27152701d415f1a098c8d79256b8a76a60557378966eec95d3a7e2774e098c1e44db6db3d08b6a73e288e7d52477973b05701292921e6a68d6b06b58e00b1d4618b3650a73233ea043898866a517f9c8c917bc8df217b7997f1d4c273e656ff266146eb98ea71e363f2acf0b085396f69b64121dfd36fdafb097460e07f01d0aed54cd706703c786085fc30cfc03a32f913115c94f7f6ea3ebd1d2983f97c94be3cbf62f056082afe8614e08be07cf1205d370fcfb9de599b231a31e0a42e9dc409cde8d36d6003a2eb1e9079dc29b88c38a8d648e8a9cd64e2333ebadacc96efbbba8d94d15c90b1c";

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token,
                              Function<Claims, T> claimsResolver) {
        final Claims clailms = extractAllClaims(token);
        return claimsResolver.apply(clailms);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+ 1000 * 60 * 24))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token,
                                UserDetails userDetails)
    {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

 */
