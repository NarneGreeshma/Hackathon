import React from 'react';
import { Link } from 'react-router-dom';
import { Agent } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Star, FileText, ScanText, Code2, Languages, BookOpenCheck, ShieldCheck, Cpu, ArrowRight, Zap } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onUseAgent?: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onUseAgent }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="h-6 w-6 text-blue-400" />;
      case 'ScanText': return <ScanText className="h-6 w-6 text-indigo-400" />;
      case 'Code2': return <Code2 className="h-6 w-6 text-cyan-400" />;
      case 'Languages': return <Languages className="h-6 w-6 text-emerald-400" />;
      case 'BookOpenCheck': return <BookOpenCheck className="h-6 w-6 text-purple-400" />;
      case 'ShieldCheck': return <ShieldCheck className="h-6 w-6 text-amber-400" />;
      default: return <Cpu className="h-6 w-6 text-blue-400" />;
    }
  };

  return (
    <Card className="flex flex-col justify-between h-full group" hoverable>
      <div>
        {/* Header: Icon & Category */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border border-blue-500/20 shadow-md group-hover:border-blue-500/40 transition-colors">
            {getIcon(agent.logo)}
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="blue" size="sm">
              {agent.category}
            </Badge>
            {agent.featured && (
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                FEATURED
              </span>
            )}
          </div>
        </div>

        {/* Agent Name & Description */}
        <Link to={`/agent/${agent.id}`} className="block group-hover:text-blue-400 transition-colors">
          <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
            {agent.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
          {agent.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {agent.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] font-mono text-gray-400 bg-gray-800/60 px-2 py-0.5 rounded-md border border-gray-800">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        {/* Rating & Developer Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800/80 mb-4 text-xs">
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span>{agent.rating}</span>
            <span className="text-gray-500 font-normal">({agent.reviewCount})</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-mono block">Dev: {agent.developer}</span>
            <span className="text-[9px] text-emerald-400 font-mono">App #{agent.appId}</span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div>
            <div className="text-xs font-mono text-gray-400">Price / request</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-emerald-400 font-mono">₹{agent.priceInr ? agent.priceInr.toLocaleString('en-IN') : Math.round(agent.priceAlgo * 100000).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/agent/${agent.id}`}
              className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs font-medium text-gray-300 hover:border-gray-700 hover:text-white transition-colors"
            >
              Details
            </Link>

            <button
              onClick={() => onUseAgent?.(agent)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
            >
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              Use Agent
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
