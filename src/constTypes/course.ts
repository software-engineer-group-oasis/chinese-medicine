// 类型声明
export type ExperimentStep = {
  title: string;
  content: string;
};

export type CourseResource = {
  name: string;
  type: 'video' | 'pdf' | 'excel' | string;
  size: string;
  url?: string;
};

export type Course = {
  courseId: number;
  courseName: string;
  coverImageUrl: string;
  courseType: string;
  courseObject: string;
  teacherId: number;
  courseStartTime: string;
  courseEndTime: string;
  courseDes: string;
  courseAverageRating: number;
  courseRatingCount: number;
  
  // 课程详情页面需要的字段
  labs?: any[];
  resources?: any[];
  herbs?: any[];
  author?: string;
  authorAvatar?: string;
  authorTitle?: string;
  //课程评分
  ratingValue?: number;
  //暂未用
  viewCount?: number;
  downloadCount?: number;
  
  
  // 可选字段，用于处理后端可能返回的其他数据
  [key: string]: any;  
};





export type LearningCourse = {
  id: string | number;
  cover?: string;
  title?: string;
  lastPosition?: string | number;
  lastViewedAt?: string;
  progress: number;
}

export type LearningProgressPanelProps = {
  learningCourses: LearningCourse[];
}


export type Category = {
  value: string;
  label: string;
  color?: string;
}

export type Target = {
  value: string;
  label: string;
}

export type CourseCategoryPanelProps = {
  courses: Course[];
  COURSE_CATEGORIES: Category[];
  COURSE_TARGETS: Target[];
}

