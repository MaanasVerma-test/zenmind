import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import styles from './Community.module.css';
import { MessageCircle, Heart, Share2, Plus, X, Send, ArrowLeft, Loader } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {
  fetchPosts,
  createPost,
  toggleLike,
  fetchLikesForPosts,
  fetchCommentsForPosts,
  createComment,
  timeAgo
} from '../lib/database';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 }
};

export default function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [userLiked, setUserLiked] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [activeGroupId, setActiveGroupId] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentingPostId, setCommentingPostId] = useState(null);

  // Groups stay hardcoded per user's request
  const [groups, setGroups] = useState([
    { id: 'g1', name: 'Anxiety Support', members: 120, color: 'var(--tertiary-container)', joined: true },
    { id: 'g2', name: 'Mindful Beginners', members: 340, color: 'var(--secondary-container)', joined: false },
    { id: 'g3', name: 'Sleep Sanctuary', members: 89, color: 'var(--primary-container)', joined: false }
  ]);

  const activeGroupData = activeGroupId ? groups.find(g => g.id === activeGroupId) : null;

  // ─── Load data ───
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const postsData = await fetchPosts(activeGroupId);
      setPosts(postsData);

      if (postsData.length > 0) {
        const postIds = postsData.map(p => p.id);
        const [likesResult, commentsResult] = await Promise.all([
          fetchLikesForPosts(postIds),
          fetchCommentsForPosts(postIds)
        ]);
        setLikeCounts(likesResult.counts);
        setUserLiked(likesResult.userLiked);
        setCommentsMap(commentsResult);
      } else {
        setLikeCounts({});
        setUserLiked({});
        setCommentsMap({});
      }
    } catch (err) {
      console.error('Failed to load community data:', err);
      toast.error('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeGroupId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Post ───
  const handlePost = async () => {
    if (!newPost.trim()) return;
    if (!user) {
      toast.error('Please sign in to post.');
      navigate('/auth');
      return;
    }

    setPosting(true);
    try {
      const authorName = user.user_metadata?.full_name || 'Anonymous';
      await createPost(newPost, activeGroupId, authorName);
      setNewPost('');
      setComposerOpen(false);
      toast.success(activeGroupId ? `Posted in ${activeGroupData.name}` : 'Shared with the global sanctuary.');
      await loadData();
    } catch (err) {
      console.error('Failed to create post:', err);
      toast.error('Failed to post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  // ─── Like ───
  const handleLike = async (postId) => {
    if (!user) {
      toast.error('Please sign in to like posts.');
      navigate('/auth');
      return;
    }

    // Optimistic update
    const wasLiked = userLiked[postId];
    setUserLiked(prev => ({ ...prev, [postId]: !wasLiked }));
    setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + (wasLiked ? -1 : 1) }));

    try {
      await toggleLike(postId);
    } catch (err) {
      // Revert optimistic update
      setUserLiked(prev => ({ ...prev, [postId]: wasLiked }));
      setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + (wasLiked ? 1 : -1) }));
      toast.error('Failed to update like.');
    }
  };

  // ─── Comments ───
  const toggleComments = (id) => {
    setActiveCommentPostId(activeCommentPostId === id ? null : id);
    setNewComment('');
  };

  const handleCommentSubmit = async (postId) => {
    if (!newComment.trim()) return;
    if (!user) {
      toast.error('Please sign in to comment.');
      navigate('/auth');
      return;
    }

    setCommentingPostId(postId);
    try {
      const authorName = user.user_metadata?.full_name || 'Anonymous';
      const comment = await createComment(postId, newComment, authorName);
      setCommentsMap(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
      setNewComment('');
    } catch (err) {
      console.error('Failed to create comment:', err);
      toast.error('Failed to comment. Please try again.');
    } finally {
      setCommentingPostId(null);
    }
  };

  // ─── Groups (stay local) ───
  const handleJoinGroup = (groupId) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        if (!g.joined) toast.success(`Welcome to the ${g.name} group!`);
        return { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 };
      }
      return g;
    }));
  };

  const navigateToGroup = (groupId) => {
    setActiveGroupId(groupId);
    setComposerOpen(false);
  };

  return (
    <motion.div 
      className={clsx('container', styles.page)}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          {activeGroupId && (
            <button 
              onClick={() => navigateToGroup(null)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center' }}
            >
               <ArrowLeft size={24} />
            </button>
          )}
          <h2 style={{ marginBottom: 0 }}>
            {activeGroupData ? activeGroupData.name : 'Our Sanctuary'}
          </h2>
        </div>
        <p>
          {activeGroupData 
            ? `Connect privately with members discussing ${activeGroupData.name.toLowerCase()}.` 
            : 'A safe space to share, connect, and breathe together.'}
        </p>
      </header>

      <div className={styles.grid}>
        <div className={styles.mainFeed}>
          
          <AnimatePresence>
            {!composerOpen ? (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <Button variant="secondary" onClick={() => setComposerOpen(true)} style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'flex-start', gap: '0.5rem', color: 'var(--on-surface-variant)' }}>
                  <Plus size={20} /> {activeGroupData ? `Post anonymously to ${activeGroupData.name}...` : 'Share your thoughts anonymously...'}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className={styles.composerCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>
                      Posting as {user?.user_metadata?.full_name || 'Anonymous'} {activeGroupData ? `in ${activeGroupData.name}` : '(Global)'}
                    </span>
                    <button onClick={() => setComposerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}><X size={16} /></button>
                  </div>
                  <textarea 
                    className={styles.composerInput} 
                    placeholder="What's on your mind?"
                    rows={3}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    autoFocus
                  ></textarea>
                  <div className={styles.composerActions}>
                    <Button size="sm" onClick={handlePost} disabled={posting || !newPost.trim()}>
                      {posting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--on-surface-variant)' }}>
              <Loader size={24} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <motion.div 
              className={styles.feed}
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
              }}
            >
              <AnimatePresence mode="popLayout">
                {posts.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', padding: '3rem', color: 'var(--on-surface-variant)' }}
                  >
                    <p>No thoughts shared here yet. Be the first!</p>
                  </motion.div>
                ) : (
                  posts.map(post => {
                    const postComments = commentsMap[post.id] || [];
                    const likes = likeCounts[post.id] || 0;
                    const liked = userLiked[post.id] || false;

                    return (
                      <motion.div 
                        key={post.id}
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <Card className={styles.postCard}>
                          <div className={styles.postHeader}>
                            <div className={styles.avatar}></div>
                            <div>
                              <h4 className={styles.author}>{post.author_name}</h4>
                              <span className={styles.time}>{timeAgo(post.created_at)}</span>
                            </div>
                          </div>
                          <p className={styles.postContent}>{post.content}</p>
                          <div className={styles.postActions}>
                            <motion.button 
                              className={clsx(styles.actionBtn, liked && styles.actionLiked)}
                              onClick={() => handleLike(post.id)}
                              whileTap={{ scale: 0.8 }}
                            >
                              <Heart size={18} fill={liked ? 'var(--error)' : 'none'} color={liked ? 'var(--error)' : 'currentColor'} />
                              <span>{likes}</span>
                            </motion.button>
                            <button 
                              className={clsx(styles.actionBtn, activeCommentPostId === post.id && styles.actionActive)} 
                              onClick={() => toggleComments(post.id)}
                            >
                              <MessageCircle size={18} />
                              <span>{postComments.length}</span>
                            </button>
                            <button className={styles.actionBtn} onClick={() => toast("Link copied to clipboard!")}>
                              <Share2 size={18} />
                            </button>
                          </div>

                          <AnimatePresence>
                            {activeCommentPostId === post.id && (
                              <motion.div 
                                className={styles.commentsSection}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div className={styles.commentList}>
                                  {postComments.map(comment => (
                                    <div key={comment.id} className={styles.commentItem}>
                                      <strong>{comment.author_name}</strong> {comment.content}
                                    </div>
                                  ))}
                                </div>
                                <div className={styles.commentInputRow}>
                                  <input 
                                    type="text" 
                                    placeholder="Write a supportive comment..." 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                                    className={styles.commentInput}
                                  />
                                  <button 
                                    className={styles.commentSubmitBtn} 
                                    onClick={() => handleCommentSubmit(post.id)}
                                    disabled={commentingPostId === post.id}
                                  >
                                    <Send size={16} />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <motion.aside 
          className={styles.sidebar}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={styles.groupsCard}>
            <h3>Peer Groups</h3>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Connect with others walking a similar path.
            </p>
            <div className={styles.groupList}>
              {groups.map((group) => (
                <div className={styles.groupItem} key={group.id}>
                  <div className={styles.groupAvatar} style={{ background: group.color }}></div>
                  <div className={styles.groupInfo}>
                    <h4 
                      onClick={() => navigateToGroup(group.id)} 
                      style={{ cursor: 'pointer', textDecoration: activeGroupId === group.id ? 'underline' : 'none' }}
                      className={clsx(activeGroupId === group.id && styles.activeGroupName)}
                    >
                      {group.name}
                    </h4>
                    <span>{group.members} members</span>
                  </div>
                  <Button 
                    variant={group.joined ? "secondary" : "tertiary"} 
                    size="sm" 
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    {group.joined ? "Leave" : "Join"}
                  </Button>
                </div>
              ))}
            </div>
            {activeGroupId !== null && (
               <Button variant="tertiary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => navigateToGroup(null)}>
                 View Global Feed
               </Button>
            )}
          </Card>
        </motion.aside>
      </div>
    </motion.div>
  );
}
