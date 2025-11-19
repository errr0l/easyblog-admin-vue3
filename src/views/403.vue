<template>
    <div class="error-403">
        <div class="container">
            <h1 class="code">403</h1>
            <h2 class="title">禁止访问</h2>
            <p class="message">
                抱歉，您没有权限访问此页面。<br />
                请确认您的账户权限，或联系管理员。
            </p>
            <div class="actions">
                <router-link to="/" class="btn primary">返回首页</router-link>
                <button @click="goBack" class="btn outline">返回上一页</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
    if (window.history.length > 1) {
        router.go(-1);
    }
    else {
        router.push('/');
    }
}
</script>

<style scoped>
.error-403 {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f9fafb;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 20px;
}

.container {
    text-align: center;
    max-width: 600px;
}

.code {
    font-size: 6rem;
    font-weight: 700;
    color: #e53e3e; /* red.500 */
    margin: 0;
    line-height: 1;
}

.title {
    font-size: 2rem;
    margin: 16px 0 12px;
    color: #1a202c; /* gray.900 */
}

.message {
    font-size: 1.1rem;
    color: #4a5568; /* gray.600 */
    line-height: 1.6;
    margin-bottom: 28px;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
}

.btn {
    padding: 10px 24px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-block;
    border: 1px solid transparent;
}

.btn.primary {
    background-color: #3182ce; /* blue.500 */
    color: white;
}

.btn.primary:hover {
    background-color: #2c5aa0; /* blue.600 */
}

.btn.outline {
    background-color: white;
    color: #3182ce;
    border-color: #cbd5e0; /* gray.300 */
}

.btn.outline:hover {
    background-color: #f7fafc; /* gray.50 */
    border-color: #a0aec0; /* gray.400 */
}
</style>