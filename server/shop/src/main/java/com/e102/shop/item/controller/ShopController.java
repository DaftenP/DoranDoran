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

    /**
     * 상점에 첫 입장 했을 때, 상점에 있는 모든 유형을 불러온다.
     * @return
     */
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

    /**
     * 상점에서 어떠한 유형의 아이템을 클릭했을 때, 해당 유형의 모든 아이템의 목록을 불러온다.
     * @param type
     * @return
     */

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

    /**
     * 해당하는 Shop의 유형의 상품을 랜덤으로 구매한다.
     * @param type
     * @return
     */

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

    /**
     * 해당하는 유형과 아이템 품목의 id를 불러온다.
     * @param type
     * @param sid
     * @return
     */

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
