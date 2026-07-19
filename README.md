🛴 Ninebot D18 Bluetooth Controller
====================================

A web-based application to control your Ninebot D18 electric scooter via Bluetooth Low Energy (BLE). Adjust speed limits, monitor telemetry, and customize settings.

## Features

✨ **Bluetooth Connectivity**
- Connect wirelessly to your Ninebot D18 scooter
- Real-time connection status monitoring

📊 **Live Telemetry**
- Current speed
- Maximum speed limit
- Battery percentage
- Total distance traveled
- Motor temperature
- Current riding mode

⚡ **Speed Control**
- Set speed limits from 20 to 55 km/h
- Quick preset buttons (20, 30, 40, 50, 55 km/h)
- Interactive slider control
- Visual feedback of current setting

⚙️ **Settings Customization**
- Toggle DRL (Daytime Running Light)
- Adjust speaker volume
- Control light brightness

📝 **Activity Logging**
- Real-time action log
- Connection status tracking
- Error and success notifications

## Getting Started

### Requirements
- Modern web browser with Web Bluetooth API support (Chrome, Edge, Opera, Brave)
- Ninebot D18 scooter
- Bluetooth-enabled device (smartphone, tablet, or computer)

### Supported Browsers
- ✅ Chrome 56+
- ✅ Edge 79+
- ✅ Opera 43+
- ✅ Brave
- ❌ Firefox (Web Bluetooth not supported)
- ❌ Safari (Web Bluetooth not supported)

### Installation

1. Clone or download this repository
```bash
git clone https://github.com/kevinilles0301-a11y/ninebot-d18-controller.git
cd ninebot-d18-controller
```

2. Open `index.html` in a supported browser
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

3. Or serve with a local web server (recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then open: http://localhost:8000
```

## Usage

### Connect to Your Scooter

1. **Enable Bluetooth** on your device
2. **Power on** your Ninebot D18
3. Click the **"Connect to Scooter"** button
4. Select **"NinebotD18"** or **"Ninebot"** from the device list
5. Click **"Pair"** if prompted

### Adjust Speed Limit

1. Use the slider to select your desired speed (20-55 km/h)
2. Or click one of the preset buttons (20, 30, 40, 50, 55)
3. Click **"Apply Speed Limit"**
4. Wait for confirmation

### Monitor Telemetry

Real-time data updates automatically:
- **Current Speed**: Your actual riding speed
- **Max Speed**: Your current speed limit setting
- **Battery**: Remaining battery percentage
- **Distance**: Total kilometers traveled
- **Temperature**: Motor temperature
- **Mode**: Current riding mode (Eco, Sport, Race, Walk)

### Customize Settings

1. Check/uncheck **DRL** to enable daytime running lights
2. Adjust **Speaker Volume** with the slider
3. Adjust **Light Brightness** with the slider
4. Click **"Apply Settings"**

## Protocol Information

This app uses the **Ninebot BLE Protocol** based on:
- [NootNooot/segway-ninebot-ble](https://codeberg.org/NootNooot/segway-ninebot-ble)
- Nordic UART Service (6e400001-b5a3-f393-e0a9-e50e24dcca9e)

### Key Parameters
- `0x74` - Max speed (km/h × 100)
- `0x61` - Battery level (%)
- `0x65` - Total distance (m)
- `0x71` - Temperature (°C)
- `0x56` - Current speed (km/h × 100)
- `0x7C` - Ride mode

For more details, see the [Ninebot Protocol Documentation](https://nootnooot.codeberg.page/segway-ninebot-ble/).

## Troubleshooting

### Can't connect to scooter
- ✓ Ensure Bluetooth is enabled on your device
- ✓ Make sure your Ninebot D18 is powered on
- ✓ Keep the scooter within Bluetooth range (10 meters)
- ✓ Try turning off and on Bluetooth on your device
- ✓ Restart the scooter
- ✓ Clear browser cache and reload the page

### Speed changes not taking effect
- ✓ Confirm the scooter is connected (green status dot)
- ✓ Try disconnecting and reconnecting
- ✓ Ensure you're not riding at the moment of adjustment
- ✓ Check that your speed is within 20-55 km/h range

### Telemetry not updating
- ✓ Check your Bluetooth connection
- ✓ Wait a few seconds for data to sync
- ✓ Try clicking "Apply" buttons to refresh
- ✓ Reload the page and reconnect

### Browser compatibility issues
- ✓ Use Chrome, Edge, Brave, or Opera
- ✓ Update your browser to the latest version
- ✓ Enable "Experimental Web Platform features" in Chrome flags if needed
- ✓ Check that you're on HTTPS (required for Web Bluetooth on non-localhost)

## Safety Information

⚠️ **Important Safety Notes:**
- Always ride responsibly and follow local traffic laws
- Higher speeds may reduce battery range
- Monitor your scooter's temperature - avoid extreme speeds in hot weather
- Perform regular maintenance and firmware updates from Segway
- Wear appropriate safety gear (helmet, pads)
- Do not modify firmware or settings while riding

## Limitations

- ⚠️ Some features may not work if your scooter firmware doesn't support them
- ⚠️ The app requires Web Bluetooth API support (not available on all browsers)
- ⚠️ Connection may drop if device moves out of Bluetooth range
- ⚠️ Some telemetry values may be simulated if not supported by firmware

## Legal & Disclaimers

This application is provided for **educational and personal use** on your own Ninebot D18 scooter. 

- Modifying scooter settings may void your warranty
- Check local regulations before adjusting speed limits
- The authors are not responsible for any damage or injury
- Use at your own risk

## Contributing

Found a bug or want to improve the app? 
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Resources

- [Ninebot BLE Protocol](https://nootnooot.codeberg.page/segway-ninebot-ble/)
- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Nordic UART Service](https://www.nordicsemi.com/products/nrf52-development-kit)
- [Segway Official Support](https://www.segway.com/support/)

## License

MIT License - See LICENSE file for details

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review browser console errors (F12 → Console)
3. Open an issue on GitHub with details

---

Made with ❤️ for Ninebot D18 riders

**Ride safe and have fun!** 🛴⚡
