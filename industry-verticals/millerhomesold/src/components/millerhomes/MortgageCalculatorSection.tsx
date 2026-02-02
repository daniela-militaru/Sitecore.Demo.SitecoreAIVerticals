'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import {
  TextField,
  RichTextField,
  RichText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * MortgageCalculatorSection Component
 * "How much will it cost?" mortgage calculator
 * 
 * Features:
 * - Calculator type tabs
 * - Property price input
 * - Deposit input
 * - Term slider
 * - Interest rate input
 * - Monthly payment display
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Section description */
  Description: RichTextField;
  /** Disclaimer text */
  Disclaimer: RichTextField;
}

export type MortgageCalculatorSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: MortgageCalculatorSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  const [calculatorType, setCalculatorType] = useState<'mortgage' | 'sdlt' | 'affordability'>('mortgage');
  const [propertyPrice, setPropertyPrice] = useState('250000');
  const [deposit, setDeposit] = useState('25000');
  const [term, setTerm] = useState(25);
  const [interestRate, setInterestRate] = useState('4.5');

  // Simple mortgage calculation
  const loanAmount = Number(propertyPrice) - Number(deposit);
  const monthlyRate = Number(interestRate) / 100 / 12;
  const numberOfPayments = term * 12;
  const monthlyPayment = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    : loanAmount / numberOfPayments;

  return (
    <div
      className={`component mortgage-calculator-section bg-white py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-light text-center mb-4">
          <span className="text-[#003057]">How much </span>
          <span className="text-[#0072CE]">will it cost?</span>
        </h2>

        {/* Description */}
        {fields.Description && (
          <div className="text-center text-[#4a4a4a] max-w-2xl mx-auto mb-8">
            <RichText field={fields.Description} />
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Calculator Type Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setCalculatorType('mortgage')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                calculatorType === 'mortgage'
                  ? 'bg-[#003057] text-white'
                  : 'bg-gray-100 text-[#003057] hover:bg-gray-200'
              }`}
            >
              Mortgage Calculator
            </button>
            <button
              onClick={() => setCalculatorType('sdlt')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                calculatorType === 'sdlt'
                  ? 'bg-[#003057] text-white'
                  : 'bg-gray-100 text-[#003057] hover:bg-gray-200'
              }`}
            >
              Stamp Duty Calculator
            </button>
            <button
              onClick={() => setCalculatorType('affordability')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                calculatorType === 'affordability'
                  ? 'bg-[#003057] text-white'
                  : 'bg-gray-100 text-[#003057] hover:bg-gray-200'
              }`}
            >
              Price a Mortgage
            </button>
          </div>

          {/* Calculator Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              {/* Property Price */}
              <div>
                <label className="block text-sm font-medium text-[#003057] mb-2">
                  Property Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]">£</span>
                  <input
                    type="text"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0072CE] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Deposit */}
              <div>
                <label className="block text-sm font-medium text-[#003057] mb-2">
                  Deposit
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]">£</span>
                  <input
                    type="text"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0072CE] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Term */}
              <div>
                <label className="block text-sm font-medium text-[#003057] mb-2">
                  Term: <span className="font-bold">{term} years</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0072CE]"
                />
                <div className="flex justify-between text-xs text-[#4a4a4a] mt-1">
                  <span>5 years</span>
                  <span>40 years</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-[#003057] mb-2">
                  Interest Rate
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0072CE] focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]">%</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center">
              <p className="text-sm text-[#4a4a4a] mb-2">Your monthly mortgage payment</p>
              <p className="text-5xl md:text-6xl font-light text-[#0072CE] mb-4">
                £{Math.round(monthlyPayment).toLocaleString()}
              </p>
              <p className="text-sm text-[#4a4a4a]">
                Based on a mortgage of{' '}
                <span className="font-semibold">£{loanAmount.toLocaleString()}</span>
              </p>
              <p className="text-3xl font-light text-[#0072CE] mt-4">
                £{Math.round(monthlyPayment / 4).toLocaleString()}
                <span className="text-sm text-[#4a4a4a] ml-2">per week</span>
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          {fields.Disclaimer && (
            <div className="mt-8 text-xs text-[#4a4a4a] text-center">
              <RichText field={fields.Disclaimer} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
