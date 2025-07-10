"use client"
import React, { useState, useEffect } from 'react';
import  useRequest  from '@/hooks/useRequest';
import { message } from 'antd';
//组件使用：CommentSection({ targetType, targetId }: Props)

// API端点常量
const COMMENT_API = {
  GET: (targetType: string, targetId: number, sort: string, page: number, size: number) => 
    `/comment-service/comments?targetType=${targetType}&targetId=${targetId}&sort=${sort}&page=${page}&size=${size}`,
  POST: '/comment-service/comments',
  LIKE: (commentId: number) => `/comment-service/comments/${commentId}/like`,
  REPLY:  `/comment-service/comments`,
  DETAIL: (commentId: number) => `/comment-service/comments/${commentId}`,
  };

interface Comment {
  commentId: number;
  userId: number;
  userName: string;
  userAvatar: string | null;
  content: string;
  parentId: number;
  rootId: number;
  likeCount: number;
  createTime: string;
  children: Comment[];
  mine: boolean;
  liked: boolean;
}

interface CommentsListResponse {
  code: number;
  data: {
    list: Comment[];
  };
  message?: string;
}

interface CommentResponse {
  code: number;
  data: Comment;
  message?: string;
}

interface Props {
  targetType: string;
  targetId: number;
}

export default function CommentSection({ targetType, targetId }: Props) {
  const [sort, setSort] = useState<'hot' | 'new'>('hot');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  const { data: commentsData, get: getComments } = useRequest<CommentsListResponse>();
  const { post: postComment } = useRequest<CommentResponse>();
  const { post: postLike } = useRequest<CommentResponse>();
  const { post: postReply } = useRequest<CommentResponse>();

  // 获取评论
  useEffect(() => {
    getComments(COMMENT_API.GET(targetType, targetId, sort, 1, 10));
  }, [sort,targetType, targetId]);

  useEffect(() => {
    if (commentsData && commentsData.data) {
      setComments(commentsData.data.list || []);
    }
  }, [commentsData]);

  // 发表评论
  const handleNewComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await postComment(COMMENT_API.POST, {
        content: newComment,
        targetType,
        targetId
      });
       if (!response || response.code !== 0 || !response.data) {
      message.error('评论发布失败，可能包含严重敏感内容');
      return;
    }

    setComments(prev => [response.data, ...prev]);
    setNewComment('');
    message.success('评论发布成功');
    } catch (error) {
      console.error('发表评论失败:', error);
      message.error('评论发布失败，请稍后重试');
    }
  };

  // 点赞
  const handleLike = async (id: number) => {
    // 检查是否已经点赞
    if (likedComments.has(id)) {
      message.warning('您已经点过赞了');
      return;
    }

    try {
      const response = await postLike(COMMENT_API.LIKE(id), {});
      if (response && response.code === 0) {
        // 添加到已点赞集合
        setLikedComments(prev => new Set([...prev, id]));
        
        setComments(prev =>
          prev.map(c => {
            if (c.commentId === id) {
              return { ...c, likeCount: c.likeCount + 1, liked: true };
            }
            return {
              ...c,
              children: c.children.map(r =>
                r.commentId === id ? { ...r, likeCount: r.likeCount + 1, liked: true } : r
              )
            };
          })
        );
        message.success('点赞成功');
      } else {
        message.error('点赞失败');
      }
    } catch (error) {
      console.error('点赞失败:', error);
      message.error('点赞失败，请稍后重试');
    }
  };

  // 回复 - 单独开楼
  const handleReply = async (parentId: number, text: string, replyToUserName: string) => {
    try {
      const response = await postReply(COMMENT_API.REPLY, {
        parentId,
        content: `回复 @${replyToUserName}：${text}`,
        targetType,
        targetId
      });
      
      if (response && response.data) {
        const newReply = response.data;
        // 将回复作为新评论添加到列表顶部
        setComments(prev => [newReply, ...prev]);
        message.success('回复成功');
      } else {
        message.error('回复失败');
      }
    } catch (error) {
      console.error('回复失败:', error);
      message.error('回复失败，请稍后重试');
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sort === 'hot') return b.likeCount - a.likeCount;
    return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
  });

  return (
    <div className="bg-[#f9f6ef] rounded-xl p-6">
      <div className="flex gap-4 mb-4">
        <button className={sort === 'hot' ? 'font-bold text-[#8C6B2F]' : ''} onClick={() => setSort('hot')}>最热</button>
        <button className={sort === 'new' ? 'font-bold text-[#8C6B2F]' : ''} onClick={() => setSort('new')}>最新</button>
      </div>
      <div className="flex gap-2 mb-6">
        <input
          className="border rounded px-3 py-2 flex-1"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="发表你的看法..."
        />
        <button className="bg-[#355C3A] text-white px-4 py-2 rounded" onClick={handleNewComment}>评论</button>
      </div>
      <div>
        {sortedComments.map(comment => (
          <CommentItem 
            key={comment.commentId} 
            comment={comment} 
            onLike={handleLike} 
            onReply={handleReply} 
            sort={sort}
            isLiked={likedComments.has(comment.commentId)}
          />
        ))}
        {sortedComments.length === 0 && <div className="text-gray-400">暂无评论，快来抢沙发吧！</div>}
      </div>
    </div>
  );
}

function CommentItem({ comment, onLike, onReply, sort, isLiked }: {
    comment: Comment;
    onLike: (id: number) => void;
    onReply: (id: number, text: string, replyToUserName: string) => void;
    sort: 'hot' | 'new';
    isLiked: boolean;
}) {

    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    
    return (
        <div className="border-b border-gray-100 pb-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[#355C3A]">{comment.userName}</span>
                <span className="text-xs text-gray-400">{comment.createTime}</span>
            </div>
            <div className="text-gray-700 mb-2">{comment.content}</div>
            <div className="flex items-center gap-4 text-sm">
                <button 
                    className={`hover:text-[#8C6B2F] ${isLiked ? 'text-[#8C6B2F]' : ''}`} 
                    onClick={() => onLike(comment.commentId)}
                    disabled={isLiked}
                >
                    👍 {comment.likeCount}
                </button>
                <button className="hover:text-[#5B8FF9]" onClick={() => setShowReply(!showReply)}>回复</button>
            </div>
            {showReply && (
                <div className="mt-2 flex gap-2">
                    <input
                        className="border rounded px-2 py-1 flex-1 text-sm"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder={`回复 @${comment.userName}...`}
                    />
                    <button
                        className="bg-[#355C3A] text-white px-3 py-1 rounded text-sm"
                        onClick={() => {
                            if (replyText.trim()) {
                                onReply(comment.commentId, replyText, comment.userName);
                                setReplyText('');
                                setShowReply(false);
                            } else {
                                message.warning('请输入回复内容');
                            }
                        }}
                    >发送</button>
                </div>
            )}
            {/* 子评论递归渲染 */}
            {comment.children && comment.children.length > 0 && (
                <div className="ml-6 mt-3 border-l-2 border-gray-100 pl-4">
                    {comment.children.sort((a, b) => sort === 'hot' ? b.likeCount - a.likeCount : 0).map(reply => (
                        <CommentItem 
                            key={reply.commentId} 
                            comment={reply} 
                            onLike={onLike} 
                            onReply={onReply} 
                            sort={sort}
                            isLiked={false} // 子评论的点赞状态需要单独管理
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
