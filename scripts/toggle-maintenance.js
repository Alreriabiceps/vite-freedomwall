#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current file directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the maintenance config file
const configPath = path.join(__dirname, "../src/config/maintenance.js");

// Function to read current config
function readConfig() {
  try {
    const content = fs.readFileSync(configPath, "utf8");
    const enabledMatch = content.match(/enabled:\s*(true|false)/);
    const enabled = enabledMatch ? enabledMatch[1] === "true" : false;

    const estimatedEndTimeMatch = content.match(
      /estimatedEndTime:\s*("([^"]*)"|null)/
    );
    const estimatedEndTime =
      estimatedEndTimeMatch && estimatedEndTimeMatch[2]
        ? estimatedEndTimeMatch[2]
        : null;

    const customMessageMatch = content.match(/customMessage:\s*"([^"]*)"/);
    const customMessage = customMessageMatch
      ? customMessageMatch[1]
      : "We're working hard to improve your experience!";

    return { enabled, estimatedEndTime, customMessage };
  } catch (error) {
    console.error("Error reading config file:", error.message);
    return null;
  }
}

// Function to write config
function writeConfig(config) {
  try {
    const content = `// Maintenance Mode Configuration
export const MAINTENANCE_CONFIG = {
  // Set to true to enable maintenance mode
  enabled: ${config.enabled},
  
  // Optional: Set a specific date when maintenance will end
  // Format: "YYYY-MM-DD HH:MM:SS" (24-hour format)
  // Leave as null if you don't want to show an estimated end time
  estimatedEndTime: ${
    config.estimatedEndTime ? `"${config.estimatedEndTime}"` : "null"
  },
  
  // Optional: Custom message to display during maintenance
  customMessage: "${config.customMessage}",
  
  // Optional: Show admin bypass option (only works if user has admin access)
  allowAdminBypass: true,
  
  // Optional: Maintenance reason (for admin reference)
  reason: "System updates and improvements"
};

// Helper function to check if maintenance mode is enabled
export const isMaintenanceMode = () => {
  return MAINTENANCE_CONFIG.enabled;
};

// Helper function to get maintenance config
export const getMaintenanceConfig = () => {
  return MAINTENANCE_CONFIG;
};

// Helper function to format estimated end time
export const formatEstimatedEndTime = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting maintenance end time:', error);
    return null;
  }
};
`;

    fs.writeFileSync(configPath, content);
    return true;
  } catch (error) {
    console.error("Error writing config file:", error.message);
    return false;
  }
}

// Function to enable maintenance mode
function enableMaintenance(options = {}) {
  const currentConfig = readConfig();
  if (!currentConfig) return false;

  const newConfig = {
    enabled: true,
    estimatedEndTime:
      options.estimatedEndTime || currentConfig.estimatedEndTime,
    customMessage: options.customMessage || currentConfig.customMessage,
  };

  if (writeConfig(newConfig)) {
    console.log("✅ Maintenance mode ENABLED");
    if (newConfig.estimatedEndTime) {
      console.log(`📅 Estimated end time: ${newConfig.estimatedEndTime}`);
    }
    console.log(`💬 Message: ${newConfig.customMessage}`);
    console.log(
      "\n🔄 Rebuild and deploy your app to see the maintenance page!"
    );
  } else {
    console.log("❌ Failed to enable maintenance mode");
  }
}

// Function to disable maintenance mode
function disableMaintenance() {
  const currentConfig = readConfig();
  if (!currentConfig) return false;

  const newConfig = {
    enabled: false,
    estimatedEndTime: currentConfig.estimatedEndTime,
    customMessage: currentConfig.customMessage,
  };

  if (writeConfig(newConfig)) {
    console.log("✅ Maintenance mode DISABLED");
    console.log(
      "\n🔄 Rebuild and deploy your app to restore normal functionality!"
    );
  } else {
    console.log("❌ Failed to disable maintenance mode");
  }
}

// Function to set estimated end time
function setEstimatedEndTime(dateTime) {
  const currentConfig = readConfig();
  if (!currentConfig) return false;

  const newConfig = {
    enabled: currentConfig.enabled,
    estimatedEndTime: dateTime,
    customMessage: currentConfig.customMessage,
  };

  if (writeConfig(newConfig)) {
    console.log(`✅ Estimated end time set to: ${dateTime}`);
  } else {
    console.log("❌ Failed to set estimated end time");
  }
}

// Function to set custom message
function setCustomMessage(message) {
  const currentConfig = readConfig();
  if (!currentConfig) return false;

  const newConfig = {
    enabled: currentConfig.enabled,
    estimatedEndTime: currentConfig.estimatedEndTime,
    customMessage: message,
  };

  if (writeConfig(newConfig)) {
    console.log(`✅ Custom message set to: "${message}"`);
  } else {
    console.log("❌ Failed to set custom message");
  }
}

// Function to show current status
function showStatus() {
  const config = readConfig();
  if (!config) return;

  console.log("\n🔧 Maintenance Mode Status:");
  console.log(`   Status: ${config.enabled ? "🟡 ENABLED" : "🟢 DISABLED"}`);
  console.log(`   Estimated End: ${config.estimatedEndTime || "Not set"}`);
  console.log(`   Message: "${config.customMessage}"`);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "enable":
      const options = {};

      // Parse estimated end time if provided
      const endTimeIndex = args.indexOf("--end-time");
      if (endTimeIndex !== -1 && args[endTimeIndex + 1]) {
        options.estimatedEndTime = args[endTimeIndex + 1];
      }

      // Parse custom message if provided
      const messageIndex = args.indexOf("--message");
      if (messageIndex !== -1 && args[messageIndex + 1]) {
        options.customMessage = args[messageIndex + 1];
      }

      enableMaintenance(options);
      break;

    case "disable":
      disableMaintenance();
      break;

    case "set-end-time":
      if (args[1]) {
        setEstimatedEndTime(args[1]);
      } else {
        console.log("❌ Please provide a date/time (YYYY-MM-DD HH:MM:SS)");
      }
      break;

    case "set-message":
      if (args[1]) {
        setCustomMessage(args[1]);
      } else {
        console.log("❌ Please provide a message");
      }
      break;

    case "status":
      showStatus();
      break;

    case "help":
    default:
      console.log(`
🔧 Maintenance Mode Control Script

Usage:
  node toggle-maintenance.js <command> [options]

Commands:
  enable                    Enable maintenance mode
  disable                   Disable maintenance mode
  set-end-time <datetime>  Set estimated end time (YYYY-MM-DD HH:MM:SS)
  set-message <message>     Set custom maintenance message
  status                    Show current maintenance status
  help                      Show this help message

Examples:
  # Enable maintenance mode
  node toggle-maintenance.js enable
  
  # Enable with custom end time
  node toggle-maintenance.js enable --end-time "2024-01-15 18:00:00"
  
  # Enable with custom message
  node toggle-maintenance.js enable --message "We'll be back in 2 hours!"
  
  # Enable with both
  node toggle-maintenance.js enable --end-time "2024-01-15 18:00:00" --message "Scheduled maintenance"
  
  # Disable maintenance mode
  node toggle-maintenance.js disable
  
  # Check status
  node toggle-maintenance.js status

Note: After changing the config, you need to rebuild and deploy your app for changes to take effect.
      `);
      break;
  }
}

// Run the script
main();
