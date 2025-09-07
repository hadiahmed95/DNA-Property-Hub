'use client';

import { useParams } from 'next/navigation';
import BlogForm from '../../_components/blog-form';

export default function EditBlogPage() {
  const params = useParams();
  const blogId = parseInt(params.id as string);

  return <BlogForm mode="edit" blogId={blogId} />;
}
