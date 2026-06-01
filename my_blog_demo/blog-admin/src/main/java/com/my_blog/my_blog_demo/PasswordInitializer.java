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

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        User admin = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getUsername, "admin")
        );
        if (admin == null) {
            String encoded = passwordEncoder.encode("admin123");
            User newAdmin = new User();
            newAdmin.setUsername("admin");
            newAdmin.setPassword(encoded);
            newAdmin.setNickname("管理员");
            newAdmin.setEmail("admin@example.com");
            newAdmin.setRole("admin");
            newAdmin.setStatus(1);
            userMapper.insert(newAdmin);
            System.out.println("[PasswordInitializer] admin 账号已创建，密码: admin123");
        } else {
            System.out.println("[PasswordInitializer] admin 账号已存在，密码哈希: " + admin.getPassword());
            // 验证现有哈希是否正确，不正确则覆盖
            if (!passwordEncoder.matches("admin123", admin.getPassword())) {
                String newHash = passwordEncoder.encode("admin123");
                admin.setPassword(newHash);
                userMapper.updateById(admin);
                System.out.println("[PasswordInitializer] 密码哈希已更新！请重新登录，用户名: admin，密码: admin123");
            } else {
                System.out.println("[PasswordInitializer] 密码哈希验证通过");
            }
        }
    }
}
