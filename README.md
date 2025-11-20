# 🏭 Inspection Dashboard - Version 2

Advanced batch inspection management system with role-based access control, activity logging, and data export capabilities.

## ✨ Features

### 🔐 Authentication & Authorization
- **Login System**: Secure authentication with demo accounts
- **Role-Based Access Control**:
  - **Supervisor**: Full access (add, edit, delete batches, view logs)
  - **Operator**: Read-only access (view batches and details only)

### 📊 Dashboard
- Real-time statistics (Total, Passed, Failed batches)
- Batch list with filtering (All, Passed, Failed)
- Search functionality by batch number
- Click any batch to view detailed information

### ➕ Batch Management (Supervisor Only)
- Add new batches with number, result, and date
- Edit batch information
- Delete batches with confirmation dialog
- All changes are automatically saved to LocalStorage

### 📋 Activity Logs (Supervisor Only)
- Complete audit trail of all system activities
- Track user actions (login, logout, batch operations, exports)
- Filter logs by action type
- Search through log entries
- Export logs to CSV format
- Clear all logs functionality

### 📥 Data Export
- Export all batches to CSV format
- Export activity logs to CSV format
- Automatic timestamp in filename
- Works offline

### 💾 Data Persistence
- All data stored in browser LocalStorage
- Survives page refreshes and browser restarts
- No server required

### 📱 Responsive Design
- Mobile-friendly interface
- Adaptive layout for all screen sizes
- Touch-optimized controls
- Modern gradient design with smooth animations

## 🚀 Getting Started

### Demo Accounts

**Supervisor Account:**
- Username: `admin`
- Password: `admin123`
- Full access to all features

**Operator Account:**
- Username: `operator`
- Password: `oper123`
- Read-only access

### Installation

1. Clone the repository
2. Open `login.html` in a web browser
3. Login with one of the demo accounts
4. Start managing batches!

## 📁 File Structure

```
/
├── login.html          # Login page
├── index.html          # Main dashboard
├── details.html        # Batch details page
├── logs.html          # Activity logs page
├── auth.js            # Authentication & authorization logic
├── script.js          # Main dashboard functionality
├── details.js         # Batch details functionality
├── logs.js            # Activity logs functionality
├── style.css          # Complete styling with responsive design
└── README.md          # This file
```

## 🎨 UI Features

- **Gradient Background**: Modern purple gradient design
- **Sticky Navigation**: Always accessible navbar with user info
- **Card-Based Layout**: Clean, organized information display
- **Hover Effects**: Interactive elements with smooth transitions
- **Color Coding**: Visual distinction between passed (green) and failed (red) batches
- **Role Badges**: Clear visual indication of user roles

## 🔒 Security Features

- Password-based authentication
- Session management via LocalStorage
- Role-based permission checks
- Automatic logout functionality
- Redirect to login if not authenticated

## 📊 Activity Tracking

All user actions are logged:
- User login/logout events
- Batch additions, edits, and deletions
- Data exports
- Log clearances

Each log entry includes:
- Timestamp
- User name
- User role
- Action performed
- Additional details

## 💡 Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 📝 Notes

- All data is stored locally in the browser
- Clearing browser data will delete all batches and logs
- No internet connection required after initial load
- For production use, consider implementing backend storage

## 🛠️ Future Enhancements

Potential additions:
- Backend API integration
- Database storage
- Email notifications
- Advanced reporting
- Multi-language support
- Batch comments/notes
- File attachments
- User management interface

## 📄 License

MIT License - Feel free to use and modify as needed.

## 👨‍💻 Version History

- **Version 2**: Advanced features (Auth, Roles, Logs, Export, Responsive UI)
- **Version 1**: Basic batch management with search and filters
