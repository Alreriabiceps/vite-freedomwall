import React from "react";

// Skeleton for Post Card
export function PostSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}

// Skeleton for Poll Card
export function PollSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-purple-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

// Skeleton for Announcement Card
export function AnnouncementSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 bg-blue-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}

// Skeleton for Comment
export function CommentSkeleton() {
  return (
    <div className="border-l-4 border-gray-200 pl-4 py-2 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>

      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

// Skeleton for User Info
export function UserInfoSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      <div>
        <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
        <div className="h-2 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}

// Skeleton for Loading More
export function LoadingMoreSkeleton() {
  return (
    <div className="col-span-full flex justify-center py-8">
      <div className="flex items-center gap-3 text-gray-600">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
    </div>
  );
}

// Skeleton for Dashboard Stats
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
