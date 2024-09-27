package com.e102.user.entity;

import com.e102.log.entity.CreditLog;
import com.e102.log.entity.ItemLog;
import com.e102.log.entity.PlayLog;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_email")
    private String email;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_item", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "item_count",columnDefinition = "Integer")
    private Map<Integer,Integer> items = new HashMap<>();

    @Column(name = "user_pw")
    private String password;

    @Column(name = "user_xp")
    private int xp = 0;

    @Column(name = "user_nickname")
    private String nickname;

    @Column(name = "user_character", nullable = true)
    private int character;

    @Column(name = "user_avatar", nullable = true)
    private int avatar;

    @Column(name = "user_voice", nullable = true)
    private int voice;

    @Column(name = "user_gem")
    private int gem = 0;

    @CreatedDate
    @Column(name = "user_created_at",columnDefinition = "TIMESTAMP", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "user_deleted_at",columnDefinition = "TIMESTAMP", updatable = false)
    private LocalDateTime deletedAt;

    @Column(name = "user_tries" )
    private int tries = 10;

    @Column(name = "user_stage" )
    private int stage = 1;

    @Column(name = "user_birthday", columnDefinition = "DATE", nullable = false)
    private LocalDate birthDay = LocalDate.of(2000, 1, 1);

    @OneToMany(mappedBy = "cuser", cascade = CascadeType.ALL, orphanRemoval = true)
    List<CreditLog> creditLogList = new ArrayList<>();

    @OneToMany(mappedBy = "iuser", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ItemLog> itemLogList = new ArrayList<>();

    @OneToMany(mappedBy = "puser", cascade = CascadeType.ALL, orphanRemoval = true)
    List<PlayLog> playLogList = new ArrayList<>();

    public User(String nickname,String email,String password){
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }

    public void modPassword(String password) {
        this.password = password;
    }

    public void modNickname(String nickname) {
        this.nickname = nickname;
    }

    public void modBirthDay(LocalDate birthDay) {
        this.birthDay = birthDay;
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", nickname='" + nickname + '\'' +
                ", character=" + character +
                ", avatar=" + avatar +
                ", voice=" + voice +
                ", gem=" + gem +
                ", createdAt=" + createdAt +
                ", deletedAt=" + deletedAt +
                '}';
    }
}
