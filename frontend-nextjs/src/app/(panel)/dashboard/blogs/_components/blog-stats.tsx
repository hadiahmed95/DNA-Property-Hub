'use client';

import { MontserratFont } from "../../../../fonts";

interface BlogStatsProps {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  featuredBlogs: number;
}

export default function BlogStats({
  totalBlogs,
  publishedBlogs,
  draftBlogs,
  totalViews,
  featuredBlogs
}: BlogStatsProps) {
  const stats = [
    {
      title: 'Total Posts',
      value: totalBlogs,
      color: 'text-blue-600 bg-blue-50',
      icon: '📝'
    },
    {
      title: 'Published',
      value: publishedBlogs,
      color: 'text-emerald-600 bg-emerald-50',
      icon: '✅'
    },
    {
      title: 'Drafts',
      value: draftBlogs,
      color: 'text-amber-600 bg-amber-50',
      icon: '📄'
    },
    {
      title: 'Total Views',
      value: totalViews.toLocaleString(),
      color: 'text-purple-600 bg-purple-50',
      icon: '👁️'
    },
    {
      title: 'Featured',
      value: featuredBlogs,
      color: 'text-[var(--primary)] bg-amber-50',
      icon: '⭐'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className={`text-2xl font-bold ${MontserratFont.className}`}>
                {stat.value}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}