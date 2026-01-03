'use client';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-neutral-light-gray via-white/80 to-neutral-light-gray bg-[length:200%_100%]',
        'rounded-lg',
        className
      )}
    />
  );
}

// Skeleton para Card
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('bg-white/80 rounded-2xl p-4 shadow-soft', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </div>
  );
}

// Skeleton para StreakCounter
export function SkeletonStreak() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-20" />
      </div>
    </div>
  );
}

// Skeleton para XPProgressBar
export function SkeletonXP() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

// Skeleton para ReadingCard
export function SkeletonReadingCard() {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-black/5">
      <Skeleton className="w-5 h-5 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
  );
}

// Skeleton para lista de leituras
export function SkeletonReadingList() {
  return (
    <div className="space-y-3">
      <SkeletonReadingCard />
      <SkeletonReadingCard />
      <SkeletonReadingCard />
      <SkeletonReadingCard />
    </div>
  );
}

// Skeleton para DayProgress
export function SkeletonDayProgress() {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-2 flex-1 rounded-full" />
      ))}
    </div>
  );
}

// Skeleton para MonthCalendar
export function SkeletonCalendar() {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: 25 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-xl" />
      ))}
    </div>
  );
}

// Skeleton para Dashboard completo
export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Saudação */}
      <div className="hidden lg:block space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Streak e XP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/80 rounded-2xl p-4 shadow-soft">
          <SkeletonStreak />
        </div>
        <div className="bg-white/80 rounded-2xl p-4 shadow-soft">
          <SkeletonXP />
        </div>
      </div>

      {/* Leituras do dia */}
      <div className="bg-white/80 rounded-2xl p-4 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
        </div>
        <SkeletonDayProgress />
        <SkeletonReadingList />
      </div>

      {/* Calendário */}
      <div className="bg-white/80 rounded-2xl p-4 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
        <SkeletonCalendar />
      </div>
    </div>
  );
}

// Skeleton para página de Leitura
export function SkeletonLeituraPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header com navegação */}
      <div className="bg-white/80 rounded-2xl p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="text-center space-y-2">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* Leituras */}
      <div className="bg-white/80 rounded-2xl p-4 shadow-soft space-y-4">
        <Skeleton className="h-6 w-48" />
        <SkeletonDayProgress />
        <SkeletonReadingList />
      </div>

      {/* Calendário */}
      <div className="bg-white/80 rounded-2xl p-4 shadow-soft space-y-4">
        <Skeleton className="h-6 w-32" />
        <SkeletonCalendar />
      </div>
    </div>
  );
}

// Skeleton para página de Progresso
export function SkeletonProgressoPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Estatísticas gerais */}
      <div className="bg-white/80 rounded-2xl p-4 shadow-soft space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
      </div>

      {/* Meses */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/80 rounded-2xl p-4 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}
