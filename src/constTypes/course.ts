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
  // id: number;
  // title: string;
  // cover: string;
  // description: string;
  // tags: string[];
  // rating: number;
  // reviews: number;
  // likes: number;
  // category: string;
  // relatedHerbs: string[];
  // createdAt: string;
  // author: string;
  // duration: string;
  // progress: number;
  // experimentSteps: ExperimentStep[];
  // resources?: CourseResource[];
  // viewCount?: number;        
  // downloadCount?: number;    
  // authorAvatar?: string;     
  // authorTitle?: string;  
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

