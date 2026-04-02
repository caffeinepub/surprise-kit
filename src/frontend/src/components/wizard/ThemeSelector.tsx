import { Check } from "lucide-react";
import { motion } from "motion/react";
import { THEME_LIST } from "../../lib/themes";

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export default function ThemeSelector({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">
        Choose Your Kit Theme
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Pick a color palette that matches your vibe.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {THEME_LIST.map((theme, i) => {
          const isSelected = value === theme.id;
          return (
            <motion.button
              type="button"
              key={theme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onChange(theme.id)}
              className={`relative rounded-2xl border-2 overflow-hidden text-left transition-all ${isSelected ? "border-primary shadow-md" : "border-border hover:border-primary/40"}`}
              data-ocid={`theme.item.${i + 1}`}
            >
              <div className="h-14 w-full flex">
                {theme.palette.map((c) => (
                  <div key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-base">{theme.emoji}</span>
                  <span className="font-semibold text-sm">{theme.name}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {theme.description}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
