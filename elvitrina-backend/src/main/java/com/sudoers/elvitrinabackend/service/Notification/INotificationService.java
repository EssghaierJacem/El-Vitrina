package com.sudoers.elvitrinabackend.service.Notification;
import com.sudoers.elvitrinabackend.model.entity.Notification;


import java.util.List;

public interface INotificationService {
    public Notification addNotification (Notification notif);
    public List<Notification> getAllNotification();
    public Notification getNotificationById(Long id);
    public void deleteNotificationById(Long id);
    public Notification updateNotification (Notification notif);
}
