package org.ai.server.serviceimpl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.ai.server.service.EmailService;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailServiceHandler implements EmailService {

    private JavaMailSender mailSender;

    @Override
    public void sendEmail(String to, String subject, String body) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();

        // Create MimeMessageHelper for easy manipulation of the message
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // 'true' means multipart


        helper.setTo(to);  // Recipient's email address

        // Set the subject of the email
        helper.setSubject(subject);

        helper.setText(body, true); // true means HTML content


        // Send the email
        mailSender.send(message);
    }
}
