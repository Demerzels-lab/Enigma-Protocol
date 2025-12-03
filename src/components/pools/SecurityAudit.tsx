import { Shield, Award, FileCheck, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecurityAudit() {
  const audits = [
    {
      auditor: 'CertiK',
      date: 'Oktober 2025',
      score: 95,
      status: 'passed',
      findings: {
        critical: 0,
        high: 0,
        medium: 2,
        low: 5,
      },
      reportUrl: '#',
    },
    {
      auditor: 'Trail of Bits',
      date: 'September 2025',
      score: 92,
      status: 'passed',
      findings: {
        critical: 0,
        high: 1,
        medium: 3,
        low: 8,
      },
      reportUrl: '#',
    },
  ];

  const bugBounty = {
    totalPaid: '$125,000',
    activeBugs: 3,
    resolvedBugs: 47,
    maxReward: '$50,000',
    platform: 'Immunefi',
    platformUrl: 'https://immunefi.com',
  };

  const securityMetrics = [
    {
      label: 'Smart Contract Coverage',
      value: '98.5%',
      icon: FileCheck,
      color: 'text-semantic-success',
    },
    {
      label: 'ZK Proof Verification',
      value: '100%',
      icon: Shield,
      color: 'text-primary-500',
    },
    {
      label: 'Bug Bounty Payouts',
      value: bugBounty.totalPaid,
      icon: Award,
      color: 'text-accent-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Security Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        {securityMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-neutral-50 rounded-xl p-5 border border-neutral-400/20"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-10 h-10 ${metric.color.replace('text-', 'bg-')}/10 rounded-lg flex items-center justify-center`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div>
                <p className="text-xs text-neutral-300">{metric.label}</p>
                <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Audits */}
      <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400/20">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-semantic-success" />
          Security Audits
        </h3>
        
        <div className="space-y-4">
          {audits.map((audit, index) => (
            <motion.div
              key={audit.auditor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-neutral-100 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{audit.auditor}</h4>
                    <span className="flex items-center space-x-1 bg-semantic-success/10 text-semantic-success text-xs px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Passed</span>
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300">{audit.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-semantic-success">{audit.score}</p>
                  <p className="text-xs text-neutral-300">Score</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-3">
                <div className="bg-neutral-50 rounded p-2">
                  <p className="text-xs text-neutral-300">Critical</p>
                  <p className={`text-lg font-bold ${audit.findings.critical > 0 ? 'text-semantic-error' : 'text-semantic-success'}`}>
                    {audit.findings.critical}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded p-2">
                  <p className="text-xs text-neutral-300">High</p>
                  <p className={`text-lg font-bold ${audit.findings.high > 0 ? 'text-semantic-warning' : 'text-semantic-success'}`}>
                    {audit.findings.high}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded p-2">
                  <p className="text-xs text-neutral-300">Medium</p>
                  <p className="text-lg font-bold text-neutral-300">{audit.findings.medium}</p>
                </div>
                <div className="bg-neutral-50 rounded p-2">
                  <p className="text-xs text-neutral-300">Low</p>
                  <p className="text-lg font-bold text-neutral-300">{audit.findings.low}</p>
                </div>
              </div>

              <a
                href={audit.reportUrl}
                className="text-xs text-primary-500 hover:text-primary-700 flex items-center space-x-1"
              >
                <span>View Full Report</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bug Bounty Program */}
      <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400/20">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-accent-500" />
          Bug Bounty Program
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-neutral-300 mb-4">
              Kami menghargai kontribusi security researchers dalam meningkatkan keamanan platform. 
              Program bug bounty aktif di {bugBounty.platform}.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg">
                <span className="text-sm text-neutral-300">Total Bounty Paid</span>
                <span className="font-bold text-accent-500">{bugBounty.totalPaid}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg">
                <span className="text-sm text-neutral-300">Max Reward</span>
                <span className="font-bold text-primary-500">{bugBounty.maxReward}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg">
                <span className="text-sm text-neutral-300">Resolved Bugs</span>
                <span className="font-bold text-semantic-success">{bugBounty.resolvedBugs}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="bg-accent-500/5 border border-accent-500/20 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2 text-sm">Severity Rewards</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Critical</span>
                  <span className="font-semibold text-semantic-error">$25,000 - $50,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">High</span>
                  <span className="font-semibold text-semantic-warning">$10,000 - $25,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Medium</span>
                  <span className="font-semibold text-accent-500">$5,000 - $10,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Low</span>
                  <span className="font-semibold text-primary-500">$1,000 - $5,000</span>
                </div>
              </div>
            </div>

            <a
              href={bugBounty.platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-6 py-3 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-all flex items-center justify-center space-x-2"
            >
              <span>Submit Bug Report</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Incident Reporting */}
      <div className="bg-semantic-warning/5 border border-semantic-warning/20 rounded-xl p-5">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-semantic-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Security Incident Reporting</h4>
            <p className="text-sm text-neutral-300 mb-3">
              Temukan bug kritis? Laporkan langsung ke tim security kami melalui email:
            </p>
            <a
              href="mailto:security@masquerade.io"
              className="text-sm font-semibold text-primary-500 hover:text-primary-700"
            >
              security@masquerade.io
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
