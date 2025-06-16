import React from 'react';
import { Calendar, Phone, Edit2, Trash2, Gift, Check, X } from 'lucide-react';
import { Person } from '../types';
import { 
  formatBirthday, 
  getDaysUntilBirthday, 
  getAge,
  isBirthdayToday,
  isBirthdayTomorrow
} from '../utils/dateUtils';

interface PersonCardProps {
  person: Person;
  onEdit: () => void;
  onDelete: () => void;
  onMarkCelebrated: (celebrated: boolean) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  person,
  onEdit,
  onDelete,
  onMarkCelebrated
}) => {
  const daysUntil = getDaysUntilBirthday(person.dateOfBirth);
  const age = getAge(person.dateOfBirth);
  const isToday = isBirthdayToday(person.dateOfBirth);
  const isTomorrow = isBirthdayTomorrow(person.dateOfBirth);

  const getBirthdayStatus = () => {
    if (isToday) return { text: 'Today!', color: 'text-red-600', bg: 'bg-red-50' };
    if (isTomorrow) return { text: 'Tomorrow', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (daysUntil <= 7) return { text: `${daysUntil} days`, color: 'text-blue-600', bg: 'bg-blue-50' };
    return { text: `${daysUntil} days`, color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const status = getBirthdayStatus();

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
      isToday ? 'border-red-200 ring-2 ring-red-100' : 
      isTomorrow ? 'border-orange-200' : 'border-gray-100'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {person.photo ? (
              <img 
                src={person.photo} 
                alt={person.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-lg">
                  {person.fullName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{person.fullName}</h3>
              <p className="text-sm text-gray-600">{person.roleOrGroup}</p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Birthday Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {formatBirthday(person.dateOfBirth)} (Age {age})
            </span>
          </div>
          
          {person.phoneNumber && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{person.phoneNumber}</span>
            </div>
          )}
          
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
            <Gift className="h-4 w-4" />
            {status.text}
          </div>
        </div>

        {/* Celebration Status */}
        {isToday && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Celebrated?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onMarkCelebrated(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    person.celebrated 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onMarkCelebrated(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    !person.celebrated 
                      ? 'bg-gray-100 text-gray-600' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};