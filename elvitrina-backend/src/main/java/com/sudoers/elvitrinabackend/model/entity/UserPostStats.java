package com.sudoers.elvitrinabackend.model.entity;

public class UserPostStats {
        private User user;
        private Long postCount;

        public UserPostStats(User user, Long postCount) {
            this.user = user;
            this.postCount = postCount;
        }

        public User getUser() {
            return user;
        }

        public void setUser(User user) {
            this.user = user;
        }

        public Long getPostCount() {
            return postCount;
        }

        public void setPostCount(Long postCount) {
            this.postCount = postCount;
        }
    }


