import React, { useState } from 'react';
import { X, Check, ArrowRight, Star, AlertTriangle, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import Button from '../common/Button';
import './CompareServicesModal.css';

export default function CompareServicesModal({
  isOpen,
  onClose,
  services = [],
  partySize = 2,
  tripBudget = 25000,
  travelDate,
  onRemoveService,
  onSelectService,
  onRequestBooking
}) {
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  if (!isOpen || services.length === 0) return null;

  // Calculate row metrics
  const rows = [
    {
      id: 'price',
      label: 'Base Price',
      values: services.map((s) => ({
        text: `${formatINR(s.price)} / ${s.priceMode === 'person' ? 'person' : 'group'}`,
        raw: s.price
      })),
      getBestIdx: (vals) => {
        let min = Infinity;
        let best = -1;
        vals.forEach((v, idx) => {
          if (v.raw < min) { min = v.raw; best = idx; }
        });
        return best;
      }
    },
    {
      id: 'total',
      label: `Total for ${partySize} ${partySize === 1 ? 'Guest' : 'Guests'}`,
      values: services.map((s) => {
        const total = s.priceMode === 'person' ? s.price * partySize : s.price;
        return { text: formatINR(total), raw: total, isMono: true };
      }),
      getBestIdx: (vals) => {
        let min = Infinity;
        let best = -1;
        vals.forEach((v, idx) => {
          if (v.raw < min) { min = v.raw; best = idx; }
        });
        return best;
      }
    },
    {
      id: 'capacity',
      label: 'Capacity (Min – Max)',
      values: services.map((s) => ({
        text: `${s.capacityMin || 1} to ${s.capacityMax} guests`,
        raw: s.capacityMax,
        isFits: partySize <= s.capacityMax
      })),
      getBestIdx: (vals) => {
        let max = -1;
        let best = -1;
        vals.forEach((v, idx) => {
          if (v.raw > max) { max = v.raw; best = idx; }
        });
        return best;
      }
    },
    {
      id: 'duration',
      label: 'Duration',
      values: services.map((s) => ({ text: s.duration || '3h', raw: s.duration }))
    },
    {
      id: 'languages',
      label: 'Languages',
      values: services.map((s) => ({
        text: (s.guide?.languages || ['English']).join(', '),
        raw: (s.guide?.languages || []).length
      })),
      getBestIdx: (vals) => {
        let max = -1;
        let best = -1;
        vals.forEach((v, idx) => {
          if (v.raw > max) { max = v.raw; best = idx; }
        });
        return best;
      }
    },
    {
      id: 'rating',
      label: 'Rating & Reviews',
      values: services.map((s) => ({
        text: `${s.rating || 4.8}★ (${s.reviewCount || 0} reviews)`,
        raw: s.rating || 4.8
      })),
      getBestIdx: (vals) => {
        let max = -1;
        let best = -1;
        vals.forEach((v, idx) => {
          if (v.raw > max) { max = v.raw; best = idx; }
        });
        return best;
      }
    },
    {
      id: 'responseTime',
      label: 'Guide Response Time',
      values: services.map((s) => ({
        text: s.guide?.responseTime || '< 2h',
        raw: s.guide?.responseTime === '< 1h' ? 1 : s.guide?.responseTime === '< 2h' ? 2 : 4
      })),
      getBestIdx: (vals) => {
        let min = Infinity;
        let best = -1;
        vals.forEach((v, idx) => {
          if (v.raw < min) { min = v.raw; best = idx; }
        });
        return best;
      }
    },
    {
      id: 'availability',
      label: `Available on ${travelDate || 'Selected Date'}`,
      values: services.map((s) => {
        const avail = travelDate && s.availability?.includes(travelDate);
        return {
          text: avail ? 'Available' : 'Check other dates',
          isAvail: avail,
          raw: avail ? 1 : 0
        };
      }),
      getBestIdx: (vals) => {
        const hasAvail = vals.some((v) => v.isAvail);
        return hasAvail ? vals.findIndex((v) => v.isAvail) : -1;
      }
    },
    {
      id: 'budgetFit',
      label: 'Trip Budget Fit',
      values: services.map((s) => {
        const total = s.priceMode === 'person' ? s.price * partySize : s.price;
        const pct = tripBudget > 0 ? Math.round((total / tripBudget) * 100) : 0;
        return {
          text: `${pct}% of ₹${tripBudget.toLocaleString('en-IN')}`,
          raw: pct,
          isMono: true
        };
      }),
      getBestIdx: (vals) => {
        let min = Infinity;
        let best = -1;
        vals.forEach((v, idx) => {
          if (v.raw < min) { min = v.raw; best = idx; }
        });
        return best;
      }
    },
    {
      id: 'inclusions',
      label: 'Key Inclusions',
      values: services.map((s) => ({
        inclusionsList: s.inclusions || ['Local guide commentary', 'Curated route']
      }))
    }
  ];

  // Filter rows if "only differences" is toggled
  const filteredRows = onlyDifferences
    ? rows.filter((r) => {
        if (r.id === 'inclusions') return true;
        const first = JSON.stringify(r.values[0]?.text);
        return r.values.some((v) => JSON.stringify(v?.text) !== first);
      })
    : rows;

  return (
    <div className="compare-modal-backdrop" onClick={onClose}>
      <div
        className="compare-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Compare Services Matrix"
      >
        {/* Header */}
        <div className="compare-modal-header">
          <div>
            <div className="compare-header-eyebrow">
              <Sparkles size={14} />
              <span>DECISION MATRIX</span>
            </div>
            <h2 className="compare-modal-title">
              Compare {services.length} Local Services Side by Side
            </h2>
            <p className="compare-modal-sub">
              Pricing computed for {partySize} {partySize === 1 ? 'person' : 'guests'} against your ₹
              {tripBudget.toLocaleString('en-IN')} budget.
            </p>
          </div>

          <div className="compare-header-actions">
            {/* Toggle Only Differences */}
            <label className="diff-toggle-label">
              <input
                type="checkbox"
                checked={onlyDifferences}
                onChange={(e) => setOnlyDifferences(e.target.checked)}
              />
              <span>Show only differences</span>
            </label>

            <button
              type="button"
              className="compare-modal-close"
              onClick={onClose}
              aria-label="Close comparison matrix"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="compare-table-container">
          <table className="compare-matrix-table">
            <thead>
              <tr>
                <th className="th-criteria">Criteria</th>
                {services.map((svc) => (
                  <th key={svc.id} className="th-service-col">
                    <div className="compare-svc-card">
                      <button
                        type="button"
                        className="compare-remove-btn"
                        onClick={() => onRemoveService(svc.id)}
                        title="Remove from comparison"
                        aria-label="Remove"
                      >
                        <X size={14} />
                      </button>

                      <div className="compare-svc-arch">
                        <img
                          src={svc.guide?.photo || '/images/guide-portrait.jpg'}
                          alt={svc.guide?.name}
                          className="compare-svc-img"
                        />
                      </div>

                      <strong className="compare-svc-title">{svc.title}</strong>
                      <span className="compare-guide-name">
                        by {svc.guide?.name}
                        {svc.guide?.verified && (
                          <ShieldCheck size={12} className="verified-icon" />
                        )}
                      </span>

                      <div className="compare-col-actions">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            onClose();
                            onRequestBooking(svc);
                          }}
                        >
                          Request booking
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onClose();
                            onSelectService(svc);
                          }}
                        >
                          View detail
                        </Button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row) => {
                const bestIdx = row.getBestIdx ? row.getBestIdx(row.values) : -1;

                return (
                  <tr key={row.id}>
                    <td className="td-criteria-label">{row.label}</td>
                    {row.values.map((val, idx) => {
                      const isBest = bestIdx === idx && services.length > 1;

                      if (row.id === 'inclusions') {
                        return (
                          <td key={idx} className="td-value td-inclusions">
                            <ul className="compare-inclusions-list">
                              {(val.inclusionsList || []).map((inc, i) => (
                                <li key={i}>
                                  <Check size={12} /> <span>{inc}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={idx}
                          className={`td-value ${val.isMono ? 'tabular-nums' : ''} ${
                            isBest ? 'is-best-value' : ''
                          }`}
                        >
                          <div className="val-content-wrap">
                            <span>{val.text}</span>
                            {isBest && (
                              <span className="best-value-pill" title="Best value in this criteria">
                                best
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
