// components/ComponentPalette.tsx
import React, { useState } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { CATEGORIES, COMPONENT_PALETTE_ITEMS } from '@/lib/constants';
import { ComponentPaletteProps, FormElementType } from '@/lib/types';


export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onElementAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredItems = COMPONENT_PALETTE_ITEMS.filter(item => {
    const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof COMPONENT_PALETTE_ITEMS>);

  const categories = [
    { key: 'all', label: 'All Components' },
    ...Object.entries(CATEGORIES).map(([key, label]) => ({ key, label }))
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Components</h2>
          <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          {categories.map(category => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedCategory === 'all' ? (
          // Show all categories with grouping
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs uppercase font-semibold text-gray-500 mb-3 tracking-wider">
                  {CATEGORIES[category as keyof typeof CATEGORIES]}
                </h3>
                <ComponentGrid items={items} viewMode={viewMode} onElementAdd={onElementAdd} />
              </div>
            ))}
          </div>
        ) : (
          // Show filtered items
          <ComponentGrid items={filteredItems} viewMode={viewMode} onElementAdd={onElementAdd} />
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm">No components found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component Grid/List renderer
const ComponentGrid: React.FC<{
  items: typeof COMPONENT_PALETTE_ITEMS;
  viewMode: 'grid' | 'list';
  onElementAdd: (type: FormElementType) => void;
}> = ({ items, viewMode, onElementAdd }) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.type}
              onClick={() => onElementAdd(item.type)}
              className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center group"
              title={`Add ${item.label}`}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <IconComponent className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900 text-xs leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.type}
            onClick={() => onElementAdd(item.type)}
            className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
            title={`Add ${item.label}`}
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
              <IconComponent className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">
                {item.label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {item.type}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};