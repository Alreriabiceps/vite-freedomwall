# 🔧 Maintenance Mode System

The Freedom Wall now includes a comprehensive maintenance mode system that allows you to temporarily disable the website and show a professional maintenance page to users.

## 🚀 Quick Start

### Enable Maintenance Mode

```bash
# Navigate to the frontend directory
cd frontend

# Enable maintenance mode
node scripts/toggle-maintenance.js enable

# Enable with custom end time
node scripts/toggle-maintenance.js enable --end-time "2024-01-15 18:00:00"

# Enable with custom message
node scripts/toggle-maintenance.js enable --message "We'll be back in 2 hours!"

# Enable with both
node scripts/toggle-maintenance.js enable --end-time "2024-01-15 18:00:00" --message "Scheduled maintenance"
```

### Disable Maintenance Mode

```bash
# Disable maintenance mode
node scripts/toggle-maintenance.js disable
```

### Check Status

```bash
# Check current maintenance status
node scripts/toggle-maintenance.js status
```

## 📋 Available Commands

| Command        | Description                     | Example                                                                         |
| -------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| `enable`       | Enable maintenance mode         | `node scripts/toggle-maintenance.js enable`                                     |
| `disable`      | Disable maintenance mode        | `node scripts/toggle-maintenance.js disable`                                    |
| `set-end-time` | Set estimated completion time   | `node scripts/toggle-maintenance.js set-end-time "2024-01-15 18:00:00"`         |
| `set-message`  | Set custom maintenance message  | `node scripts/toggle-maintenance.js set-message "We're upgrading our servers!"` |
| `status`       | Show current maintenance status | `node scripts/toggle-maintenance.js status`                                     |
| `help`         | Show help information           | `node scripts/toggle-maintenance.js help`                                       |

## ⚙️ Configuration Options

The maintenance system can be configured in `src/config/maintenance.js`:

```javascript
export const MAINTENANCE_CONFIG = {
  // Enable/disable maintenance mode
  enabled: false,

  // Estimated completion time (YYYY-MM-DD HH:MM:SS)
  estimatedEndTime: null,

  // Custom message to display
  customMessage: "We're working hard to improve your experience!",

  // Allow admin bypass
  allowAdminBypass: true,

  // Maintenance reason (for admin reference)
  reason: "System updates and improvements",
};
```

## 🎨 Customization

### Custom Messages

You can set custom messages to inform users about:

- What you're working on
- Expected duration
- What improvements are coming
- Any specific issues being resolved

### Estimated End Times

Set specific completion times to give users expectations:

- Use format: `"YYYY-MM-DD HH:MM:SS"`
- Example: `"2024-01-15 18:00:00"`

### Admin Access

- Admins can still access the system during maintenance
- Useful for monitoring and testing
- Admin bypass is enabled by default

## 🔄 Deployment Workflow

1. **Enable Maintenance Mode**

   ```bash
   node scripts/toggle-maintenance.js enable --message "Scheduled maintenance" --end-time "2024-01-15 18:00:00"
   ```

2. **Build and Deploy**

   ```bash
   npm run build
   # Deploy to your hosting platform
   ```

3. **Perform Maintenance**

   - Make your changes
   - Test everything works

4. **Disable Maintenance Mode**

   ```bash
   node scripts/toggle-maintenance.js disable
   ```

5. **Redeploy**
   ```bash
   npm run build
   # Deploy to your hosting platform
   ```

## 🎯 Use Cases

### Scheduled Maintenance

- System updates
- Database migrations
- Security patches
- Performance improvements

### Emergency Maintenance

- Critical bug fixes
- Security incidents
- Server issues
- Database problems

### Planned Upgrades

- New features
- UI improvements
- Backend enhancements
- Infrastructure changes

## 🛡️ Features

- **Professional Design**: Clean, modern maintenance page
- **Responsive Layout**: Works on all devices
- **Custom Messages**: Inform users about what's happening
- **Estimated Times**: Set user expectations
- **Admin Bypass**: Admins can still access the system
- **Easy Control**: Simple command-line interface
- **Instant Updates**: Changes take effect immediately after rebuild

## 📱 Mobile Optimized

The maintenance page is fully responsive and looks great on:

- Mobile phones
- Tablets
- Desktop computers
- All screen sizes

## 🚨 Important Notes

1. **Changes require rebuild**: After updating the config, you must rebuild and deploy your app
2. **Admin access**: Admins can still access the system during maintenance
3. **No data loss**: Maintenance mode only affects the frontend display
4. **Backup first**: Always backup your data before major maintenance
5. **Test thoroughly**: Test your changes before disabling maintenance mode

## 🆘 Troubleshooting

### Maintenance page not showing

- Check that `enabled: true` in the config
- Rebuild and redeploy your app
- Clear browser cache

### Can't access admin panel

- Ensure `allowAdminBypass: true`
- Check your admin credentials
- Verify the admin route is working

### Custom message not updating

- Check the message format in the config
- Rebuild and redeploy
- Clear browser cache

## 📞 Support

If you encounter any issues with the maintenance system:

1. Check the configuration file
2. Verify the script is working
3. Check the browser console for errors
4. Ensure all files are properly deployed

---

**Happy maintaining! 🛠️✨**
