package com.example.accountservice.service;

import com.example.accountservice.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;


    @Autowired
    private TemplateEngine templateEngine;
    public void sendEmail(String to, String subject, String url) throws MessagingException {

        Context context = new Context();
//        context.setVariable("username", account.getUsername());
//        context.setVariable("password", account.getUsername());
        context.setVariable("url", url);

        String text = templateEngine.process("emailTemplate", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setPriority(1);
        helper.setSubject(subject);
        helper.setTo(to);

        helper.setText(text, true);
        mailSender.send(message);


    }
}
