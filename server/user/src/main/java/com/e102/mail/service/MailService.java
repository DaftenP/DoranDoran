package com.e102.mail.service;

import com.e102.common.exception.StatusCode;
import jakarta.activation.DataHandler;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.internet.MimeUtility;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;

@Service
public class MailService {
    private final JavaMailSender javaMailSender;
    @Value("${spring.mail.username}")
    private String senderEmail;

    private final RedisTemplate<String, Integer> redisTemplate;

    @Autowired
    public MailService(JavaMailSender javaMailSender, @Qualifier("emailRedisTemplate") RedisTemplate<String, Integer> redisTemplate) {
        this.javaMailSender = javaMailSender;
        this.redisTemplate = redisTemplate;
    }


    public int createRandomNumber(){
        return (int)(Math.random() * (90000)) +100000;
    }

    //현재 RefreshEntity 추가하는 함수
    private void addEmailCode(String email, int code, Long expiredMs) {

        ValueOperations<String,Integer> vop = redisTemplate.opsForValue();

        vop.set(email,code);

        //System.out.println("코드가 등록되었습니다.");

        redisTemplate.expire(email,expiredMs, TimeUnit.MILLISECONDS);

    }

    public MimeMessage createPWMail(String mail){
        int code = createRandomNumber();
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, mail);
            message.setSubject("[도란도란] 비밀번호 재설정");
            String body = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>";
            body += "<h2 style='text-align: center; color: #5A79C1;'>비밀번호 초기화 코드</h2>";
            body += "<p style='font-size: 16px; color: #333;'>안녕하세요,</p>";
            body += "<p style='font-size: 16px; color: #333;'>비밀번호를 재설정하려면 아래의 인증 코드를 입력해주세요:</p>";
            body += "<div style='text-align: center; margin: 20px 0;'>";
            body += "<span style='display: inline-block; font-size: 24px; font-weight: bold; color: #5A79C1; padding: 10px 20px; border: 2px dashed #5A79C1; border-radius: 5px;'>" + code + "</span>";
            body += "</div>";
            body += "<p style='font-size: 16px; color: #333;'>이 요청을 본인이 하지 않으셨다면, 이 이메일을 무시하셔도 됩니다.</p>";
            body += "<p style='font-size: 16px; color: #333;'>감사합니다.<br/><strong>도란도란 팀</strong></p>";
            body += "<hr style='border-top: 1px solid #ddd;'>";
            body += "<p style='font-size: 12px; color: #999; text-align: center;'>이 메일은 자동으로 발송된 메일입니다. 회신하지 마세요.</p>";
            body += "<img src='cid:birdImage' style='width: 100px; height: auto; display: block; margin: 0 auto;' />";
            body += "</div>";

            MimeBodyPart bodyPart = new MimeBodyPart();
            bodyPart.setContent(body, "text/html; charset=UTF-8");

            // 이미지 파일 추가 (상대 경로로 지정)
            MimeBodyPart imagePart = new MimeBodyPart();
            ClassPathResource resource = new ClassPathResource("static/img/logo.png");
            //DataSource fds = new FileDataSource(resource.getFile());
            InputStream inputStream = resource.getInputStream();
            byte[] imageBytes = inputStream.readAllBytes();
            //read all bytes
            ByteArrayDataSource dataSource = new ByteArrayDataSource(imageBytes, "image/png");
            imagePart.setDataHandler(new DataHandler(dataSource));
            imagePart.setHeader("Content-ID", "<birdImage>");
            imagePart.setFileName(MimeUtility.encodeText("logo.png", "UTF-8", null));

            // 본문과 이미지를 하나의 Multipart로 합침
            MimeMultipart multipart = new MimeMultipart();
            multipart.addBodyPart(bodyPart);
            multipart.addBodyPart(imagePart);

            message.setContent(multipart);
            //System.out.println("CODE: "+ code);
            addEmailCode(mail,code,300000L);
            //REDIS에 5분의 코드 등록

        } catch (MessagingException | IOException e) {
            e.printStackTrace();
        }
        return message;
    }

    public MimeMessage setPWMail(String mail, String tempPassword ){
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, mail);
            message.setSubject("[도란도란] 임시 비밀번호 발급");
            String body = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>";
            body += "<h2 style='text-align: center; color: #5A79C1;'>임시 비밀번호 발급 안내</h2>";
            body += "<p style='font-size: 16px; color: #333;'>안녕하세요,</p>";
            body += "<p style='font-size: 16px; color: #333;'>비밀번호 재설정을 요청하셔서 아래와 같이 임시 비밀번호를 발급해 드립니다:</p>";
            body += "<p style='font-size: 16px; color: #333;'><strong>임시 비밀번호로 로그인한 후, 반드시 새로운 비밀번호로 변경해 주세요.</strong></p>";
            body += "<div style='text-align: center; margin: 20px 0;'>";
            body += "<span style='display: inline-block; font-size: 24px; font-weight: bold; color: #5A79C1; padding: 10px 20px; border: 2px dashed #5A79C1; border-radius: 5px;'>" + tempPassword + "</span>";
            body += "</div>";

            body += "<p style='font-size: 16px; color: #333;'>이 요청을 본인이 하지 않으셨다면, 이 이메일을 무시하셔도 됩니다.</p>";
            body += "<p style='font-size: 16px; color: #333;'>감사합니다.<br/><strong>도란도란 팀</strong></p>";
            body += "<hr style='border-top: 1px solid #ddd;'>";
            body += "<p style='font-size: 12px; color: #999; text-align: center;'>이 메일은 자동으로 발송된 메일입니다. 회신하지 마세요.</p>";
            body += "<img src='cid:birdImage' style='width: 100px; height: auto; display: block; margin: 0 auto;' />";
            body += "</div>";

            MimeBodyPart bodyPart = new MimeBodyPart();
            bodyPart.setContent(body, "text/html; charset=UTF-8");

            // 이미지 파일 추가 (상대 경로로 지정)
            MimeBodyPart imagePart = new MimeBodyPart();
            ClassPathResource resource = new ClassPathResource("static/img/logo.png");
            //DataSource fds = new FileDataSource(resource.getFile());
            InputStream inputStream = resource.getInputStream();
            byte[] imageBytes = inputStream.readAllBytes();
            //read all bytes
            ByteArrayDataSource dataSource = new ByteArrayDataSource(imageBytes, "image/png");
            imagePart.setDataHandler(new DataHandler(dataSource));
            imagePart.setHeader("Content-ID", "<birdImage>");
            imagePart.setFileName(MimeUtility.encodeText("logo.png", "UTF-8", null));


            // 본문과 이미지를 하나의 Multipart로 합침
            MimeMultipart multipart = new MimeMultipart();
            multipart.addBodyPart(bodyPart);
            multipart.addBodyPart(imagePart);

            message.setContent(multipart);

        } catch (MessagingException |IOException e) {
            e.printStackTrace();

        }
        return message;
    }

    public MimeMessage createRegisterMail(String mail){
        int code = createRandomNumber();
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, mail);
            message.setSubject("[도란도란] 회원가입 인증 코드");
            String body = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>";
            body += "<h2 style='text-align: center; color: #5A79C1;'>회원가입 인증 코드</h2>";
            body += "<p style='font-size: 16px; color: #333;'>안녕하세요,</p>";
            body += "<p style='font-size: 16px; color: #333;'>회원가입을 하시려면 아래의 인증 코드를 입력해주세요:</p>";
            body += "<div style='text-align: center; margin: 20px 0;'>";
            body += "<span style='display: inline-block; font-size: 24px; font-weight: bold; color: #5A79C1; padding: 10px 20px; border: 2px dashed #5A79C1; border-radius: 5px;'>" + code + "</span>";
            body += "</div>";
            body += "<p style='font-size: 16px; color: #333;'>이 요청을 본인이 하지 않으셨다면, 이 이메일을 무시하셔도 됩니다.</p>";
            body += "<p style='font-size: 16px; color: #333;'>감사합니다.<br/><strong>도란도란 팀</strong></p>";
            body += "<hr style='border-top: 1px solid #ddd;'>";
            body += "<p style='font-size: 12px; color: #999; text-align: center;'>이 메일은 자동으로 발송된 메일입니다. 회신하지 마세요.</p>";
            body += "<img src='cid:birdImage' style='width: 100px; height: auto; display: block; margin: 0 auto;' />";
            body += "</div>";

            MimeBodyPart bodyPart = new MimeBodyPart();
            bodyPart.setContent(body, "text/html; charset=UTF-8");

            // 이미지 파일 추가 (상대 경로로 지정)
            MimeBodyPart imagePart = new MimeBodyPart();
            ClassPathResource resource = new ClassPathResource("static/img/logo.png");
            InputStream inputStream = resource.getInputStream();
            byte[] imageBytes = inputStream.readAllBytes();
            //read all bytes
            ByteArrayDataSource dataSource = new ByteArrayDataSource(imageBytes, "image/png");
            imagePart.setDataHandler(new DataHandler(dataSource));
            imagePart.setHeader("Content-ID", "<birdImage>");
            imagePart.setFileName(MimeUtility.encodeText("logo.png", "UTF-8", null));

            // 본문과 이미지를 하나의 Multipart로 합침
            MimeMultipart multipart = new MimeMultipart();
            multipart.addBodyPart(bodyPart);
            multipart.addBodyPart(imagePart);

            message.setContent(multipart);

            //message.setText(body,"UTF-8", "html");

            //System.out.println("CODE: "+ code);
            addEmailCode(mail,code,300000L);
            //REDIS에 5분의 코드 등록

        } catch (MessagingException |IOException e) {
            e.printStackTrace();
        }
        return message;

    }

    public void sendRMail(String mail){
        MimeMessage message = createRegisterMail(mail);
        javaMailSender.send(message);
    }
    public void sendPMail(String mail){
        MimeMessage message = createPWMail(mail);
        javaMailSender.send(message);
    }
    public void resetPW(String mail, String tempPW){
        MimeMessage message = setPWMail(mail,tempPW);
        javaMailSender.send(message);
    }

    public StatusCode checkCode(String mail, int userNumber){
        boolean isExist = redisTemplate.hasKey(mail);
        //mail이 존재하는 지 본다.

        if (!isExist) {
            //System.out.println("EXPIRED");
            return StatusCode.EXPIRED;
        }
        int realCode = redisTemplate.opsForValue().get(mail);

        //System.out.println("실제 코드 : "+ realCode);
        //System.out.println("인증 번호 : " + userNumber);

        if(realCode != userNumber){
            //System.out.println("WRONG NUMBER");
            return StatusCode.CODE_INCORRECT;
        }
        else{
            //System.out.println("CORRECT");
            redisTemplate.delete(mail);
            return StatusCode.CODE_CORRECT;
            //REDIS에서 지운다
        }

    }


}
