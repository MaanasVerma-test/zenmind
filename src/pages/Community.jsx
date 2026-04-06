import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import styles from './Community.module.css';
import { MessageCircle, Heart, Share2, Plus, X, Send, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 }
};

export default function Community() {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('zenmind_posts_v3');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, groupId: null, author: 'Anonymous Explorer', time: '2h ago', content: 'Just finished my first 15-minute session without getting completely distracted. Small wins matter!', likes: 24, userLiked: false, comments: [] },
      { id: 2, groupId: null, author: 'Mindful Soul', time: '5h ago', content: 'Does anyone else find the morning manifestation pulse particularly helpful on Mondays? Sets the tone for the week.', likes: 42, userLiked: false, comments: [] },
      
      // Anxiety Support (g1)
      { id: 3, groupId: 'g1', author: 'Calm Seeker', time: '1h ago', content: 'Breathing exercises are really helping calm my racing thoughts today. Highly recommend 4-7-8 breathing.', likes: 55, userLiked: false, comments: [] },
      { id: 4, groupId: 'g1', author: 'Anonymous', time: 'Yesterday', content: 'Does anyone have tips for sudden panic before a big presentation?', likes: 12, userLiked: false, comments: [{id: 111, author: 'Peer', text:'Grounding! Focus on 5 things you can see.'}] },

      // Mindful Beginners (g2)
      { id: 5, groupId: 'g2', author: 'Journey Starter', time: '3h ago', content: 'I keep falling asleep during meditation. Is this normal?', likes: 18, userLiked: false, comments: [{id:112, author:'Guide', text:'Absolutely normal! Your body is relaxing.'}] },

      // Sleep Sanctuary (g3)
      { id: 6, groupId: 'g3', author: 'Restless Mind', time: 'Last night', content: 'The sleep stories feature puts me out like a light. Goodnight everyone.', likes: 89, userLiked: false, comments: [] }
    ];
  });

  const [activeGroupId, setActiveGroupId] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [newPost, setNewPost] = useState('');
  
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [newComment, setNewComment] = useState('');

  const [groups, setGroups] = useState([
    { id: 'g1', name: 'Anxiety Support', members: 120, color: 'var(--tertiary-container)', joined: true },
    { id: 'g2', name: 'Mindful Beginners', members: 340, color: 'var(--secondary-container)', joined: false },
    { id: 'g3', name: 'Sleep Sanctuary', members: 89, color: 'var(--primary-container)', joined: false }
  ]);

  useEffect(() => {
    localStorage.setItem('zenmind_posts_v3', JSON.stringify(posts));
  }, [posts]);

  // Derive which posts to show based on active group mode
  const displayedPosts = posts.filter(p => activeGroupId === 'all' ? true : p.groupId === activeGroupId);
  const activeGroupData = activeGroupId ? groups.find(g => g.id === activeGroupId) : null;

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      groupId: activeGroupId, 
      author: 'You (Anonymous)',
      time: 'Just now',
      content: newPost,
      likes: 0,
      userLiked: false,
      comments: []
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setComposerOpen(false);
    toast.success(activeGroupId ? `Posted in ${activeGroupData.name}` : 'Shared with the global sanctuary.');
  };

  const handleLike = (id) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.userLiked ? p.likes - 1 : p.likes + 1, userLiked: !p.userLiked };
      }
      return p;
    }));
  };

  const toggleComments = (id) => {
    setActiveCommentPostId(activeCommentPostId === id ? null : id);
    setNewComment('');
  };

  const handleCommentSubmit = (postId) => {
    if (!newComment.trim()) return;
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          comments: [...p.comments, { id: Date.now(), author: 'You', text: newComment }] 
        };
      }
      return p;
    }));
    setNewComment('');
  };

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
                      Posting as Anonymous {activeGroupData ? `in ${activeGroupData.name}` : '(Global)'}
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
                    <Button size="sm" onClick={handlePost}>Post</Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

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
              {displayedPosts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '3rem', color: 'var(--on-surface-variant)' }}
                >
                  <p>No thoughts shared here yet. Be the first!</p>
                </motion.div>
              ) : (
                displayedPosts.map(post => (
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
                          <h4 className={styles.author}>{post.author}</h4>
                          <span className={styles.time}>{post.time}</span>
                        </div>
                      </div>
                      <p className={styles.postContent}>{post.content}</p>
                      <div className={styles.postActions}>
                        <motion.button 
                          className={clsx(styles.actionBtn, post.userLiked && styles.actionLiked)}
                          onClick={() => handleLike(post.id)}
                          whileTap={{ scale: 0.8 }}
                        >
                          <Heart size={18} fill={post.userLiked ? 'var(--error)' : 'none'} color={post.userLiked ? 'var(--error)' : 'currentColor'} />
                          <span>{post.likes}</span>
                        </motion.button>
                        <button 
                          className={clsx(styles.actionBtn, activeCommentPostId === post.id && styles.actionActive)} 
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageCircle size={18} />
                          <span>{post.comments.length}</span>
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
                              {post.comments.map(comment => (
                                <div key={comment.id} className={styles.commentItem}>
                                  <strong>{comment.author}</strong> {comment.text}
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
                              <button className={styles.commentSubmitBtn} onClick={() => handleCommentSubmit(post.id)}>
                                <Send size={16} />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
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
