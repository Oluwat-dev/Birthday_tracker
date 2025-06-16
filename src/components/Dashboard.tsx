import React from 'react';
import { Calendar, Gift, Users, Bell } from 'lucide-react';
import { Person } from '../types';
import { 
  getDaysUntilBirthday, 
  isBirthdayToday, 
  isBirthdayTomorrow,
  isBirthdayUpcoming,
  formatBirthday,
  getAge
} from '../utils/dateUtils';

interface DashboardProps {
  people: Person[];
}

export const Dashboard: React.FC<DashboardProps> = ({ people }) => {
  const todaysBirthdays = people.filter(person => isBirthdayToday(person.dateOfBirth));
  const tomorrowsBirthdays = people.filter(person => isBirthdayTomorrow(person.dateOfBirth));
  const upcomingBirthdays = people.filter(person => 
    isBirthdayUpcoming(person.dateOfBirth, 7) && 
    !isBirthdayToday(person.dateOfBirth) && 
    !isBirthdayTomorrow(person.dateOfBirth)
  ).sort((a, b) => getDaysUntilBirthday(a.dateOfBirth) - getDaysUntilBirthday(b.dateOfBirth));

  const stats = [
    {
      title: 'Total People',
      value: people.length,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Today\'s Birthdays',
      value: todaysBirthdays.length,
      icon: Gift,
      color: 'bg-red-500'
    },
    {
      title: 'This Week',
      value: people.filter(person => isBirthdayUpcoming(person.dateOfBirth, 7)).length,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Upcoming',
      value: people.filter(person => isBirthdayUpcoming(person.dateOfBirth, 30)).length,
      icon: Bell,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Birthdays */}
      {todaysBirthdays.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-900">🎉 Today's Birthdays</h2>
          </div>
          <div className="space-y-3">
            {todaysBirthdays.map(person => (
              <div key={person.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {person.photo ? (
                      <img 
                        src={person.photo} 
                        alt={person.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold text-lg">
                          {person.fullName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{person.fullName}</h3>
                      <p className="text-sm text-gray-600">Turning {getAge(person.dateOfBirth) + 1} today!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">{person.roleOrGroup}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tomorrow's Birthdays */}
      {tomorrowsBirthdays.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-bold text-orange-900">Tomorrow's Birthdays</h2>
          </div>
          <div className="space-y-3">
            {tomorrowsBirthdays.map(person => (
              <div key={person.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {person.photo ? (
                      <img 
                        src={person.photo} 
                        alt={person.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">
                          {person.fullName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{person.fullName}</h3>
                      <p className="text-sm text-gray-600">{person.roleOrGroup}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">Tomorrow</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Birthdays */}
      {upcomingBirthdays.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Upcoming This Week</h2>
          </div>
          <div className="space-y-3">
            {upcomingBirthdays.map(person => {
              const daysUntil = getDaysUntilBirthday(person.dateOfBirth);
              return (
                <div key={person.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    {person.photo ? (
                      <img 
                        src={person.photo} 
                        alt={person.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {person.fullName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{person.fullName}</h3>
                      <p className="text-sm text-gray-600">{person.roleOrGroup}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">
                      {formatBirthday(person.dateOfBirth)}
                    </p>
                    <p className="text-xs text-gray-500">
                      in {daysUntil} day{daysUntil === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {people.length === 0 && (
        <div className="text-center py-12">
          <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No birthdays yet</h3>
          <p className="text-gray-600 mb-6">Import your Excel file or add people manually to get started.</p>
        </div>
      )}
    </div>
  );
};