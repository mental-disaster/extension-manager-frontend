function SkeletonSection() {
    return (
      <section className="rounded-xl bg-white p-4 shadow-sm space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-3 w-64 bg-slate-200 rounded" />
        <div className="flex gap-2 mt-4 flex-wrap">
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-5 w-14 bg-slate-200 rounded-full" />
          <div className="h-5 w-24 bg-slate-200 rounded-full" />
        </div>
        <div className="h-4 w-24 bg-slate-200 rounded mt-4" />
        <div className="flex gap-2 flex-wrap">
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-5 w-14 bg-slate-200 rounded-full" />
        </div>
      </section>
    );
  }

export default SkeletonSection;