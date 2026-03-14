import { useQuery } from "@tanstack/react-query";
import { Compass, Cog, Sun, Sailboat, Radio, Anchor } from "lucide-react";
import heroPath from "@assets/hero.jpg";

const iconMap: Record<string, any> = {
  compass: Compass,
  engine: Cog,
  sun: Sun,
  sailboat: Sailboat,
  radar: Radio,
  anchor: Anchor,
};

interface VesselData {
  vessel: {
    name: string;
    model: string;
    year: number;
    builder: string;
    loa: string;
    beam: string;
    draftBoard: string;
    displacement: string;
    hailingPort: string;
    surveyDate: string;
    surveyCondition: string;
    fairMarketValue: string;
    fuel: string;
    water: string;
  };
  description: string;
  highlights: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export default function Home() {
  const { data, isLoading } = useQuery<VesselData>({
    queryKey: ["/api/vessel"],
  });

  const specs = data
    ? [
        { label: "LOA", value: data.vessel.loa },
        { label: "Beam", value: data.vessel.beam },
        { label: "Draft", value: data.vessel.draftBoard },
        { label: "Displacement", value: data.vessel.displacement },
        { label: "Engine", value: "Perkins 4-154" },
      ]
    : [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden" data-testid="section-hero">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroPath})`,
            filter: "saturate(1.15) brightness(1.1)",
          }}
        />
        {/* Minimal text-readability scrim — no vignette */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: "linear-gradient(to top, hsla(220, 50%, 8%, 0.45) 0%, transparent 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-end h-full text-center px-4 pb-12">
          <h1
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3)" }}
            data-testid="text-hero-title"
          >
            S/V Colleen
          </h1>
          <p
            className="mt-3 text-lg md:text-xl text-white/95 font-medium tracking-wide"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2)" }}
            data-testid="text-hero-subtitle"
          >
            1984 Cambria 44 &bull; Hull #1
          </p>
        </div>
      </section>

      {/* Specs Strip */}
      <section className="bg-primary text-primary-foreground" data-testid="section-specs">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {specs.map((spec) => (
              <div key={spec.label} className="text-center">
                <div className="text-xs uppercase tracking-wider opacity-70 font-medium">{spec.label}</div>
                <div className="text-sm md:text-base font-bold mt-0.5">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-4xl mx-auto px-4 py-16" data-testid="section-description">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-6 bg-muted rounded animate-pulse w-48" />
            <div className="h-4 bg-muted rounded animate-pulse w-full" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-foreground mb-4">About the Vessel</h2>
            <p className="text-base leading-relaxed text-muted-foreground">{data?.description}</p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card border border-card-border rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Builder</div>
                <div className="text-sm font-semibold mt-1">{data?.vessel.builder}</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Hailing Port</div>
                <div className="text-sm font-semibold mt-1">{data?.vessel.hailingPort}</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Fuel</div>
                <div className="text-sm font-semibold mt-1">{data?.vessel.fuel}</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Water</div>
                <div className="text-sm font-semibold mt-1">{data?.vessel.water}</div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Highlighted Features */}
      <section className="bg-card/50 border-t border-border/40" data-testid="section-highlights">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Highlighted Features</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-card-border rounded-xl p-6 animate-pulse">
                  <div className="w-10 h-10 bg-muted rounded-lg mb-4" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3 mt-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.highlights.map((highlight, index) => {
                const IconComponent = iconMap[highlight.icon] || Anchor;
                return (
                  <div
                    key={index}
                    className="bg-card border border-card-border rounded-xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
                    data-testid={`card-highlight-${index}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <IconComponent className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">{highlight.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
