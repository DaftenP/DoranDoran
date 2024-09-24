package com.e102.shop.item.config;

import com.e102.shop.item.entity.Item;
import com.e102.shop.item.entity.Specification;
import com.e102.shop.item.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class ShopInitializer implements CommandLineRunner {

    public final ItemRepository itemRepository;

    public ShopInitializer(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }


    @Override
    public void run(String... args) throws Exception {
        Item color = Item.builder()
                .type(1)
                .name("Color")
                .price(1000)
                .imageURL("Catalog Image")
                .specifications(Arrays.asList(
                        new Specification(1,"RED","imageURL"),
                        new Specification(2,"BLUE","imageURL"),
                        new Specification(3,"GREEN","imageURL"),
                        new Specification(4,"YELLOW","imageURL"),
                        new Specification(5,"PURPLE","imageURL")
                ))
                .build();


        Item equip = Item.builder()
                .type(2)
                .name("Equip")
                .price(1000)
                .imageURL("Catalog Image")
                .specifications(Arrays.asList(
                        new Specification(1,"CAN","imageURL"),
                        new Specification(2,"HUNTING","imageURL"),
                        new Specification(3,"STRAW HAT","imageURL"),
                        new Specification(4,"DETECTIVE HAT","imageURL"),
                        new Specification(5,"FIREFIGHTER","imageURL"),
                        new Specification(5,"STRAW W HAT","imageURL"),
                        new Specification(5,"BROWN W HAT","imageURL"),
                        new Specification(5,"SOFT HAT","imageURL"),
                        new Specification(5,"MAGICIAN HAT","imageURL"),
                        new Specification(5,"CAKE HAT","imageURL"),
                        new Specification(5,"GREEN HAT","imageURL"),
                        new Specification(5,"BLACK HAT","imageURL"),
                        new Specification(5,"GRADUATION HAT","imageURL"),
                        new Specification(5,"KINDER HAT","imageURL")
                ))
                .build();

        Item backGround = Item.builder()
                .type(3)
                .price(2000)
                .imageURL("BackGround Image")
                .specifications(Arrays.asList(
                        new Specification(1,"CLOUD","imageURL"),
                        new Specification(2,"SUNNY","imageURL"),
                        new Specification(3,"SNOW","imageURL"),
                        new Specification(4,"NIGHT","imageURL"),
                        new Specification(5,"DESERT","imageURL")
                        ))
                        .build();


        itemRepository.save(color);
        itemRepository.save(equip);
        itemRepository.save(backGround);
    }
}
