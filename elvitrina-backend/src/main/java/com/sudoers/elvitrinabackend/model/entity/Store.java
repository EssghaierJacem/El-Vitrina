package com.sudoers.elvitrinabackend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sudoers.elvitrinabackend.model.enums.StoreCategoryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Store implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long storeId;

    @NotBlank(message = "Store name is required")
    @Size(max = 100, message = "Store name must be less than 100 characters")
    private String storeName;

    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @Enumerated(EnumType.STRING)
    private StoreCategoryType category;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private boolean status;

    // not very logical here
    @NotBlank(message = "Address is required")
    private String address;

    //@URL(message = "Image must be a valid URL")
    private String image;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<StoreFeedback> feedbacks;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products;

    @OneToMany(mappedBy = "store")
    @JsonIgnore
    private List<Donation> donations;

    @OneToMany(mappedBy = "store")
    @JsonIgnore
    private List<DonationCampaign> donationCampaigns;

    @OneToMany(mappedBy = "store")
    @JsonIgnore
    private List<VirtualEvent> virtualEvents;

    @OneToMany(mappedBy = "store")
    @JsonIgnore
    private List<Advertisement> advertisements;

}
