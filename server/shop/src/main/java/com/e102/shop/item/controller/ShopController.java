package com.e102.shop.item.controller;

import com.e102.shop.common.ResponseDto;
import com.e102.shop.common.exception.StatusCode;
import com.e102.shop.item.ShopService;
import com.e102.shop.item.dto.ItemResponseDTO;
import com.e102.shop.item.dto.RandomResponseDTO;
import com.e102.shop.item.dto.SpecResponseDTO;
import com.e102.shop.item.entity.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/store")
public class ShopController {

    private final ShopService shopService;

    @Autowired
    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }


    @GetMapping("/shop/all")
    public ResponseEntity<ResponseDto> shopEntered(){
        List<ItemResponseDTO> lst = shopService.getAll();

        if(lst.isEmpty()){
            return ResponseDto.response(StatusCode.BAD_REQUEST);
        }
        else{
            return ResponseDto.response(StatusCode.SUCCESS,lst);
        }

    }

    @GetMapping("/shop/{type}/all")
    public ResponseEntity<ResponseDto> allSpecList(@PathVariable("type") int type){
        List<Item> lst = shopService.getAllSpec(type);

        if(lst.isEmpty()){
            return ResponseDto.response(StatusCode.BAD_REQUEST);
        }
        else{
            return ResponseDto.response(StatusCode.SUCCESS,lst);
        }

    }

    @GetMapping("/shop/{type}/random")
    public ResponseEntity<ResponseDto> random(@PathVariable("type") int type){
        RandomResponseDTO randomResponseDTO = shopService.getRandomPool(type);

        if(randomResponseDTO.getPool().isEmpty()){
            return ResponseDto.response(StatusCode.BAD_REQUEST);
        }
        else{
            return ResponseDto.response(StatusCode.SUCCESS,randomResponseDTO);
        }
    }

    @GetMapping("/item/spec")
    public ResponseEntity<ResponseDto> getSpecItem(@RequestParam("type") int type, @RequestParam("sid") int sid){
        SpecResponseDTO specResponseDTO = shopService.getSpecification(type,sid);

        if(specResponseDTO == null){
            return ResponseDto.response(StatusCode.BAD_REQUEST);
        }
        else{
            return ResponseDto.response(StatusCode.SUCCESS,specResponseDTO);
        }


    }




}
