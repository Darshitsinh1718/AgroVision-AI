// backend/src/services/schemesService.js
// ─────────────────────────────────────────────────────────
// Government scheme service with smart recommendation engine.
//
// Features:
//   • Full scheme database (15+ central + state schemes)
//   • Category and state filtering
//   • Smart eligibility matching based on farmer profile
//   • Relevance scoring algorithm
//   • Search across name, description, tags
// ─────────────────────────────────────────────────────────

import { GOVERNMENT_SCHEMES, SCHEME_CATEGORIES, FARMER_PROFILES } from '../utils/schemesMockData.js'

// ── Filter schemes ────────────────────────────────────────
export function filterSchemes({ category, state, search, farmSize, crops }) {
  let schemes = [...GOVERNMENT_SCHEMES]

  // Category filter
  if (category && category !== 'all') {
    schemes = schemes.filter(s => s.category === category)
  }

  // State filter — include 'all' national + state-specific
  if (state && state !== 'All India' && state !== 'all') {
    schemes = schemes.filter(s =>
      s.states === 'all' ||
      (Array.isArray(s.states) && s.states.includes(state))
    )
  }

  // Search filter
  if (search?.trim()) {
    const q = search.toLowerCase()
    schemes = schemes.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.shortName.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q)) ||
      s.benefitType.toLowerCase().includes(q)
    )
  }

  return schemes
}

// ── Smart recommendation engine ───────────────────────────
// Scores each scheme based on farmer profile and ranks them.
export function getPersonalizedRecommendations(profile) {
  const {
    state,
    farmSizeHa     = 2,
    isSmallMarginal = farmSizeHa <= 2,
    isSC_ST        = false,
    isWoman        = false,
    crops          = [],
    hasBankAccount = true,
    hasAadhaar     = true,
    age            = 35,
    annualIncomeK  = 150,  // in thousands
  } = profile

  const scored = GOVERNMENT_SCHEMES.map(scheme => {
    let score   = 50  // base score
    const reasons = []
    const flags   = []

    // State match
    if (scheme.states === 'all') {
      score += 20
      reasons.push('Available across India')
    } else if (Array.isArray(scheme.states) && state && scheme.states.includes(state)) {
      score += 30
      reasons.push(`Available in your state (${state})`)
    } else if (Array.isArray(scheme.states)) {
      score -= 40  // State-specific but wrong state
      flags.push(`Only in: ${scheme.states.join(', ')}`)
    }

    // Farm size eligibility
    if (scheme.farmSizeApplicable === 'small_marginal') {
      if (isSmallMarginal) {
        score += 25
        reasons.push('Specifically designed for small/marginal farmers')
      } else {
        score -= 20
        flags.push('Designed for small/marginal farmers (≤2 ha)')
      }
    } else {
      reasons.push('Open to all farm sizes')
    }

    // Category-based priority
    const categoryBoosts = {
      income_support: 15,
      insurance:      12,
      credit:         10,
      irrigation:      8,
      subsidy:         8,
    }
    if (categoryBoosts[scheme.category]) {
      score += categoryBoosts[scheme.category]
      reasons.push(`${SCHEME_CATEGORIES.find(c => c.id === scheme.category)?.label} benefit`)
    }

    // SC/ST bonus
    if (isSC_ST && (scheme.tags.includes('sc/st') || scheme.subsidyPercent?.sc_st_women_rural)) {
      score += 15
      reasons.push('Additional benefits for SC/ST farmers')
    }

    // Women farmer bonus
    if (isWoman && (scheme.subsidyPercent?.sc_st_women_rural || scheme.tags.includes('women'))) {
      score += 15
      reasons.push('Additional benefits for women farmers')
    }

    // Age eligibility (pension)
    if (scheme.category === 'pension') {
      if (age >= 18 && age <= 40) {
        score += 20
        reasons.push(`Good time to enrol (age ${age} — ideal 18–40)`)
      } else if (age > 40) {
        score -= 30
        flags.push('Enrolment only up to age 40')
      }
    }

    // Crop relevance
    if (crops.length > 0 && scheme.tags) {
      const cropMatch = crops.some(crop =>
        scheme.tags.some(tag => tag.toLowerCase().includes(crop.toLowerCase()))
      )
      if (cropMatch) {
        score += 10
        reasons.push('Relevant to your crops')
      }
    }

    // Basic eligibility checks
    if (!hasBankAccount) {
      score -= 30
      flags.push('Bank account required — open one at nearest bank')
    }
    if (!hasAadhaar) {
      score -= 30
      flags.push('Aadhaar card required — enrol at Aadhaar centre')
    }

    // High impact schemes get boosted
    if (['pm-kisan', 'pmfby', 'kcc'].includes(scheme.id)) {
      score += 10
      reasons.push('High-impact flagship scheme')
    }

    // Clamp score 0–100
    score = Math.max(0, Math.min(100, score))

    // Eligibility verdict
    const isEligible = score >= 50 && flags.filter(f =>
      f.includes('Only in:') && !f.includes(state || '')
    ).length === 0

    return {
      ...scheme,
      relevanceScore:   score,
      matchReasons:     reasons.slice(0, 4),
      flags:            flags,
      isEligible,
      priority:         score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low',
    }
  })
  .filter(s => s.relevanceScore >= 30)
  .sort((a, b) => b.relevanceScore - a.relevanceScore)

  return {
    profile,
    schemes:        scored,
    topPicks:       scored.slice(0, 5),
    totalEligible:  scored.filter(s => s.isEligible).length,
    generatedAt:    new Date().toISOString(),
  }
}

// ── Get scheme by ID ──────────────────────────────────────
export function getSchemeById(id) {
  return GOVERNMENT_SCHEMES.find(s => s.id === id) || null
}

// ── Get scheme stats ──────────────────────────────────────
export function getSchemeStats() {
  return {
    total:          GOVERNMENT_SCHEMES.length,
    byCategory:     Object.fromEntries(
      SCHEME_CATEGORIES.slice(1).map(c => [
        c.id,
        GOVERNMENT_SCHEMES.filter(s => s.category === c.id).length
      ])
    ),
    central:        GOVERNMENT_SCHEMES.filter(s => s.level === 'central').length,
    state:          GOVERNMENT_SCHEMES.filter(s => s.level === 'state').length,
    categories:     SCHEME_CATEGORIES,
    farmerProfiles: FARMER_PROFILES,
  }
}

export { SCHEME_CATEGORIES, FARMER_PROFILES, GOVERNMENT_SCHEMES }