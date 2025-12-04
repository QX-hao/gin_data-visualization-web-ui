<template>
    <div class="login-bg">
        <div class="login-container">
            <div class="login-header">
                <img class="logo mr10" src="../../assets/img/logo.svg" alt="" />
                <div class="login-title">后台管理系统</div>
            </div>
            <el-form :model="param" :rules="rules" ref="register" size="large">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <template #prepend>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="param.email" placeholder="邮箱">
                        <template #prepend>
                            <el-icon>
                                <Message />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.password"
                        @keyup.enter="submitForm(register)"
                    >
                        <template #prepend>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                        
                    </el-input>
                </el-form-item>
                <el-button class="login-btn" type="primary" size="large" @click="submitForm(register)">{{loading ? '注册中' : '注册'}}</el-button>
                <p class="login-text">
                    已有账号，<el-link type="primary" @click="$router.push('/login')">立即登录</el-link>
                </p>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Register } from '@/types/user';
import { sha256 } from '@/utils';
import { registerApi, checkUsernameApi, checkEmailApi } from '@/api';


const router = useRouter();
const loading = ref(false);
const param = reactive<Register>({
    username: '',
    password: '',
    email: '',
});

const rules: FormRules = {
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
};
const register = ref<FormInstance>();

// 验证函数
const validateForm = async () => {
    // 1. 用户名验证
    if (param.username.length < 3) {
        ElMessage.error('用户名至少3个字符');
        return false;
    }

    // 2. 验证邮箱
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(param.email)) {
        ElMessage.error('请输入正确的邮箱格式');
        return false;
    }

    // 3.实时验证
    try {
        const [usernameResult, emailResult] = await Promise.all([
            checkUsernameApi({ username: param.username }),
            checkEmailApi({ email: param.email }),
        ]);

        // console.log('用户名验证结果:', usernameResult);
        // console.log('邮箱验证结果:', emailResult);

        if (!usernameResult.data?.data?.available) {
            ElMessage.warning('用户名已存在');
            return false;
        }
        
        if (!emailResult.data?.data?.available) {
            ElMessage.warning('邮箱已被注册');
            return false;
        }
        
        return true;
    } catch (error) {
        // 处理API调用错误
        console.error('验证失败:', error);
        return true; // 验证失败也允许提交，由后端最终验证
    }
}

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async (valid: boolean) => {
        if (valid) {
            // 防止反复提交
            if (loading.value) return;
            loading.value = true;

            try {
                const canSubmit = await validateForm();
                if (!canSubmit) {
                    loading.value = false;
                    return;
                };

                const encryptedPassword = await sha256(param.password);
                console.log('原始密码:', param.password);
                console.log('加密后的密码:', encryptedPassword);

                // 调用注册接口
                const result = await registerApi({
                    username: param.username,
                    password: encryptedPassword,
                    email: param.email,
                });

                // 处理注册响应
                if (result.status === 201 || result.data?.code === 201) {
                    // 注册成功
                    ElMessage.success(result.message || '注册成功，请登录');
                    router.push('/login');
                } else {
                    // 注册失败
                    // 检查API返回的错误消息
                    if (result.data?.message) {
                        ElMessage.error(result.data?.message);
                    } else {
                        ElMessage.error(result.message || '注册失败，请重试');
                    }
                }
            } catch (error) {
                // 网络错误或API调用失败
                ElMessage.error('网络错误，请检查网络连接或稍后重试');
                console.error('注册失败:', error);
            } finally {
                // 无论成功或失败，都重置loading状态
                loading.value = false;
            }
        } else {
            return false;
        }
    });
};
</script>

<style scoped>
.login-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: url(../../assets/img/login-bg.jpg) center/cover no-repeat;
}

.login-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
}

.logo {
    width: 35px;
}

.login-title {
    font-size: 22px;
    color: #333;
    font-weight: bold;
}

.login-container {
    width: 450px;
    border-radius: 5px;
    background: #fff;
    padding: 40px 50px 50px;
    box-sizing: border-box;
}

.login-btn {
    display: block;
    width: 100%;
}

.login-text {
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    color: #787878;
}
</style>