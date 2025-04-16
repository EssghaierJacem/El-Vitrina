






// RewardInfoDTO.java
package com.sudoers.elvitrinabackend.model.dto.response;

        import lombok.AllArgsConstructor;
        import lombok.Builder;
        import lombok.Data;
        import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardInfoDTO {
    private Long rewardId;
    private String rewardTitle;
    private String redemptionStatus;
}