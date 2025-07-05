"use client"
import React, { useState } from 'react';

// type Comment = {
//   commentId: number,
//   userId: number,
//   userName: string,
//   userAvatar: null,
//   content: string,
//   parentId: number,
//   rootId: number,
//   likeCount: number,
//   createTime: string,
//   children: Comment[],
//   liked: boolean,
//   mine: boolean
// }

interface Comment {
    id: number;
    user: string;
    content: string;
    likes: number;
    time: string;
    replies: Comment[];
}
const mockComments: Comment[] = [
    {
        id: 1,
        user: '中药爱好者',
        content: '黄连的药效真的很棒，家里常备！',
        likes: 8,
        time: '2小时前',
        replies: [
            {
                id: 2,
                user: '草本小白',
                content: '请问怎么服用效果最好？',
                likes: 2,
                time: '1小时前',
                replies: []
            }
        ]
    },
    {
        id: 3,
        user: '药材研究员',
        content: '重庆石柱的黄连品质确实一流，推荐大家试试。',
        likes: 5,
        time: '30分钟前',
        replies: []
    }
];

function CommentItem({ comment, onLike, onReply, sort }: {
    comment: Comment;
    onLike: (id: number) => void;
    onReply: (id: number, text: string) => void;
    sort: 'hot' | 'new';
}) {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    return (
        <div className="border-b border-gray-100 pb-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[#355C3A]">{comment.user}</span>
                <span className="text-xs text-gray-400">{comment.time}</span>
            </div>
            <div className="text-gray-700 mb-2">{comment.content}</div>
            <div className="flex items-center gap-4 text-sm">
                <button className="hover:text-[#8C6B2F]" onClick={() => onLike(comment.id)}>👍 {comment.likes}</button>
                <button className="hover:text-[#5B8FF9]" onClick={() => setShowReply(!showReply)}>回复</button>
            </div>
            {showReply && (
                <div className="mt-2 flex gap-2">
                    <input
                        className="border rounded px-2 py-1 flex-1 text-sm"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="写下你的回复..."
                    />
                    <button
                        className="bg-[#355C3A] text-white px-3 py-1 rounded text-sm"
                        onClick={() => {
                            if (replyText.trim()) {
                                onReply(comment.id, replyText);
                                setReplyText('');
                                setShowReply(false);
                            }
                        }}
                    >发送</button>
                </div>
            )}
            {/* 子评论递归渲染 */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-3 border-l-2 border-gray-100 pl-4">
                    {comment.replies.sort((a, b) => sort === 'hot' ? b.likes - a.likes : 0).map(reply => (
                        <CommentItem key={reply.id} comment={reply} onLike={onLike} onReply={onReply} sort={sort} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CommentSection() {
    const [comments, setComments] = useState<Comment[]>(mockComments);
    const [sort, setSort] = useState<'hot' | 'new'>('hot');
    const [newComment, setNewComment] = useState('');

    // 点赞
    const handleLike = (id: number) => {
        setComments(prev => prev.map(c =>
            c.id === id ? { ...c, likes: c.likes + 1 } : {
                ...c,
                replies: c.replies.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r)
            }
        ));
    };

    // 回复
    const handleReply = (id: number, text: string) => {
        setComments(prev => prev.map(c => {
            if (c.id === id) {
                return {
                    ...c,
                    replies: [...c.replies, {
                        id: Date.now(),
                        user: '匿名用户',
                        content: text,
                        likes: 0,
                        time: '刚刚',
                        replies: []
                    }]
                };
            } else {
                return {
                    ...c,
                    replies: c.replies.map(r =>
                        r.id === id ? {
                            ...r,
                            replies: [...r.replies, {
                                id: Date.now(),
                                user: '匿名用户',
                                content: text,
                                likes: 0,
                                time: '刚刚',
                                replies: []
                            }]
                        } : r
                    )
                };
            }
        }));
    };

    // 新评论
    const handleNewComment = () => {
        if (!newComment.trim()) return;
        setComments(prev => [{
            id: Date.now(),
            user: '匿名用户',
            content: newComment,
            likes: 0,
            time: '刚刚',
            replies: []
        }, ...prev]);
        setNewComment('');
    };

    const sortedComments = [...comments].sort((a, b) => {
        if (sort === 'hot') return b.likes - a.likes;
        return 0;
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
                <button
                    className="bg-[#355C3A] text-white px-4 py-2 rounded"
                    onClick={handleNewComment}
                >评论</button>
            </div>
            <div>
                {sortedComments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} onLike={handleLike} onReply={handleReply} sort={sort} />
                ))}
                {sortedComments.length === 0 && <div className="text-gray-400">暂无评论，快来抢沙发吧！</div>}
            </div>
        </div>
    );
}