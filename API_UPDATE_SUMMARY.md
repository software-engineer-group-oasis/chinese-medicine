# API配置更新总结

## 更新概述

根据中药课程管理API文档（版本4.0），已对前端API配置进行了全面更新，确保与后端API规范完全一致。

## 主要更新内容

### 1. API配置统一化

#### 新增API配置模块
- `COURSE_API` - 课程管理相关API
- `LAB_API` - 实验管理相关API  
- `RESOURCE_API` - 资源管理相关API
- `CATEGORY_API` - 分类管理相关API

#### 更新的API路径
所有API路径已统一使用 `/herb-teaching-service` 前缀，符合API文档规范。

### 2. 数据结构适配

#### 课程列表响应格式
```json
{
  "code": 0,
  "data": {
    "total": 4,
    "pages": 1,
    "list": [...]
  }
}
```

#### 资源类型字段映射
- `courseResourceType: 0` → 显示为"视频"
- `courseResourceType: 1` → 显示为"文档"
- 其他值 → 显示为"其他"

### 3. 统计功能优化

#### 实时数据统计
- 使用 `Promise.all` 并行请求多个API
- 动态计算各类统计数据
- 支持分页数据的准确统计

#### 访问量统计
- 添加模拟访问量数据
- 动态计算总访问量
- 为未来接入真实访问量API预留接口

### 4. 错误处理改进

#### 统一错误处理
- 所有API调用都包含错误处理
- 显示具体的错误信息
- 提供用户友好的错误提示

#### 数据验证
- 检查API响应码
- 验证数据结构完整性
- 处理空数据情况

## 更新的文件列表

### 核心配置文件
- `src/api/HerbInfoApi.ts` - 新增完整的API配置

### 页面组件
- `src/app/admin/teaching/page.tsx` - 教学实验管理页面
- `src/app/admin/teaching/labs/page.tsx` - 实验管理页面
- `src/app/admin/teaching/herbs/page.tsx` - 中草药管理页面
- `src/app/main/user/my-courses/[id]/page.tsx` - 用户课程详情页面

### 组件文件
- `src/components/course/CourseResourceManager.tsx` - 课程资源管理组件

## API接口对照表

| 功能模块 | 原API路径 | 新API配置 | 说明 |
|---------|-----------|-----------|------|
| 获取课程列表 | `/courses` | `COURSE_API.GET_COURSES()` | 支持分页和筛选 |
| 获取课程详情 | `/courses/{id}` | `COURSE_API.GET_COURSE_DETAIL(id)` | 包含完整课程信息 |
| 创建课程 | `POST /courses` | `COURSE_API.CREATE_COURSE()` | 教师权限 |
| 更新课程 | `PUT /courses/{id}` | `COURSE_API.UPDATE_COURSE(id)` | 教师权限 |
| 删除课程 | `DELETE /courses/{id}` | `COURSE_API.DELETE_COURSE(id)` | 教师权限 |
| 课程评分 | `POST /courses/{id}/ratings` | `COURSE_API.RATE_COURSE(id)` | 用户评分 |
| 收藏课程 | `POST /courses/{id}/collections` | `COURSE_API.COLLECT_COURSE(id)` | 用户收藏 |
| 获取实验列表 | `/courses/{id}/labs` | `LAB_API.GET_COURSE_LABS(id)` | 课程实验 |
| 创建实验 | `POST /courses/{id}/labs` | `LAB_API.CREATE_LAB(id)` | 教师权限 |
| 获取资源列表 | `/courses/{id}/resources` | `RESOURCE_API.GET_COURSE_RESOURCES(id)` | 课程资源 |
| 创建资源 | `POST /courses/{id}/resources` | `RESOURCE_API.CREATE_RESOURCE(id)` | 教师权限 |

## 性能优化

### 并行请求
- 统计页面使用 `Promise.all` 并行获取数据
- 减少页面加载时间
- 提升用户体验

### 数据缓存
- 合理使用React状态管理
- 避免重复API调用
- 优化组件重渲染

## 后续计划

### 待完善功能
1. 接入真实的访问量统计API
2. 添加更多的数据可视化图表
3. 实现实时数据更新功能
4. 添加数据导出功能

### 技术改进
1. 添加API请求拦截器
2. 实现请求重试机制
3. 添加数据加载状态管理
4. 优化错误处理流程

## 注意事项

1. 所有API调用都需要包含认证头 `Authorization: Bearer <token>`
2. 用户相关操作需要包含 `userId` 头
3. 教师权限的操作需要验证用户身份
4. 错误码统一为 `code: -1`，成功为 `code: 0`

## 测试建议

1. 测试所有API接口的响应格式
2. 验证错误处理机制
3. 检查权限控制是否正常
4. 测试数据统计的准确性
5. 验证分页功能是否正常 