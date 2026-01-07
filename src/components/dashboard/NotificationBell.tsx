'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  userId: string;
  type: 'COMPLETE_PROFILE' | 'PLAN_READY' | 'REMINDER' | 'UPDATE';
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications/list');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  // Load notifications on mount and when panel opens
  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session]);

  useEffect(() => {
    if (isOpen && session?.user) {
      fetchNotifications();
    }
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!session?.user) {
    return null;
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5 text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel */}
          <div className="absolute right-0 top-12 w-80 max-h-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white">Notificaciones</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-800 rounded transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-80">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                  <p className="text-slate-400 text-sm mt-2">Cargando...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No tienes notificaciones</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 transition-colors cursor-pointer ${
                        notification.read
                          ? 'bg-slate-900 hover:bg-slate-800'
                          : 'bg-emerald-500/5 hover:bg-emerald-500/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notification.read
                              ? 'bg-slate-800'
                              : 'bg-emerald-500/20'
                          }`}
                        >
                          {notification.type === 'COMPLETE_PROFILE' ? (
                            <CheckCircle2
                              className={`w-5 h-5 ${
                                notification.read
                                  ? 'text-slate-500'
                                  : 'text-emerald-400'
                              }`}
                            />
                          ) : (
                            <Bell
                              className={`w-5 h-5 ${
                                notification.read
                                  ? 'text-slate-500'
                                  : 'text-emerald-400'
                              }`}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-grow min-w-0">
                          <h4
                            className={`font-medium text-sm mb-1 ${
                              notification.read ? 'text-slate-400' : 'text-white'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p
                            className={`text-xs mb-2 line-clamp-2 ${
                              notification.read ? 'text-slate-500' : 'text-slate-300'
                            }`}
                          >
                            {notification.message}
                          </p>

                          {notification.actionLabel && (
                            <div
                              className={`text-xs font-medium ${
                                notification.read
                                  ? 'text-slate-500'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {notification.actionLabel} →
                            </div>
                          )}

                          <p className="text-[10px] text-slate-600 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
