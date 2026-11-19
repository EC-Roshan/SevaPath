import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import {
  HeartHandshake,
  User,
  Building2,
  X,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  MapPin,
  Sparkles,
  Phone,
  Check,
  Plus,
} from 'lucide-react';

const COMMON_INTERESTS = [
  'Food Relief',
  'Education',
  'Environment',
  'Healthcare',
  'Animal Welfare',
  'Disaster Relief',
  'Youth Development',
  'Community Care',
];

const COMMON_SKILLS = [
  'Packaging',
  'Cooking',
  'Hygiene & Sanitation',
  'Logistics',
  'Driving',
  'Teaching',
  'Basic Math',
  'First Aid',
  'Coding',
  'Communication',
];

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

const LUCKNOW_NEIGHBOURHOODS = [
  { name: 'Hazratganj', lat: 26.8467, lng: 80.9462 },
  { name: 'Gomti Nagar', lat: 26.8530, lng: 80.9980 },
  { name: 'Alambagh', lat: 26.8140, lng: 80.8980 },
  { name: 'Indira Nagar', lat: 26.8830, lng: 80.9850 },
  { name: 'Mahanagar', lat: 26.8720, lng: 80.9520 },
  { name: 'Chowk', lat: 26.8680, lng: 80.9080 },
  { name: 'Vikas Nagar', lat: 26.8920, lng: 80.9620 },
];

export default function AuthModal({ initialMode = 'login', onClose }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' by default
  const [role, setRole] = useState('volunteer'); // volunteer | organisation
  const [signupStep, setSignupStep] = useState(1); // 1: Basic & Role, 2: Skills & Availability, 3: Location

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(22);
  const [contact, setContact] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [willingnessToLearn, setWillingnessToLearn] = useState(true);
  const [interests, setInterests] = useState(['Food Relief', 'Community Care']);
  const [skills, setSkills] = useState(['Packaging', 'Communication']);
  const [customSkill, setCustomSkill] = useState('');
  const [availabilityDays, setAvailabilityDays] = useState(['Saturday', 'Sunday']);
  const [availabilityHours, setAvailabilityHours] = useState(['Morning']);
  const [neighbourhoodName, setNeighbourhoodName] = useState('Hazratganj');
  const [locationLat, setLocationLat] = useState(26.8467);
  const [locationLng, setLocationLng] = useState(80.9462);
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);

  // Org Specific
  const [orgCity, setOrgCity] = useState('Lucknow');
  const [orgDescription, setOrgDescription] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Toggle helpers
  const toggleInterest = (item) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills((prev) => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const toggleDay = (day) => {
    setAvailabilityDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleHour = (hour) => {
    setAvailabilityHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  const handleNeighbourhoodPreset = (nh) => {
    setNeighbourhoodName(nh.name);
    setLocationLat(nh.lat);
    setLocationLng(nh.lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && role === 'volunteer' && signupStep < 3) {
      setSignupStep((s) => s + 1);
      return;
    }

    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup({
          email,
          password,
          role,
          name: role === 'volunteer' ? name : undefined,
          org_name: role === 'organisation' ? name : undefined,
          age: role === 'volunteer' ? Number(age) : undefined,
          contact: contact || email,
          interests: role === 'volunteer' ? interests : undefined,
          skills: role === 'volunteer' ? skills : undefined,
          experience_level: role === 'volunteer' ? experienceLevel : undefined,
          availability:
            role === 'volunteer'
              ? { days: availabilityDays, hours: availabilityHours }
              : undefined,
          location_lat: role === 'volunteer' ? locationLat : undefined,
          location_lng: role === 'volunteer' ? locationLng : undefined,
          neighbourhood_name: role === 'volunteer' ? neighbourhoodName : undefined,
          max_distance_km: role === 'volunteer' ? Number(maxDistanceKm) : undefined,
          willingness_to_learn: role === 'volunteer' ? willingnessToLearn : undefined,
          location_city: role === 'organisation' ? orgCity : undefined,
          description: role === 'organisation' ? orgDescription : undefined,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in">
      <div className="min-h-full flex items-start sm:items-center justify-center py-6 sm:py-10">
        <div
          className={`bg-white rounded-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative transition-all ${
            mode === 'signup' && role === 'volunteer' ? 'max-w-2xl' : 'max-w-md'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Brand */}
          <div className="text-center mb-5">
            <div className="w-11 h-11 rounded-2xl bg-[#0F2744] mx-auto flex items-center justify-center text-white shadow-md mb-2.5">
              <HeartHandshake className="w-6 h-6 text-[#0F9D8A]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F2744]">
              {mode === 'login' ? 'Sign In to SevaPath' : 'Create an Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login'
                ? 'Enter your credentials to access your dashboard'
                : 'Fill your profile details to immediately start matching with local missions'}
            </p>
          </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ======================================================== */}
          {/* 1. SIGN IN VIEW (FIRST BY DEFAULT) */}
          {/* ======================================================== */}
          {mode === 'login' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#0F9D8A] hover:bg-[#0C8575] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. SIGN UP / CREATE ACCOUNT VIEW (ALL PROFILE DATA UPFRONT) */}
          {/* ======================================================== */}
          {mode === 'signup' && (
            <div className="space-y-5">
              {/* Step indicator for Volunteer */}
              {role === 'volunteer' && (
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
                  <span className="font-bold text-[#0F2744]">
                    Step {signupStep} of 3:{' '}
                    {signupStep === 1
                      ? 'Account & Experience'
                      : signupStep === 2
                      ? 'Causes & Availability'
                      : 'Location & Radius'}
                  </span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((st) => (
                      <span
                        key={st}
                        className={`w-2.5 h-2.5 rounded-full ${
                          signupStep === st
                            ? 'bg-[#0F9D8A]'
                            : signupStep > st
                            ? 'bg-[#0F2744]'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Role Selector */}
              {signupStep === 1 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">I am registering as: *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('volunteer')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        role === 'volunteer'
                          ? 'bg-teal-50 border-[#0F9D8A] text-[#0F9D8A] ring-2 ring-teal-200 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <User className="w-4 h-4 shrink-0" />
                      <div>
                        <div className="text-xs font-bold">Volunteer</div>
                        <div className="text-[10px] text-slate-400 font-normal">Join drives & missions</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('organisation')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        role === 'organisation'
                          ? 'bg-slate-100 border-[#0F2744] text-[#0F2744] ring-2 ring-slate-300 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Building2 className="w-4 h-4 shrink-0" />
                      <div>
                        <div className="text-xs font-bold">Organisation</div>
                        <div className="text-[10px] text-slate-400 font-normal">Host & mobilize volunteers</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------- VOLUNTEER ONBOARDING ----------------- */}
              {role === 'volunteer' && (
                <>
                  {/* STEP 1: Basic Info & Experience */}
                  {signupStep === 1 && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Aarav Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Age *</label>
                          <input
                            type="number"
                            min="14"
                            max="99"
                            required
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone *</label>
                          <input
                            type="text"
                            required
                            placeholder="+91-9876543210"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                        />
                      </div>

                      {/* Experience Level */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Prior Volunteering Experience *</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'beginner', label: 'Beginner', desc: 'First time volunteer' },
                            { id: 'some', label: 'Some', desc: 'Participated before' },
                            { id: 'experienced', label: 'Experienced', desc: 'Team lead / specialized' },
                          ].map((lvl) => (
                            <button
                              type="button"
                              key={lvl.id}
                              onClick={() => setExperienceLevel(lvl.id)}
                              className={`p-2.5 rounded-xl border text-left transition-all ${
                                experienceLevel === lvl.id
                                  ? 'bg-teal-50 border-[#0F9D8A] text-[#0F9D8A] ring-1 ring-teal-200 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <div className="text-xs font-bold">{lvl.label}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{lvl.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Willingness to learn */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-800">Willing to learn new skills?</div>
                          <div className="text-[11px] text-slate-500">Unlocks full experience points on beginner-friendly roles</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={willingnessToLearn}
                            onChange={(e) => setWillingnessToLearn(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F9D8A]"></div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Causes, Skills & Availability */}
                  {signupStep === 2 && (
                    <div className="space-y-4 animate-in fade-in">
                      {/* Causes */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Causes You Care About</label>
                        <div className="flex flex-wrap gap-1.5">
                          {COMMON_INTERESTS.map((item) => {
                            const active = interests.includes(item);
                            return (
                              <button
                                type="button"
                                key={item}
                                onClick={() => toggleInterest(item)}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                                  active
                                    ? 'bg-teal-50 border-[#0F9D8A] text-[#0F9D8A] font-bold'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                {item} {active && '✓'}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Skills & Strengths</label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {COMMON_SKILLS.map((skill) => {
                            const active = skills.includes(skill);
                            return (
                              <button
                                type="button"
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                                  active
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                {skill} {active && '✓'}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add other skill..."
                            value={customSkill}
                            onChange={(e) => setCustomSkill(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addCustomSkill();
                              }
                            }}
                            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 flex-1 focus:outline-none focus:border-[#0F9D8A]"
                          />
                          <button
                            type="button"
                            onClick={addCustomSkill}
                            className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                        <label className="block text-xs font-bold text-slate-700">Available Days & Time</label>
                        <div className="flex flex-wrap gap-1.5">
                          {WEEKDAYS.map((day) => {
                            const active = availabilityDays.includes(day);
                            return (
                              <button
                                type="button"
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                                  active
                                    ? 'bg-[#0F2744] text-white border-[#0F2744] font-semibold'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {TIME_SLOTS.map((hour) => {
                            const active = availabilityHours.includes(hour);
                            return (
                              <button
                                type="button"
                                key={hour}
                                onClick={() => toggleHour(hour)}
                                className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                                  active
                                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {hour}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Location & Travel Distance */}
                  {signupStep === 3 && (
                    <div className="space-y-4 animate-in fade-in">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#0F9D8A]" /> Lucknow Neighbourhood Area
                          </label>
                          <span className="text-[11px] text-slate-400">Quick Select:</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2.5">
                          {LUCKNOW_NEIGHBOURHOODS.map((nh) => (
                            <button
                              type="button"
                              key={nh.name}
                              onClick={() => handleNeighbourhoodPreset(nh)}
                              className={`text-[11px] px-2.5 py-1 rounded-md border ${
                                neighbourhoodName === nh.name
                                  ? 'bg-[#0F9D8A] text-white border-[#0F9D8A] font-bold'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {nh.name}
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-500">Area Name</span>
                            <input
                              type="text"
                              value={neighbourhoodName}
                              onChange={(e) => setNeighbourhoodName(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500">Latitude</span>
                            <input
                              type="number"
                              step="0.0001"
                              value={locationLat}
                              onChange={(e) => setLocationLat(parseFloat(e.target.value) || 0)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500">Longitude</span>
                            <input
                              type="number"
                              step="0.0001"
                              value={locationLng}
                              onChange={(e) => setLocationLng(parseFloat(e.target.value) || 0)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Travel Radius Slider */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                          <span>Max Travel Distance:</span>
                          <span className="text-[#0F9D8A] font-black">{maxDistanceKm} km</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="35"
                          step="1"
                          value={maxDistanceKm}
                          onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                          className="w-full accent-[#0F9D8A] cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>2 km</span>
                          <span>15 km</span>
                          <span>35 km</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    {signupStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setSignupStep((s) => s - 1)}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Back
                      </button>
                    ) : <div />}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl bg-[#0F9D8A] hover:bg-[#0C8575] text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {signupStep < 3 ? (
                        <>
                          Next Step <ArrowRight className="w-4 h-4" />
                        </>
                      ) : submitting ? (
                        'Creating Account...'
                      ) : (
                        'Create Account & Start Matching'
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* ----------------- ORGANISATION ONBOARDING ----------------- */}
              {role === 'organisation' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Organisation Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Seva Relief Foundation"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="contact@org.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Contact *</label>
                      <input
                        type="text"
                        required
                        placeholder="+91-9876543210"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City / Region *</label>
                    <input
                      type="text"
                      required
                      value={orgCity}
                      onChange={(e) => setOrgCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Short Mission & Description</label>
                    <textarea
                      rows="2"
                      placeholder="Describe your social cause and volunteer focus..."
                      value={orgDescription}
                      onChange={(e) => setOrgDescription(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F9D8A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#0F2744] hover:bg-[#0A1B30] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Registering...' : 'Register Organisation & Launch Missions'}
                  </button>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Toggle Mode Footer */}
        <div className="text-center mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setSignupStep(1);
                  setError('');
                }}
                className="font-bold text-[#0F9D8A] hover:underline"
              >
                Create an Account
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="font-bold text-[#0F9D8A] hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
