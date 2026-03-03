import { cn } from "../lib/utils";

const STAGES = [
  {
    id: 1,
    zh: "誕生期",
    en: "Birth",
    sub: "Erythropoiesis",
    desc: "造血幹細胞分化為紅血球，細胞核逐漸被排出",
    color: "from-[#9b2346] to-[#7a1230]",
    dot: "bg-[#cc3399]",
  },
  {
    id: 2,
    zh: "壯年期",
    en: "Maturity",
    sub: "Biconcave Disc",
    desc: "成熟雙凹圓盤，富含血紅素，具高度彈性可穿越微血管",
    color: "from-[#c42233] to-[#8a1520]",
    dot: "bg-[#dd2233]",
  },
  {
    id: 3,
    zh: "任務期",
    en: "Task",
    sub: "O₂ Transport",
    desc: "攜帶氧氣（鮮紅）或釋放後（深暗紅）在循環中穿梭",
    color: "from-[#c42233] to-[#7a1520]",
    dot: "bg-[#ff2233]",
  },
  {
    id: 4,
    zh: "衰老期",
    en: "Senescence",
    sub: "Aging",
    desc: "失去彈性，從雙凹圓盤變為球形，表面粗糙，移動遲緩",
    color: "from-[#7a1520] to-[#4a0c10]",
    dot: "bg-[#7a2020]",
  },
  {
    id: 5,
    zh: "凋零",
    en: "Death",
    sub: "Phagocytosis",
    desc: "在脾臟微血管中卡住後被吞噬，碎裂成膽紅素顆粒回收",
    color: "from-[#7a4010] to-[#4a2808]",
    dot: "bg-[#c87030]",
  },
];

interface UIPanelProps {
  stage: number;
  oxygenated: boolean;
  onStageChange: (s: number) => void;
  onOxygenToggle: () => void;
}

export function UIPanel({ stage, oxygenated, onStageChange, onOxygenToggle }: UIPanelProps) {
  const current = STAGES[stage - 1];

  return (
    <>
      {/* Left panel — stage buttons */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        {STAGES.map((s) => (
          <button
            key={s.id}
            onClick={() => onStageChange(s.id)}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-300 text-left",
              "backdrop-blur-sm",
              stage === s.id
                ? "border-primary/60 bg-primary/20 shadow-lg shadow-primary/20"
                : "border-border/40 bg-card/30 hover:bg-card/50 hover:border-border/60"
            )}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300",
                s.dot,
                stage === s.id ? "scale-125 shadow-md" : "opacity-50"
              )}
            />
            <div>
              <div className={cn(
                "text-sm font-semibold leading-tight transition-colors",
                stage === s.id ? "text-foreground" : "text-muted-foreground"
              )}>
                {s.zh}
              </div>
              <div className="text-[10px] text-muted-foreground/70 leading-tight font-mono tracking-wide">
                {s.en}
              </div>
            </div>
            {stage === s.id && (
              <div className="ml-1 w-1 h-6 rounded-full bg-primary/80" />
            )}
          </button>
        ))}
      </div>

      {/* Bottom info panel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
        <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-md p-4 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
                  Stage {current.id} / 5
                </span>
                <span className="text-xs text-muted-foreground/60 font-mono">—</span>
                <span className="font-mono text-xs text-muted-foreground/80 tracking-wide">
                  {current.sub}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground leading-tight">
                {current.zh}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  {current.en}
                </span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {current.desc}
              </p>
            </div>

            {/* Stage indicator dots */}
            <div className="flex gap-2 pt-1 flex-shrink-0">
              {STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onStageChange(s.id)}
                  className={cn(
                    "rounded transition-all duration-300 cursor-pointer",
                    stage === s.id
                      ? "w-3 h-3 bg-warning shadow-md shadow-primary/50 scale-110"
                      : "w-2 h-2 bg-secondary hover:bg-muted-foreground/60 hover:scale-105"
                  )}
                  aria-label={`Go to stage ${s.id}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Oxygen toggle — only shown at stage 3 */}
      {stage === 3 && (
        <div className="absolute top-6 right-4 z-10">
          <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-md p-4 shadow-xl">
            <p className="text-xs text-muted-foreground mb-3 font-mono tracking-widest uppercase">
              Hemoglobin State
            </p>
            <button
              onClick={onOxygenToggle}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg",
                "border transition-all duration-500 font-semibold text-sm",
                oxygenated
                  ? "border-red-500/60 bg-red-900/30 text-red-200 shadow-lg shadow-red-900/30"
                  : "border-rose-900/60 bg-rose-950/30 text-rose-300/80"
              )}
            >
              <span className={cn(
                "w-3 h-3 rounded-full transition-colors duration-500",
                oxygenated ? "bg-red-400" : "bg-rose-900"
              )} />
              <span className="flex-1 text-left">
                {oxygenated ? "充氧血 Oxyhemoglobin" : "缺氧血 Deoxyhemoglobin"}
              </span>
              <svg
                className="w-4 h-4 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Top-right title */}
      <div className="absolute top-6 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Red Blood Cell · Life Cycle · 3D
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mt-0.5 text-balance">
          紅血球的一生
        </h1>
      </div>
    </>
  );
}
