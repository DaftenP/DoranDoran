package com.e102.user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "item")
public class Item {

    @Id
    @Column(name="item_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="item_name")
    private String name;

    @Column(name="item_type")
    private int type;

    @Column(name="item_price")
    private int price;

    @Column(name="item_image")
    private String imageURL;

    @Column(name="item_grade")
    private int grade;


}
