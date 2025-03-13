package com.sudoers.elvitrinabackend.service.Notification;

import com.sudoers.elvitrinabackend.model.entity.Notification;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.NotificationRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class NotificationService implements  INotificationService{
    NotificationRepository notificationRepository;
    //UserRepository userRepository;
    @Override
    public Notification addNotification(Notification notif) {
        return notificationRepository.save(notif);
    }

    @Override
    public List<Notification> getAllNotification() {
        return notificationRepository.findAll();
    }

    @Override
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteNotificationById(Long id) {
  notificationRepository.deleteById(id);
    }

    @Override
    public Notification updateNotification(Notification notif) {
        return notificationRepository.save(notif);
    }
}
