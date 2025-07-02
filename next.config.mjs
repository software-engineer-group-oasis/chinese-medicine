/** @type {import('next').NextConfig} */
const nextConfig = {
    //数据库里的图片文件路径，默认不允许加载未配置的外部图片源。需要手动添加允许的外部域名。
    images: {
        domains: ['example.com', 'another-example.com'],
    },

}

    
export default nextConfig;
