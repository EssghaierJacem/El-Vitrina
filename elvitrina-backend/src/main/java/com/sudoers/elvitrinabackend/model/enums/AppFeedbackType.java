package com.sudoers.elvitrinabackend.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AppFeedbackType {
    GENERAL("General Feedback"),
    BUG_REPORT("Bug Report"),
    FEATURE_REQUEST("Feature Request"),
    USER_EXPERIENCE("User Experience"),
    PERFORMANCE("Performance");

    private final String displayName;
}
