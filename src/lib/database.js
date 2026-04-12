import { supabase } from './supabase';

// ─── Helper: relative time ───
export function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

// ─── Community Posts ───

export async function fetchPosts(groupId = null) {
  let query = supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (groupId && groupId !== 'all') {
    query = query.eq('group_id', groupId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createPost(content, groupId, authorName = 'Anonymous') {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to post');

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: user.id,
      group_id: groupId || null,
      author_name: authorName,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePost(postId) {
  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

// ─── Community Likes ───

export async function fetchLikesForPosts(postIds) {
  if (!postIds.length) return { counts: {}, userLiked: {} };

  // Get counts
  const { data: allLikes, error } = await supabase
    .from('community_likes')
    .select('post_id, user_id')
    .in('post_id', postIds);

  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const counts = {};
  const userLiked = {};

  for (const postId of postIds) {
    counts[postId] = 0;
    userLiked[postId] = false;
  }

  for (const like of (allLikes || [])) {
    counts[like.post_id] = (counts[like.post_id] || 0) + 1;
    if (userId && like.user_id === userId) {
      userLiked[like.post_id] = true;
    }
  }

  return { counts, userLiked };
}

export async function toggleLike(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to like');

  // Check if already liked
  const { data: existing } = await supabase
    .from('community_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    // Unlike
    const { error } = await supabase
      .from('community_likes')
      .delete()
      .eq('id', existing.id);
    if (error) throw error;
    return false; // now unliked
  } else {
    // Like
    const { error } = await supabase
      .from('community_likes')
      .insert({ post_id: postId, user_id: user.id });
    if (error) throw error;
    return true; // now liked
  }
}

// ─── Community Comments ───

export async function fetchCommentsForPosts(postIds) {
  if (!postIds.length) return {};

  const { data, error } = await supabase
    .from('community_comments')
    .select('*')
    .in('post_id', postIds)
    .order('created_at', { ascending: true });

  if (error) throw error;

  const grouped = {};
  for (const postId of postIds) {
    grouped[postId] = [];
  }
  for (const comment of (data || [])) {
    if (!grouped[comment.post_id]) grouped[comment.post_id] = [];
    grouped[comment.post_id].push(comment);
  }

  return grouped;
}

export async function createComment(postId, content, authorName = 'Anonymous') {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to comment');

  const { data, error } = await supabase
    .from('community_comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      author_name: authorName,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Site Stats ───

export async function fetchSiteStats() {
  const { data, error } = await supabase
    .from('site_stats')
    .select('member_count, app_rating')
    .eq('id', 1)
    .single();

  if (error) {
    // Fallback if table doesn't exist yet
    return { member_count: '10k+', app_rating: '4.9/5' };
  }

  return data;
}
