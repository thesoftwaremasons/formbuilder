"use client"

import Link from 'next/link';
// import './globals.css';
import { ArrowRight, Zap, Layers, Palette, Settings } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Modern Form Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Create stunning, professional forms with our enterprise-grade drag-and-drop builder. 
            Build complex workflows, conditional logic, and beautiful designs.
          </p>
          <Link 
            href="/form-builder"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Building <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: Zap,
              title: 'Drag & Drop',
              description: 'Intuitive drag-and-drop interface for rapid form creation'
            },
            {
              icon: Layers,
              title: 'Multi-Page Forms',
              description: 'Create complex multi-step forms with conditional logic'
            },
            {
              icon: Palette,
              title: 'Modern Design',
              description: 'Beautiful, responsive designs that work on all devices'
            },
            {
              icon: Settings,
              title: 'Advanced Features',
              description: 'Workflows, templates, validation, and enterprise integrations'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <feature.icon className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Enterprise-Ready Form Builder
              </h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                  <span>Advanced conditional logic and branching</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                  <span>Real-time collaboration and team management</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                  <span>Template library and form sharing</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                  <span>Advanced analytics and reporting</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-3 bg-gray-100 rounded"></div>
                  <div className="h-3 bg-gray-100 rounded"></div>
                </div>
              </div>
              <div className="bg-primary-600 text-white rounded-lg p-3 text-center text-sm font-medium">
                Submit Form
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}