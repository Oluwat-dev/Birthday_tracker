import React, { useState } from 'react';
import { Search, Filter, Calendar, Phone, Edit2, Trash2, Gift, Check } from 'lucide-react';
import { Person } from '../types';
import { PersonCard } from './PersonCard';
import { PersonForm } from './PersonForm';
import { 
  formatBirthday, 
  getDaysUntilBirthday, 
  getAge,
  sortByUpcomingBirthday,
  getMonthName
} from '../utils/dateUtils';
import { exportToExcel, exportToCSV } from '../utils/excelUtils';

interface BirthdayListProps {
  people: Person[];
  onUpdatePerson: (id: string, updates: Partial<Person>) => void;
  onDeletePerson: (id: string) => void;
  onMarkCelebrated: (id: string, celebrated: boolean) => void;
}

export const BirthdayList: React.FC<BirthdayListProps> = ({
  people,
  onUpdatePerson,
  onDeletePerson,
  onMarkCelebrated
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [sortBy, setSortBy] = useState<'upcoming' | 'name' | 'age'>('upcoming');
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  // Get unique groups and months for filters
  const uniqueGroups = Array.from(new Set(people.map(p => p.roleOrGroup))).sort();
  const uniqueMonths = Array.from(new Set(people.map(p => {
    const date = new Date(p.dateOfBirth);
    return date.getMonth();
  }))).sort((a, b) => a - b);

  // Filter and sort people
  const filteredPeople = people.filter(person => {
    const matchesSearch = person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.roleOrGroup.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !filterGroup || person.roleOrGroup === filterGroup;
    const matchesMonth = !filterMonth || new Date(person.dateOfBirth).getMonth() === parseInt(filterMonth);
    
    return matchesSearch && matchesGroup && matchesMonth;
  });

  const sortedPeople = [...filteredPeople].sort((a, b) => {
    switch (sortBy) {
      case 'upcoming':
        return getDaysUntilBirthday(a.dateOfBirth) - getDaysUntilBirthday(b.dateOfBirth);
      case 'name':
        return a.fullName.localeCompare(b.fullName);
      case 'age':
        return getAge(b.dateOfBirth) - getAge(a.dateOfBirth);
      default:
        return 0;
    }
  });

  const handleExport = (format: 'excel' | 'csv') => {
    if (format === 'excel') {
      exportToExcel(filteredPeople);
    } else {
      exportToCSV(filteredPeople);
    }
  };

  if (editingPerson) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Person</h2>
        <PersonForm
          person={editingPerson}
          onSubmit={(updates) => {
            onUpdatePerson(editingPerson.id, updates);
            setEditingPerson(null);
          }}
          onCancel={() => setEditingPerson(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Birthdays</h2>
          <p className="text-gray-600">{filteredPeople.length} people</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Export Excel
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search names or groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Group Filter */}
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Groups</option>
            {uniqueGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>

          {/* Month Filter */}
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Months</option>
            {uniqueMonths.map(month => (
              <option key={month} value={month}>{getMonthName(month)}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'upcoming' | 'name' | 'age')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="upcoming">Sort by Upcoming</option>
            <option value="name">Sort by Name</option>
            <option value="age">Sort by Age</option>
          </select>
        </div>
      </div>

      {/* Birthday List */}
      {sortedPeople.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No birthdays found</h3>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPeople.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              onEdit={() => setEditingPerson(person)}
              onDelete={() => onDeletePerson(person.id)}
              onMarkCelebrated={(celebrated) => onMarkCelebrated(person.id, celebrated)}
            />
          ))}
        </div>
      )}
    </div>
  );
};