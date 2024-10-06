package com.e102.shop.item;

import com.e102.shop.item.dto.ItemResponseDTO;
import com.e102.shop.item.dto.RandomResponseDTO;
import com.e102.shop.item.dto.SpecResponseDTO;
import com.e102.shop.item.entity.Shop;
import com.e102.shop.item.entity.Item;
import com.e102.shop.item.repository.ShopRepository;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;

@Service
public class ShopService {

    private final ShopRepository shopRepository;

    private final SecureRandom secureRandom;

    public ShopService(ShopRepository shopRepository, SecureRandom secureRandom, SecureRandom secureRandom1) {
        this.shopRepository = shopRepository;
        this.secureRandom = secureRandom1;
    }

    public List<ItemResponseDTO> getAll(){
        List<Shop> iList =  shopRepository.findAll();
        List<ItemResponseDTO> rList = new ArrayList<>();

        for(Shop i : iList){
            rList.add(
            ItemResponseDTO.builder()
                    .type(i.getType())
                    .name(i.getName())
                    .price(i.getPrice())
                    .imageURL(i.getImageURL())
                    .build());
        }
        return rList;
    }

    public List<Item> getAllSpec(int type){
        return shopRepository.findById(type).get().getItems();
    }

    public RandomResponseDTO getRandomPool(int type){
        Shop shop = shopRepository.findById(type).get();
        int cSize = shop.getItems().size();
        int price = shop.getPrice();
        //보유한 색깔의 길이
        List<Integer> pool = new ArrayList<>();
        IntStream.rangeClosed(1,cSize).forEach(pool::add);


        int randomIndex = secureRandom.nextInt(pool.size())+1;

        Collections.shuffle(pool);

        return RandomResponseDTO.builder()
                .pool(pool)
                .chosen(randomIndex)
                .price(price)
                .build();
    }
    public SpecResponseDTO getSpecification(int type, int sid){

        Shop selShop = shopRepository.findById(type).get();
        int price = selShop.getPrice();
        Item selSpec = selShop.getItems().get(sid-1);

        return SpecResponseDTO.builder()
                .id(selSpec.getId())
                .name(selSpec.getName())
                .price(selShop.getPrice())
                .imageURL(selSpec.getImageURL())
                .build();
    }

}
