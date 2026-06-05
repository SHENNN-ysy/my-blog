package com.my_blog.my_blog_demo;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.my_blog.model.entity.User;
import com.my_blog.my_blog_demo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PasswordInitializer implements CommandLineRunner {

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";
    private static final String ADMIN_NICKNAME = "管理员";
    private static final String ADMIN_EMAIL = "admin@example.com";

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        User admin = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getUsername, ADMIN_USERNAME)
        );
        if (admin == null) {
            String encoded = passwordEncoder.encode(ADMIN_PASSWORD);
            User newAdmin = new User();
            newAdmin.setUsername(ADMIN_USERNAME);
            newAdmin.setPassword(encoded);
            newAdmin.setNickname(ADMIN_NICKNAME);
            newAdmin.setEmail(ADMIN_EMAIL);
            newAdmin.setRole("admin");
            newAdmin.setStatus(1);
            userMapper.insert(newAdmin);
            System.out.println("[PasswordInitializer] admin 账号已创建，密码: admin123");
        } else {
            boolean updated = false;
            System.out.println("[PasswordInitializer] admin 账号已存在，密码哈希: " + admin.getPassword());
            if (!passwordEncoder.matches(ADMIN_PASSWORD, admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                updated = true;
                System.out.println("[PasswordInitializer] 检测到默认密码不匹配，已重置为 admin123");
            } else {
                System.out.println("[PasswordInitializer] 密码哈希验证通过");
            }
            if (needsNicknameRepair(admin.getNickname())) {
                admin.setNickname(ADMIN_NICKNAME);
                updated = true;
                System.out.println("[PasswordInitializer] 检测到管理员昵称乱码，已修复为：管理员");
            }
            if (updated) {
                userMapper.updateById(admin);
            }
        }
    }

    private boolean needsNicknameRepair(String nickname) {
        if (nickname == null || nickname.isBlank()) {
            return true;
        }
        if (ADMIN_NICKNAME.equals(nickname)) {
            return false;
        }
        return nickname.contains("ç") || nickname.contains("å") || nickname.contains("æ") || nickname.contains("") || nickname.contains("");
    }
}
