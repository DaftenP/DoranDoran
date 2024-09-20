package com.e102.config;

import com.e102.jwt.entity.RefreshToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Value("${spring.redis.host}")
    private String host;

    @Value("${spring.redis.port}")
    private String port;

//    @Value("${spring.redis.password}")
//    private String password;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(host);
        redisStandaloneConfiguration.setPort(Integer.parseInt(port));
        //redisStandaloneConfiguration.setPassword(password);
        LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory(redisStandaloneConfiguration);
        return lettuceConnectionFactory;
    }

    @Bean(name = "refreshTokenRedisTemplate")
    public RedisTemplate<Integer, RefreshToken> redisTemplate() {
        RedisTemplate<Integer, RefreshToken> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());

        // key serializer: Integer -> String
        redisTemplate.setKeySerializer(new RedisSerializer<Integer>() {
            @Override
            public byte[] serialize(Integer integer) throws SerializationException {
                return integer == null ? null : integer.toString().getBytes();
            }

            @Override
            public Integer deserialize(byte[] bytes) throws SerializationException {
                return bytes == null ? null : Integer.parseInt(new String(bytes));
            }
        });

        // value serializer: RefreshToken -> JSON
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        return redisTemplate;
    }

    @Bean(name = "emailRedisTemplate")
    public RedisTemplate<String, Integer> redisEmailTemplate() {
        RedisTemplate<String, Integer> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());

        // key serializer: String
        redisTemplate.setKeySerializer(new StringRedisSerializer());

        // value serializer: Integer -> String
        redisTemplate.setValueSerializer(new RedisSerializer<Integer>() {
            @Override
            public byte[] serialize(Integer integer) throws SerializationException {
                return integer == null ? null : integer.toString().getBytes();
            }

            @Override
            public Integer deserialize(byte[] bytes) throws SerializationException {
                return bytes == null ? null : Integer.parseInt(new String(bytes));
            }
        });



        return redisTemplate;
    }

}
