import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  MapPin, 
  SlidersHorizontal,
  Layers,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  selectChatStep, 
  selectChatPreferences, 
  selectChatResults,
  setStep,
  updatePreferences,
  restartChat
} from '../store/chatSlice';
import { setPendingPlan } from '../store/tripSlice';
import { calculateMatchScores } from '../utils/matchScore';
import CompareModal from '../components/chatbot/CompareModal';
import Button from '../components/common/Button';
import './Chatbot.css';

const SCENERY_OPTIONS = [
  { id: 'mountains', icon: '🏔️', title: 'Alpine Peaks & Pines', desc: 'Snow ridges, mountain toy trains & fresh pine air' },
  { id: 'heritage', icon: '🏰', title: 'Royal Forts & Palaces', desc: 'Ancient stone courtyards, bazaars & historic gates' },
  { id: 'beaches', icon: '🌊', title: 'Coastal Beaches & Tides', desc: 'Warm ocean breeze, beach shacks & pastel villas' },
  { id: 'neon_city', icon: '⚡', title: 'Neon Skylines & City Energy', desc: 'Towering cityscapes, hyper-speed rail & night stalls' },
  { id: 'tranquil_lakes', icon: '🌿', title: 'Lakes & Tea Hills', desc: 'Emerald plantations, calm waters & morning fog' }
];

const VIBE_OPTIONS = [
  { id: 'slow', icon: '☕', title: 'Slow Living & Balcony Coffee', desc: 'Zero rushing. Balcony reading, long lunches & views' },
  { id: 'thrill', icon: '🧗', title: 'Adrenaline & High Passes', desc: 'Mountain passes, hiking trails & active exploration' },
  { id: 'foodie', icon: '🍜', title: 'Street Food Crawls & Markets', desc: 'Night food arcades, local bakeries & iconic delicacies' },
  { id: 'culture', icon: '📸', title: 'Art, Architecture & Shrines', desc: 'Centuries-old shrines, monuments & cultural walks' }
];

const COMPANION_OPTIONS = [
  { id: 'solo', icon: '👤', title: 'Solo Explorer', desc: 'Total freedom, self-paced alleys & meeting locals' },
  { id: 'couple', icon: '💑', title: 'Romantic Getaway', desc: 'Scenic sunsets, intimate stays & candlelit dining' },
  { id: 'friends', icon: '🎒', title: 'The Squad', desc: 'Shared road trips, late-night laughs & energetic vibes' },
  { id: 'family', icon: '👨‍👩‍👧', title: 'Family Holiday', desc: 'Comfortable pacing, gentle walking & all-age comfort' }
];

const MOMENT_OPTIONS = [
  { id: 'snow_chai', icon: '🫖', title: 'Hot Chai in the Mountains', desc: 'Sipping hot ginger chai while mist drifts past pine valleys' },
  { id: 'sunset_boat', icon: '⛵', title: 'Sunset on the Water', desc: 'Watching golden twilight reflect across calm lakes or oceans' },
  { id: 'night_ramen', icon: '🍜', title: 'Late-Night Alley Eats', desc: 'A steaming bowl of fresh noodles under glowing paper lanterns' },
  { id: 'palace_twilight', icon: '🕌', title: 'Palace Courtyard Dusk', desc: 'Walking quiet sandstone courtyards as lamps flicker to life' },
  { id: 'alpine_train', icon: '🚂', title: 'Scenic Mountain Railway', desc: 'Leaning out the window of a historic train curving through peaks' }
];

export default function Chatbot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentStep = useSelector(selectChatStep);
  const preferences = useSelector(selectChatPreferences);
  const storedResults = useSelector(selectChatResults);

  const [selectedScenery, setSelectedScenery] = useState(preferences.scenery || 'mountains');
  const [selectedVibe, setSelectedVibe] = useState(preferences.vibe || 'slow');
  const [selectedTravelers, setSelectedTravelers] = useState(preferences.travelers || 'solo');
  const [selectedMoment, setSelectedMoment] = useState(preferences.moment || 'snow_chai');

  // Loading & Filter states
  const [isCalculating, setIsCalculating] = useState(false);
  const [filterRegion, setFilterRegion] = useState('all'); // 'all', 'india', 'international'
  const [filterBudget, setFilterBudget] = useState('all'); // 'all', 'budget', 'comfort', 'premium'
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    if (preferences.scenery) setSelectedScenery(preferences.scenery);
    if (preferences.vibe) setSelectedVibe(preferences.vibe);
    if (preferences.travelers) setSelectedTravelers(preferences.travelers);
    if (preferences.moment) setSelectedMoment(preferences.moment);
  }, [preferences]);

  const handleNext = (nextStepKey, updateData) => {
    dispatch(updatePreferences(updateData));
    dispatch(setStep(nextStepKey));
  };

  const handleFinish = (finalMoment) => {
    const finalAnswers = {
      scenery: selectedScenery,
      vibe: selectedVibe,
      travelers: selectedTravelers,
      moment: finalMoment || selectedMoment
    };

    setIsCalculating(true);
    dispatch(updatePreferences({ ...finalAnswers, calculate: true }));

    // Visual feedback transition
    setTimeout(() => {
      dispatch(setStep('result'));
      setIsCalculating(false);
    }, 450);
  };

  const handlePlanDestination = (city) => {
    const targetCity = city.city || city;
    const name = targetCity.name || city.name || 'Shimla';
    const id = targetCity.id || city.id || 'shimla';
    const days = targetCity.daysMin || city.daysMin || 3;
    const budget = targetCity.sampleBudgetMin || city.sampleBudgetMin || 12000;

    dispatch(
      setPendingPlan({
        city: name,
        cityId: id,
        days,
        budget,
        source: 'trip-match'
      })
    );
    navigate(`/itinerary?city=${encodeURIComponent(name)}`);
  };

  const currentAnswers = {
    scenery: selectedScenery,
    vibe: selectedVibe,
    travelers: selectedTravelers,
    moment: selectedMoment,
    filterRegion,
    filterBudget
  };

  // Calculate base matches
  const baseMatches = (storedResults && storedResults.length > 0)
    ? storedResults
    : calculateMatchScores(currentAnswers, 'all');

  // Apply UI filters
  const matches = baseMatches.filter((item) => {
    const country = item.country || item.city?.country || '';
    const budget = item.sampleBudgetMin || item.city?.sampleBudgetMin || 0;

    if (filterRegion === 'india' && country !== 'India') return false;
    if (filterRegion === 'international' && country === 'India') return false;

    if (filterBudget === 'budget' && budget > 10000) return false;
    if (filterBudget === 'comfort' && (budget <= 10000 || budget > 25000)) return false;
    if (filterBudget === 'premium' && budget <= 25000) return false;

    return true;
  });

  return (
    <main id="main-content" className="trip-quiz-page">
      <div className="container quiz-container">
        {/* LOADING SPINNER STATE */}
        {isCalculating && (
          <div className="quiz-loading-card animate-fade-in" aria-live="polite">
            <Loader2 className="quiz-loading-spinner" size={36} />
            <h3 className="quiz-loading-title">Calculating logistics & feasibility match...</h3>
            <p className="quiz-loading-desc">Comparing route transit, realistic daily budgets, and seasonal conditions.</p>
          </div>
        )}

        {/* STEP 1: SCENERY */}
        {!isCalculating && currentStep === 'scenery' && (
          <section className="quiz-card animate-fade-in" aria-label="Question 1">
            <div className="quiz-question-box">
              <span className="quiz-badge">Question 1 of 4</span>
              <h2 className="quiz-heading">What scenery calls your name?</h2>
              <p className="quiz-desc">Pick the backdrop you want to wake up to.</p>
            </div>

            <div className="quiz-options-grid">
              {SCENERY_OPTIONS.map((opt) => {
                const isSelected = selectedScenery === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`quiz-option-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedScenery(opt.id)}
                  >
                    <span className="option-icon" aria-hidden="true">{opt.icon}</span>
                    <strong className="option-title">{opt.title}</strong>
                    <p className="option-desc">{opt.desc}</p>
                    <span className="option-check">{isSelected && <Check size={14} />}</span>
                  </button>
                );
              })}
            </div>

            <div className="quiz-footer">
              <span />
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight size={16} />}
                onClick={() => handleNext('vibe', { scenery: selectedScenery })}
              >
                Next: Travel Mood
              </Button>
            </div>
          </section>
        )}

        {/* STEP 2: VIBE / MOOD */}
        {!isCalculating && currentStep === 'vibe' && (
          <section className="quiz-card animate-fade-in" aria-label="Question 2">
            <div className="quiz-question-box">
              <span className="quiz-badge">Question 2 of 4</span>
              <h2 className="quiz-heading">What's your travel mood?</h2>
              <p className="quiz-desc">How do you want your days to feel?</p>
            </div>

            <div className="quiz-options-grid">
              {VIBE_OPTIONS.map((opt) => {
                const isSelected = selectedVibe === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`quiz-option-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedVibe(opt.id)}
                  >
                    <span className="option-icon" aria-hidden="true">{opt.icon}</span>
                    <strong className="option-title">{opt.title}</strong>
                    <p className="option-desc">{opt.desc}</p>
                    <span className="option-check">{isSelected && <Check size={14} />}</span>
                  </button>
                );
              })}
            </div>

            <div className="quiz-footer">
              <Button
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft size={16} />}
                onClick={() => dispatch(setStep('scenery'))}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight size={16} />}
                onClick={() => handleNext('travelers', { vibe: selectedVibe })}
              >
                Next: Companions
              </Button>
            </div>
          </section>
        )}

        {/* STEP 3: COMPANIONS */}
        {!isCalculating && currentStep === 'travelers' && (
          <section className="quiz-card animate-fade-in" aria-label="Question 3">
            <div className="quiz-question-box">
              <span className="quiz-badge">Question 3 of 4</span>
              <h2 className="quiz-heading">Who's packing bags with you?</h2>
              <p className="quiz-desc">Travel feels best when matched with your crew.</p>
            </div>

            <div className="quiz-options-grid">
              {COMPANION_OPTIONS.map((opt) => {
                const isSelected = selectedTravelers === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`quiz-option-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedTravelers(opt.id)}
                  >
                    <span className="option-icon" aria-hidden="true">{opt.icon}</span>
                    <strong className="option-title">{opt.title}</strong>
                    <p className="option-desc">{opt.desc}</p>
                    <span className="option-check">{isSelected && <Check size={14} />}</span>
                  </button>
                );
              })}
            </div>

            <div className="quiz-footer">
              <Button
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft size={16} />}
                onClick={() => dispatch(setStep('vibe'))}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight size={16} />}
                onClick={() => handleNext('moment', { travelers: selectedTravelers })}
              >
                Next: Signature Moment
              </Button>
            </div>
          </section>
        )}

        {/* STEP 4: SIGNATURE MOMENT */}
        {!isCalculating && currentStep === 'moment' && (
          <section className="quiz-card animate-fade-in" aria-label="Question 4">
            <div className="quiz-question-box">
              <span className="quiz-badge">Question 4 of 4</span>
              <h2 className="quiz-heading">Pick your signature travel moment</h2>
              <p className="quiz-desc">The single memory that makes the trip unforgettable.</p>
            </div>

            <div className="quiz-options-grid">
              {MOMENT_OPTIONS.map((opt) => {
                const isSelected = selectedMoment === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`quiz-option-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedMoment(opt.id)}
                  >
                    <span className="option-icon" aria-hidden="true">{opt.icon}</span>
                    <strong className="option-title">{opt.title}</strong>
                    <p className="option-desc">{opt.desc}</p>
                    <span className="option-check">{isSelected && <Check size={14} />}</span>
                  </button>
                );
              })}
            </div>

            <div className="quiz-footer">
              <Button
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft size={16} />}
                onClick={() => dispatch(setStep('travelers'))}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<Sparkles size={18} />}
                onClick={() => handleFinish(selectedMoment)}
              >
                Find My Spot
              </Button>
            </div>
          </section>
        )}

        {/* RESULTS: DESTINATIONS WITH FEEDBACK & ERROR HANDLING */}
        {!isCalculating && currentStep === 'result' && (
          <section className="results-wrapper animate-fade-in" aria-label="Matched Destinations">
            <div className="results-intro">
              <div>
                <span className="quiz-badge">Personalized Logistics Matches</span>
                <h2 className="results-main-title">Here is where you belong.</h2>
                <p className="results-sub">Hand-picked from verified timings, real budgets, and your landscape instinct.</p>
              </div>

              <div className="results-top-actions">
                {matches.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Layers size={14} />}
                    onClick={() => setIsCompareOpen(true)}
                  >
                    Compare Top {Math.min(3, matches.length)}
                  </Button>
                )}
                <button
                  type="button"
                  className="quiz-reset-btn"
                  onClick={() => dispatch(restartChat())}
                >
                  <RotateCcw size={14} />
                  <span>Start over</span>
                </button>
              </div>
            </div>

            {/* Quick Interactive Filters Bar */}
            <div className="match-filter-bar">
              <div className="match-filter-group">
                <span className="filter-label"><SlidersHorizontal size={12} /> Region:</span>
                <div className="filter-chips">
                  {[
                    { id: 'all', label: 'All Regions' },
                    { id: 'india', label: 'Domestic (India)' },
                    { id: 'international', label: 'International' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`filter-chip ${filterRegion === r.id ? 'is-active' : ''}`}
                      onClick={() => setFilterRegion(r.id)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="match-filter-group">
                <span className="filter-label">Budget:</span>
                <div className="filter-chips">
                  {[
                    { id: 'all', label: 'All Budgets' },
                    { id: 'budget', label: 'Under ₹10k' },
                    { id: 'comfort', label: '₹10k–₹25k' },
                    { id: 'premium', label: '₹25k+' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`filter-chip ${filterBudget === b.id ? 'is-active' : ''}`}
                      onClick={() => setFilterBudget(b.id)}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* EMPTY STATE: NO MATCHES FOUND */}
            {matches.length === 0 ? (
              <div className="match-empty-state animate-fade-in">
                <div className="empty-icon-wrap">
                  <AlertCircle size={32} />
                </div>
                <h3 className="empty-title">No destinations match this filter combination</h3>
                <p className="empty-desc">
                  Try switching back to "All Regions" or expanding your budget range to view your recommendations.
                </p>
                <div className="empty-actions">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setFilterRegion('all');
                      setFilterBudget('all');
                    }}
                  >
                    Reset Filters
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => dispatch(restartChat())}
                  >
                    Retake Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <div className="results-showcase-grid">
                {matches.map((item, idx) => {
                  const cityObj = item.city || item;
                  const cityName = item.name || cityObj.name;
                  const photoSrc = item.photo || cityObj.photo;
                  const countryName = item.country || cityObj.country;
                  const stateName = item.state || cityObj.state;
                  const fitScore = item.matchPercentage || 85;
                  const fitReason = item.whyThisFits || item.whyFit || 'High compatibility across routes and budget.';
                  const watchOutNote = item.watchOut || cityObj.watchOut || 'Check peak holiday timings.';

                  return (
                    <article key={cityObj.id || idx} className="match-photo-card">
                      <div className="match-photo-wrap">
                        <img
                          src={photoSrc}
                          alt={cityName}
                          className="match-photo"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to a solid pleasant background if image fails
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="match-gradient" />

                        <div className="match-top-chips">
                          <span className="match-rank-badge">#{idx + 1} Best Fit</span>
                          <span className="match-score-badge">{fitScore}% Match</span>
                        </div>

                        <div className="match-bottom-info">
                          <div className="match-location-tag">
                            <MapPin size={13} />
                            <span>{stateName ? `${stateName}, ` : ''}{countryName}</span>
                          </div>
                          <h3 className="match-city-name">{cityName}</h3>
                          <p className="match-tagline">{fitReason}</p>
                        </div>
                      </div>

                      <div className="match-card-body">
                        <div className="match-meta-specs">
                          <span className="match-spec-item">
                            <strong>{item.typicalDays || `${cityObj.daysMin || 3} days`}</strong>
                          </span>
                          <span className="match-spec-dot">•</span>
                          <span className="match-spec-item">
                            ~₹{new Intl.NumberFormat('en-IN').format(cityObj.dailyCostEst || 3000)}/day
                          </span>
                        </div>

                        <div className="match-watch-out">
                          <small>💡 <strong>Feasibility note:</strong> {watchOutNote}</small>
                        </div>

                        <Button
                          variant={idx === 0 ? 'primary' : 'outline'}
                          size="md"
                          rightIcon={<ArrowRight size={15} />}
                          className="match-cta-btn"
                          onClick={() => handlePlanDestination(cityObj)}
                        >
                          Plan {cityName} Itinerary
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

      </div>

      {/* Compare Modal */}
      {isCompareOpen && (
        <CompareModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          results={matches.slice(0, 3)}
          preferences={preferences}
        />
      )}
    </main>
  );
}
