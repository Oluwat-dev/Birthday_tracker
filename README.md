# 🎉 Birthday Tracker

A beautiful, feature-rich Progressive Web App (PWA) for tracking and managing birthdays with smart notifications and reminders.

![Birthday Tracker](https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🎂 Birthday Management
- **Add People Manually** - Simple form to add birthdays with photos
- **Excel Import** - Bulk import from Excel/CSV files with template download
- **Smart Organization** - Group people by roles, relationships, or custom categories
- **Photo Support** - Add profile pictures for each person

### 📊 Dashboard & Analytics
- **Today's Birthdays** - Highlighted view of current celebrations
- **Upcoming Reminders** - See birthdays coming up this week/month
- **Statistics Overview** - Total people, upcoming birthdays, and more
- **Celebration Tracking** - Mark birthdays as celebrated

### 🔔 Smart Notifications
- **Browser Notifications** - Get reminded before birthdays
- **Customizable Timing** - Set reminders 1-7 days in advance
- **Today's Alerts** - Special notifications for current birthdays
- **Permission Management** - Easy notification setup

### 📱 Progressive Web App
- **Install on Device** - Works like a native mobile app
- **Offline Support** - Access your data without internet
- **Responsive Design** - Beautiful on desktop, tablet, and mobile
- **Fast Loading** - Optimized performance with caching

### 📤 Data Management
- **Export Options** - Download data as Excel or CSV
- **Data Backup** - Keep your birthday data safe
- **Import/Export** - Easy migration between devices
- **Local Storage** - All data stored securely on your device

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/birthday-tracker.git
   cd birthday-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the app
npm run build

# Preview the build
npm run preview
```

## 📖 How to Use

### Adding People
1. Click **"Add Person"** in the sidebar
2. Fill in the person's details:
   - Full name (required)
   - Date of birth (required)
   - Phone number (optional)
   - Role/Group (required)
   - Photo (optional)
3. Click **"Add Person"** to save

### Importing from Excel
1. Go to **"Import Excel"** section
2. Download the template file for proper formatting
3. Fill your Excel file with columns:
   - Full Name
   - Date of Birth (YYYY-MM-DD or MM/DD/YYYY)
   - Phone Number
   - Role or Group
4. Drag & drop or select your file
5. Review the preview and click **"Import"**

### Setting Up Notifications
1. Navigate to **"Settings"**
2. Click **"Enable"** for browser notifications
3. Allow notifications when prompted
4. Choose how many days before to be reminded
5. Save your settings

### Managing Birthdays
- **View All**: See complete list with filtering and sorting
- **Edit**: Click the edit icon on any person card
- **Delete**: Click the trash icon to remove someone
- **Mark Celebrated**: For today's birthdays, mark as celebrated
- **Export**: Download your data from Settings

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin with Workbox
- **Date Handling**: date-fns
- **Excel Processing**: SheetJS (xlsx)
- **Storage**: Browser LocalStorage

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── BirthdayList.tsx # List view with filters
│   ├── PersonForm.tsx   # Add/edit person form
│   ├── PersonCard.tsx   # Individual person card
│   ├── FileUpload.tsx   # Excel import component
│   ├── PhotoUpload.tsx  # Photo upload component
│   └── Settings.tsx     # Settings management
├── hooks/               # Custom React hooks
│   └── usePeople.ts     # People data management
├── utils/               # Utility functions
│   ├── dateUtils.ts     # Date calculations
│   ├── excelUtils.ts    # Excel import/export
│   ├── notifications.ts # Browser notifications
│   └── storage.ts       # LocalStorage management
├── types/               # TypeScript type definitions
│   └── index.ts         # Main type definitions
└── App.tsx              # Main application component
```

## 🎨 Features in Detail

### Dashboard
- **Statistics Cards**: Quick overview of your birthday data
- **Today's Birthdays**: Special highlighting with celebration tracking
- **Tomorrow's Birthdays**: Never miss an upcoming birthday
- **This Week**: See all birthdays coming up in the next 7 days

### Birthday List
- **Advanced Filtering**: Search by name, filter by group or month
- **Multiple Sorting**: Sort by upcoming date, name, or age
- **Bulk Actions**: Export filtered results
- **Quick Actions**: Edit, delete, or mark celebrated directly from cards

### Smart Notifications
- **Intelligent Timing**: Notifications at 9 AM for better visibility
- **Customizable Reminders**: Choose 1-7 days advance notice
- **Today's Special Alerts**: Enhanced notifications for current birthdays
- **Persistent Reminders**: Important birthdays require interaction

## 🔧 Configuration

### Notification Settings
- Enable/disable browser notifications
- Set reminder timing (1-7 days before)
- Manage browser permissions

### Data Management
- Export data in Excel or CSV format
- Clear all data (with confirmation)
- View storage usage statistics

## 🌟 PWA Features

### Installation
- **Desktop**: Install button appears in supported browsers
- **Mobile**: "Add to Home Screen" option available
- **Offline**: Full functionality without internet connection

### Caching Strategy
- **App Shell**: Cached for instant loading
- **Data**: Stored locally for offline access
- **Images**: External images cached for performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Images from [Pexels](https://pexels.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/birthday-tracker/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible for faster resolution

---

**Made with ❤️ for never forgetting important birthdays**