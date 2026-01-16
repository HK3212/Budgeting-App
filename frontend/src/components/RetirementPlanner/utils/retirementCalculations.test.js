import {
  calculateFutureValue,
  calculateWithdrawalBalance,
  generateProjection,
  calculateCompoundBreakdown,
  calculateScenarios,
  calculateMilestones,
  formatCurrency,
} from "./retirementCalculations"

describe("retirementCalculations", () => {
  describe("calculateFutureValue", () => {
    it("returns principal when years is 0", () => {
      expect(calculateFutureValue(10000, 500, 0.07, 0)).toBe(10000)
    })

    it("calculates correctly with 0% interest rate", () => {
      const result = calculateFutureValue(10000, 100, 0, 5)
      expect(result).toBe(10000 + 100 * 12 * 5)
    })

    it("calculates compound growth correctly", () => {
      const result = calculateFutureValue(10000, 0, 0.1, 1)
      expect(result).toBeCloseTo(11047.13, 0)
    })

    it("includes monthly contributions", () => {
      const result = calculateFutureValue(0, 1000, 0.07, 10)
      expect(result).toBeGreaterThan(120000)
    })
  })

  describe("calculateWithdrawalBalance", () => {
    it("returns starting balance when years is 0", () => {
      expect(calculateWithdrawalBalance(500000, 3000, 0.05, 0)).toBe(500000)
    })

    it("returns 0 when balance depletes", () => {
      const result = calculateWithdrawalBalance(50000, 5000, 0.03, 30)
      expect(result).toBe(0)
    })

    it("maintains balance with sustainable withdrawal", () => {
      const result = calculateWithdrawalBalance(1000000, 2000, 0.05, 10)
      expect(result).toBeGreaterThan(0)
    })
  })

  describe("generateProjection", () => {
    const defaultInputs = {
      currentAge: 30,
      retirementAge: 65,
      lifeExpectancy: 90,
      currentSavings: 50000,
      monthlyContribution: 1000,
      annualReturnRate: 0.07,
      monthlyRetirementSpending: 4000,
    }

    it("generates projection from current age to life expectancy", () => {
      const projection = generateProjection(defaultInputs)
      expect(projection.length).toBe(90 - 30 + 1)
    })

    it("starts with accumulation phase", () => {
      const projection = generateProjection(defaultInputs)
      expect(projection[0].phase).toBe("accumulation")
    })

    it("switches to retirement phase at retirement age", () => {
      const projection = generateProjection(defaultInputs)
      const retirementPoint = projection.find((p) => p.age === 65)
      expect(retirementPoint.phase).toBe("retirement")
    })

    it("balance grows during accumulation", () => {
      const projection = generateProjection(defaultInputs)
      const accumulation = projection.filter((p) => p.phase === "accumulation")
      for (let i = 1; i < accumulation.length; i++) {
        expect(accumulation[i].balance).toBeGreaterThan(
          accumulation[i - 1].balance
        )
      }
    })
  })

  describe("calculateCompoundBreakdown", () => {
    const inputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 10000,
      monthlyContribution: 500,
      annualReturnRate: 0.07,
    }

    it("returns total contributions, interest, and final balance", () => {
      const result = calculateCompoundBreakdown(inputs)
      expect(result).toHaveProperty("totalContributions")
      expect(result).toHaveProperty("totalInterest")
      expect(result).toHaveProperty("finalBalance")
    })

    it("final balance equals contributions plus interest", () => {
      const result = calculateCompoundBreakdown(inputs)
      expect(result.finalBalance).toBe(
        result.totalContributions + result.totalInterest
      )
    })

    it("generates yearly breakdown", () => {
      const result = calculateCompoundBreakdown(inputs)
      expect(result.yearlyBreakdown.length).toBe(35 + 1)
    })
  })

  describe("calculateScenarios", () => {
    const inputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 50000,
      monthlyContribution: 1000,
    }

    it("returns three scenarios", () => {
      const scenarios = calculateScenarios(inputs)
      expect(scenarios.length).toBe(3)
    })

    it("aggressive scenario yields highest balance", () => {
      const scenarios = calculateScenarios(inputs)
      const conservative = scenarios.find((s) => s.name === "Conservative")
      const aggressive = scenarios.find((s) => s.name === "Aggressive")
      expect(aggressive.finalBalance).toBeGreaterThan(conservative.finalBalance)
    })
  })

  describe("calculateMilestones", () => {
    const inputs = {
      currentAge: 30,
      retirementAge: 65,
      lifeExpectancy: 90,
      currentSavings: 50000,
      monthlyContribution: 1000,
      annualReturnRate: 0.07,
      monthlyRetirementSpending: 4000,
    }

    it("returns milestone array", () => {
      const projection = generateProjection(inputs)
      const milestones = calculateMilestones(inputs, projection)
      expect(Array.isArray(milestones)).toBe(true)
      expect(milestones.length).toBeGreaterThan(0)
    })

    it("includes Target Retirement milestone", () => {
      const projection = generateProjection(inputs)
      const milestones = calculateMilestones(inputs, projection)
      const retirement = milestones.find((m) => m.name === "Target Retirement")
      expect(retirement).toBeDefined()
      expect(retirement.achieved).toBe(true)
    })
  })

  describe("formatCurrency", () => {
    it("formats millions", () => {
      expect(formatCurrency(1500000)).toBe("$1.5M")
    })

    it("formats thousands", () => {
      expect(formatCurrency(250000)).toBe("$250K")
    })

    it("formats small values", () => {
      expect(formatCurrency(500)).toBe("$500")
    })
  })
})
